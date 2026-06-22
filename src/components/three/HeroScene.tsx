"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

function ParticleSphere() {
  const groupRef = useRef<THREE.Group>(null);
  const pointsRef = useRef<THREE.Points>(null);
  const coreRef = useRef<THREE.Mesh>(null);

  const particleCount = 2200;
  const radius = 2.6;

  const { positions, colors } = useMemo(() => {
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const colorViolet = new THREE.Color("#a855f7");
    const colorCyan = new THREE.Color("#00f0ff");

    for (let i = 0; i < particleCount; i++) {
      // Fibonacci sphere distribution for an even, organic spread
      const t = i / particleCount;
      const phi = Math.acos(1 - 2 * t);
      const theta = Math.PI * (1 + Math.sqrt(5)) * i;

      const r = radius * (0.85 + Math.random() * 0.3);
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      const mixed = colorViolet.clone().lerp(colorCyan, Math.random());
      colors[i * 3] = mixed.r;
      colors[i * 3 + 1] = mixed.g;
      colors[i * 3 + 2] = mixed.b;
    }

    return { positions, colors };
  }, []);

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.09;
      groupRef.current.rotation.x =
        Math.sin(state.clock.elapsedTime * 0.15) * 0.1;
    }
    if (pointsRef.current) {
      const material = pointsRef.current.material as THREE.PointsMaterial;
      material.size = 0.045 + Math.sin(state.clock.elapsedTime * 1.4) * 0.008;
    }
    if (coreRef.current) {
      const pulse = 1 + Math.sin(state.clock.elapsedTime * 1.8) * 0.06;
      coreRef.current.scale.setScalar(pulse);
    }

    // gentle mouse-reactive parallax
    const targetX = (state.pointer.x * Math.PI) / 24;
    const targetY = (state.pointer.y * Math.PI) / 24;
    if (groupRef.current) {
      groupRef.current.rotation.y +=
        (targetX - groupRef.current.rotation.y * 0.05) * 0.004;
      groupRef.current.rotation.x +=
        (-targetY - groupRef.current.rotation.x * 0.05) * 0.004;
    }
  });

  return (
    <group ref={groupRef}>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={particleCount}
            array={positions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={particleCount}
            array={colors}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.045}
          vertexColors
          transparent
          opacity={1}
          sizeAttenuation
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* glowing core */}
      <mesh ref={coreRef}>
        <icosahedronGeometry args={[0.6, 2]} />
        <meshBasicMaterial
          color="#a855f7"
          wireframe
          transparent
          opacity={0.8}
        />
      </mesh>

      {/* orbit rings */}
      <mesh rotation={[Math.PI / 2.4, 0, 0]}>
        <torusGeometry args={[3.1, 0.006, 8, 120]} />
        <meshBasicMaterial color="#00f0ff" transparent opacity={0.5} />
      </mesh>
      <mesh rotation={[Math.PI / 1.6, 0.4, 0]}>
        <torusGeometry args={[3.4, 0.005, 8, 120]} />
        <meshBasicMaterial color="#a855f7" transparent opacity={0.35} />
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
      <ParticleSphere />
      <AmbientDrift />
    </Canvas>
  );
}
