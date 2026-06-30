"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

// ── Utility: build a flat-shaded low-poly mesh from a list of triangle faces ─
function triGeo(verts: number[][], faces: number[][]) {
  const positions: number[] = [];
  faces.forEach(([a, b, c]) => {
    positions.push(...verts[a], ...verts[b], ...verts[c]);
  });
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geo.computeVertexNormals();
  return geo;
}

// ── Glowing edge helper ────────────────────────────────────────────────────────
function GlowEdges({
  points,
  color,
  opacity = 0.7,
}: {
  points: [number, number, number][];
  color: string;
  opacity?: number;
}) {
  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(points.flat(), 3)
    );
    return g;
  }, [points]);
  return (
    <lineSegments geometry={geo}>
      <lineBasicMaterial
        color={color}
        transparent
        opacity={opacity}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </lineSegments>
  );
}

// ── Glowing dot ───────────────────────────────────────────────────────────────
function GlowDot({
  position,
  color,
  size = 0.055,
}: {
  position: [number, number, number];
  color: string;
  size?: number;
}) {
  return (
    <points>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={1}
          array={new Float32Array(position)}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        color={color}
        size={size}
        transparent
        opacity={1}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// ── Animated eye that tracks the mouse ───────────────────────────────────────
function Eye({
  basePosition,
  side,
}: {
  basePosition: [number, number, number];
  side: "left" | "right";
}) {
  const pupilRef = useRef<THREE.Mesh>(null);
  const glowRef  = useRef<THREE.Mesh>(null);
  const { viewport } = useThree();

  useFrame((state) => {
    if (!pupilRef.current || !glowRef.current) return;

    // Convert pointer to world-space-like angle
    const mx = (state.pointer.x * viewport.width)  / 2;
    const my = (state.pointer.y * viewport.height) / 2;

    // Direction from eye center to mouse
    const eyeWorld = new THREE.Vector3(...basePosition);
    const dir = new THREE.Vector3(mx - eyeWorld.x, my - eyeWorld.y, 3).normalize();

    // Pupil slides within the eye socket — max 0.13 units
    const limit = 0.13;
    pupilRef.current.position.set(
      basePosition[0] + Math.max(-limit, Math.min(limit, dir.x * 0.18)),
      basePosition[1] + Math.max(-limit, Math.min(limit, dir.y * 0.18)),
      basePosition[2] + 0.12
    );

    // Subtle pulse on glow
    const t = state.clock.elapsedTime;
    const scale = 1 + Math.sin(t * 2.4 + (side === "left" ? 0 : Math.PI)) * 0.06;
    glowRef.current.scale.setScalar(scale);
  });

  return (
    <group>
      {/* eye socket ring */}
      <mesh position={basePosition}>
        <ringGeometry args={[0.15, 0.22, 6]} />
        <meshBasicMaterial
          color="#00f0ff"
          transparent
          opacity={0.55}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* iris glow */}
      <mesh ref={glowRef} position={basePosition}>
        <circleGeometry args={[0.14, 6]} />
        <meshBasicMaterial
          color="#7c3aed"
          transparent
          opacity={0.28}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* pupil — tracks mouse */}
      <mesh ref={pupilRef} position={[basePosition[0], basePosition[1], basePosition[2] + 0.1]}>
        <circleGeometry args={[0.07, 6]} />
        <meshBasicMaterial
          color="#00f0ff"
          transparent
          opacity={0.95}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* bright center glint */}
      <GlowDot
        position={[basePosition[0], basePosition[1], basePosition[2] + 0.15]}
        color="#ffffff"
        size={0.04}
      />
    </group>
  );
}

