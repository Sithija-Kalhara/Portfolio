"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

// ── Iron Man style holographic network sphere ──────────────────────────────
// A geodesic wireframe mesh (edges) + glowing node points at every vertex,
// built from a subdivided icosahedron so the triangulated network reads like
// the J.A.R.V.I.S. scan-sphere — not a generic particle cloud.
function HoloSphere() {
  const groupRef = useRef<THREE.Group>(null);
  const linesRef = useRef<THREE.LineSegments>(null);
  const nodesRef = useRef<THREE.Points>(null);
  const coreRef  = useRef<THREE.Mesh>(null);
  const scanRef  = useRef<THREE.Mesh>(null);

  const radius = 2.65;
  const detail = 3; // subdivision level — higher = denser geodesic network

  // Build the geodesic wireframe (edges only, no filled faces) once.
  const { edgeGeometry, nodePositions } = useMemo(() => {
    const base = new THREE.IcosahedronGeometry(radius, detail);
    const edges = new THREE.EdgesGeometry(base, 1);

    // Deduplicate vertex positions from the base geometry for the node dots,
    // so each lattice intersection gets exactly one glowing point.
    const posAttr = base.getAttribute("position");
    const seen = new Map<string, number>();
    const nodes: number[] = [];
    for (let i = 0; i < posAttr.count; i++) {
      const x = posAttr.getX(i);
      const y = posAttr.getY(i);
      const z = posAttr.getZ(i);
      const key = `${x.toFixed(3)}_${y.toFixed(3)}_${z.toFixed(3)}`;
      if (!seen.has(key)) {
        seen.set(key, 1);
        nodes.push(x, y, z);
      }
    }

    base.dispose();

    return {
      edgeGeometry: edges,
      nodePositions: new Float32Array(nodes),
    };
  }, [radius]);

  const nodeCount = nodePositions.length / 3;

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.11;
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.18) * 0.08;
    }

    // pulsing node brightness — like a live scanning hologram
    if (nodesRef.current) {
      const mat = nodesRef.current.material as THREE.PointsMaterial;
      mat.size = 0.05 + Math.sin(state.clock.elapsedTime * 2.2) * 0.012;
      mat.opacity = 0.75 + Math.sin(state.clock.elapsedTime * 1.6) * 0.2;
    }

    // wireframe shimmer
    if (linesRef.current) {
      const mat = linesRef.current.material as THREE.LineBasicMaterial;
      mat.opacity = 0.4 + Math.sin(state.clock.elapsedTime * 1.1) * 0.08;
    }

    // inner core breathing
    if (coreRef.current) {
      const pulse = 1 + Math.sin(state.clock.elapsedTime * 1.8) * 0.05;
      coreRef.current.scale.setScalar(pulse);
    }

    // vertical scan-line sweep through the sphere, like a face-scan readout
    if (scanRef.current) {
      const t = (state.clock.elapsedTime * 0.45) % 2; // 0 → 2 loop
      scanRef.current.position.y = radius - t * radius * 2;
      const mat = scanRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = 0.5 * (1 - Math.abs(1 - t));
    }

    // gentle mouse-reactive parallax, same feel as before
    const targetX = (state.pointer.x * Math.PI) / 22;
    const targetY = (state.pointer.y * Math.PI) / 22;
    if (groupRef.current) {
      groupRef.current.rotation.y += (targetX - groupRef.current.rotation.y * 0.05) * 0.004;
      groupRef.current.rotation.x += (-targetY - groupRef.current.rotation.x * 0.05) * 0.004;
    }
  });

  return (
    <group ref={groupRef}>
      {/* geodesic wireframe lattice */}
      <lineSegments ref={linesRef} geometry={edgeGeometry}>
        <lineBasicMaterial
          color="#00f0ff"
          transparent
          opacity={0.42}
          depthWrite={false}
        />
      </lineSegments>

      {/* glowing nodes at every lattice intersection */}
      <points ref={nodesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={nodeCount}
            array={nodePositions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          color="#a855f7"
          size={0.05}
          transparent
          opacity={0.9}
          sizeAttenuation
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* inner glowing core — the "face" the hologram is scanning */}
      <mesh ref={coreRef}>
        <icosahedronGeometry args={[0.65, 1]} />
        <meshBasicMaterial color="#7c3aed" wireframe transparent opacity={0.5} />
      </mesh>

      {/* horizontal scan-line sweep */}
      <mesh ref={scanRef} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0, radius * 1.05, 64]} />
        <meshBasicMaterial
          color="#00f0ff"
          transparent
          opacity={0.3}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>

      {/* orbit rings for depth, matching original design language */}
      <mesh rotation={[Math.PI / 2.4, 0, 0]}>
        <torusGeometry args={[3.15, 0.005, 8, 120]} />
        <meshBasicMaterial color="#00f0ff" transparent opacity={0.4} />
      </mesh>
      <mesh rotation={[Math.PI / 1.6, 0.4, 0]}>
        <torusGeometry args={[3.42, 0.004, 8, 120]} />
        <meshBasicMaterial color="#a855f7" transparent opacity={0.28} />
      </mesh>
    </group>
  );
}

function AmbientDrift() {
  const ref = useRef<THREE.Points>(null);
  const count = 400;

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 16;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 16;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 16;
    }
    return arr;
  }, []);

  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.012;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.012}
        color="#5c5c6e"
        transparent
        opacity={0.5}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

export function HeroScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 8], fov: 45 }}
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      style={{ width: "100%", height: "100%", display: "block" }}
    >
      <ambientLight intensity={0.6} />
      <pointLight position={[5, 5, 5]} intensity={0.5} color="#00f0ff" />
      <HoloSphere />
      <AmbientDrift />
    </Canvas>
  );
}