// ── The full robot/AI face ────────────────────────────────────────────────────
function RobotFace() {
  const groupRef    = useRef<THREE.Group>(null);
  const scanRef     = useRef<THREE.Mesh>(null);
  const mouthRef    = useRef<THREE.Group>(null);

  // Subtle idle bob + mouse tilt
  useFrame((state) => {
    if (!groupRef.current) return;
    const t   = state.clock.elapsedTime;
    const mx  = state.pointer.x;
    const my  = state.pointer.y;

    // Tilt face toward mouse (gentle, max ±15°)
    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y, mx * 0.28, 0.06
    );
    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x, -my * 0.18, 0.06
    );

    // Idle bob
    groupRef.current.position.y = Math.sin(t * 0.7) * 0.06;

    // Scan line sweep
    if (scanRef.current) {
      scanRef.current.position.y = Math.sin(t * 1.1) * 1.35;
      const mat = scanRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = 0.18 + Math.sin(t * 2.2) * 0.08;
    }

    // Mouth "speaking" flicker
    if (mouthRef.current) {
      mouthRef.current.scale.y = 1 + Math.sin(t * 4.5) * 0.18;
    }
  });

  // ── Face geometry: low-poly angular panels ─────────────────────────────────
  // Skull / head outline  (angular hexagonal-ish)
  const headVerts: [number,number,number][] = [
    [ 0.00,  1.55, 0],  // 0 top center
    [-0.65,  1.20, 0],  // 1 top-left
    [ 0.65,  1.20, 0],  // 2 top-right
    [-0.95,  0.30, 0],  // 3 mid-left
    [ 0.95,  0.30, 0],  // 4 mid-right
    [-0.80, -0.75, 0],  // 5 low-left
    [ 0.80, -0.75, 0],  // 6 low-right
    [-0.40, -1.50, 0],  // 7 chin-left
    [ 0.40, -1.50, 0],  // 8 chin-right
    [ 0.00, -1.72, 0],  // 9 chin tip
  ];

  // Head panel faces
  const headFaces = [
    [0,1,2],[1,3,0],[2,0,4],
    [1,5,3],[2,4,6],
    [3,5,7],[4,6,8],
    [5,7,9],[6,9,8],[5,9,6],
  ];

  const headGeo = useMemo(() => triGeo(headVerts, headFaces), []);

  // Head edge outline for the wireframe glow
  const headEdges: [number,number,number][] = [
    headVerts[0], headVerts[1],
    headVerts[1], headVerts[3],
    headVerts[3], headVerts[5],
    headVerts[5], headVerts[7],
    headVerts[7], headVerts[9],
    headVerts[9], headVerts[8],
    headVerts[8], headVerts[6],
    headVerts[6], headVerts[4],
    headVerts[4], headVerts[2],
    headVerts[2], headVerts[0],
    // inner structure lines
    headVerts[1], headVerts[2],
    headVerts[3], headVerts[4],
    headVerts[5], headVerts[6],
    headVerts[1], headVerts[5],
    headVerts[2], headVerts[6],
  ];

  // Brow plates
  const browL: [number,number,number][] = [
    [-0.60, 0.82, 0.05], [-0.18, 0.88, 0.05],
    [-0.18, 0.88, 0.05], [-0.16, 0.72, 0.05],
    [-0.16, 0.72, 0.05], [-0.60, 0.66, 0.05],
    [-0.60, 0.66, 0.05], [-0.60, 0.82, 0.05],
  ];
  const browR: [number,number,number][] = browL.map(([x,y,z]) => [-x,y,z] as [number,number,number]);

  // Cheek panel lines
  const cheekLines: [number,number,number][] = [
    [-0.82, 0.10, 0.02], [-0.55,-0.40, 0.02],
    [-0.55,-0.40, 0.02], [-0.22,-0.38, 0.02],
    [ 0.82, 0.10, 0.02], [ 0.55,-0.40, 0.02],
    [ 0.55,-0.40, 0.02], [ 0.22,-0.38, 0.02],
  ];

  // Forehead circuit lines
  const foreheadLines: [number,number,number][] = [
    [-0.30, 1.30, 0.02], [ 0.30, 1.30, 0.02],
    [-0.15, 1.10, 0.02], [ 0.15, 1.10, 0.02],
    [ 0.00, 1.30, 0.02], [ 0.00, 1.10, 0.02],
  ];

  // Nose bridge
  const noseLines: [number,number,number][] = [
    [-0.10, 0.40, 0.06], [ 0.10, 0.40, 0.06],
    [ 0.10, 0.40, 0.06], [ 0.14, 0.10, 0.06],
    [ 0.14, 0.10, 0.06], [-0.14, 0.10, 0.06],
    [-0.14, 0.10, 0.06], [-0.10, 0.40, 0.06],
  ];

  return (
    <group ref={groupRef}>
      {/* ── Head panel — dark fill ── */}
      <mesh geometry={headGeo} position={[0, 0, -0.04]}>
        <meshBasicMaterial color="#080810" transparent opacity={0.92} />
      </mesh>

      {/* ── Head outline glow ── */}
      <GlowEdges points={headEdges} color="#00f0ff" opacity={0.65} />

      {/* ── Brow plates ── */}
      <GlowEdges points={browL} color="#a855f7" opacity={0.80} />
      <GlowEdges points={browR} color="#a855f7" opacity={0.80} />

      {/* ── Eyes (track mouse) ── */}
      <Eye basePosition={[-0.38, 0.30, 0.08]} side="left"  />
      <Eye basePosition={[ 0.38, 0.30, 0.08]} side="right" />

      {/* ── Cheek panels ── */}
      <GlowEdges points={cheekLines}    color="#00f0ff" opacity={0.45} />

      {/* ── Forehead circuit detail ── */}
      <GlowEdges points={foreheadLines} color="#7c3aed" opacity={0.55} />

      {/* ── Nose bridge ── */}
      <GlowEdges points={noseLines}     color="#00f0ff" opacity={0.50} />

      {/* ── Mouth — animated ── */}
      <group ref={mouthRef} position={[0, -0.82, 0.06]}>
        <GlowEdges
          points={[
            [-0.28, 0, 0], [-0.14, -0.06, 0],
            [-0.14, -0.06, 0], [0, -0.08, 0],
            [0, -0.08, 0],  [ 0.14, -0.06, 0],
            [ 0.14, -0.06, 0], [ 0.28,  0, 0],
          ]}
          color="#00f0ff"
          opacity={0.75}
        />
        {/* speaker-grid dots below mouth */}
        {[-0.18,-0.08,0,0.08,0.18].map((x, i) => (
          <GlowDot key={i} position={[x, -0.20, 0]} color="#7c3aed" size={0.025} />
        ))}
      </group>

      {/* ── Jaw detail lines ── */}
      <GlowEdges
        points={[
          [-0.55,-0.90, 0.02], [-0.28,-1.30, 0.02],
          [ 0.55,-0.90, 0.02], [ 0.28,-1.30, 0.02],
          [-0.28,-1.30, 0.02], [ 0.28,-1.30, 0.02],
        ]}
        color="#7c3aed"
        opacity={0.45}
      />

      {/* ── Temple accent nodes ── */}
      <GlowDot position={[-0.88, 0.55, 0.02]} color="#00f0ff" size={0.05} />
      <GlowDot position={[ 0.88, 0.55, 0.02]} color="#00f0ff" size={0.05} />
      <GlowDot position={[-0.70,-0.55, 0.02]} color="#a855f7" size={0.04} />
      <GlowDot position={[ 0.70,-0.55, 0.02]} color="#a855f7" size={0.04} />

      {/* ── Horizontal scan-line sweep ── */}
      <mesh ref={scanRef} position={[0, 0, 0.10]}>
        <planeGeometry args={[2.2, 0.06]} />
        <meshBasicMaterial
          color="#00f0ff"
          transparent
          opacity={0.22}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* ── Outer ring halo ── */}
      <mesh position={[0, 0, -0.10]}>
        <ringGeometry args={[1.78, 1.88, 48]} />
        <meshBasicMaterial
          color="#7c3aed"
          transparent
          opacity={0.30}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      <mesh position={[0, 0, -0.12]}>
        <ringGeometry args={[1.95, 2.00, 48]} />
        <meshBasicMaterial
          color="#00f0ff"
          transparent
          opacity={0.18}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
}

// ── Ambient floating particles for depth ─────────────────────────────────────
function AmbientDrift() {
  const ref   = useRef<THREE.Points>(null);
  const count = 280;
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3]     = (Math.random() - 0.5) * 14;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 14;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 14;
    }
    return arr;
  }, []);

  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.012;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.010} color="#5c5c6e" transparent opacity={0.45} sizeAttenuation depthWrite={false} />
    </points>
  );
}

// ── Canvas export ─────────────────────────────────────────────────────────────
export function HeroScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 5.5], fov: 42 }}
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      style={{ width: "100%", height: "100%", display: "block" }}
    >
      <ambientLight intensity={0.5} />
      <pointLight position={[3, 3, 4]}  intensity={0.6} color="#00f0ff" />
      <pointLight position={[-3, -2, 3]} intensity={0.4} color="#7c3aed" />
      <RobotFace />
      <AmbientDrift />
    </Canvas>
  );
}
