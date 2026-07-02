"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

function lerp(a: number, b: number, t: number) { return a + (b - a) * t; }

// ── Arc Reactor Core ──────────────────────────────────────────────────────────
function ArcCore() {
  const ring1 = useRef<THREE.Mesh>(null);
  const ring2 = useRef<THREE.Mesh>(null);
  const ring3 = useRef<THREE.Mesh>(null);
  const coreGlow = useRef<THREE.Mesh>(null);
  const hexRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (ring1.current) ring1.current.rotation.z =  t * 1.2;
    if (ring2.current) ring2.current.rotation.z = -t * 0.8;
    if (ring3.current) ring3.current.rotation.z =  t * 0.5;
    if (hexRef.current) hexRef.current.rotation.z = t * 0.3;
    if (coreGlow.current) {
      const s = 1 + Math.sin(t * 2.5) * 0.12;
      coreGlow.current.scale.setScalar(s);
      (coreGlow.current.material as THREE.MeshBasicMaterial).opacity =
        0.6 + Math.sin(t * 2.5) * 0.25;
    }
  });

  return (
    <group>
      <mesh ref={ring3}>
        <ringGeometry args={[0.72, 0.78, 6]} />
        <meshBasicMaterial color="#00f0ff" transparent opacity={0.5}
          side={THREE.DoubleSide} blending={THREE.AdditiveBlending} />
      </mesh>
      <mesh ref={ring2}>
        <ringGeometry args={[0.52, 0.56, 24]} />
        <meshBasicMaterial color="#a855f7" transparent opacity={0.65}
          side={THREE.DoubleSide} blending={THREE.AdditiveBlending} />
      </mesh>
      <mesh ref={ring1}>
        <ringGeometry args={[0.34, 0.38, 6]} />
        <meshBasicMaterial color="#00f0ff" transparent opacity={0.8}
          side={THREE.DoubleSide} blending={THREE.AdditiveBlending} />
      </mesh>
      <mesh ref={hexRef}>
        <circleGeometry args={[0.28, 6]} />
        <meshBasicMaterial color="#7c3aed" transparent opacity={0.5}
          blending={THREE.AdditiveBlending} />
      </mesh>
      <mesh ref={coreGlow}>
        <circleGeometry args={[0.16, 32]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.7}
          blending={THREE.AdditiveBlending} />
      </mesh>
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position"
            count={1} array={new Float32Array([0,0,0.01])} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial size={0.18} color="#00f0ff" transparent opacity={1}
          sizeAttenuation depthWrite={false} blending={THREE.AdditiveBlending} />
      </points>
    </group>
  );
}

// ── Particle Shell ────────────────────────────────────────────────────────────
function ParticleShell({ radius, count, color1, color2, speed, size, opacity }:
  { radius:number; count:number; color1:string; color2:string; speed:number; size:number; opacity:number }) {
  const ref = useRef<THREE.Points>(null);
  const { positions, colors } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const c1 = new THREE.Color(color1);
    const c2 = new THREE.Color(color2);
    for (let i = 0; i < count; i++) {
      const phi   = Math.acos(1 - (2 * i) / count);
      const theta = Math.PI * (1 + Math.sqrt(5)) * i;
      const r = radius * (0.92 + Math.random() * 0.16);
      pos[i*3]   = r * Math.sin(phi) * Math.cos(theta);
      pos[i*3+1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i*3+2] = r * Math.cos(phi);
      const mix = c1.clone().lerp(c2, Math.random());
      col[i*3]=mix.r; col[i*3+1]=mix.g; col[i*3+2]=mix.b;
    }
    return { positions: pos, colors: col };
  }, [count, radius, color1, color2]);

  useFrame((state, delta) => {
    if (!ref.current) return;
    ref.current.rotation.y += delta * speed;
    ref.current.rotation.x += delta * speed * 0.37;
    (ref.current.material as THREE.PointsMaterial).size =
      size + Math.sin(state.clock.elapsedTime * 1.8) * size * 0.2;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
        <bufferAttribute attach="attributes-color"    count={count} array={colors}    itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={size} vertexColors transparent opacity={opacity}
        sizeAttenuation depthWrite={false} blending={THREE.AdditiveBlending} />
    </points>
  );
}

// ── Orbit Rings ───────────────────────────────────────────────────────────────
function OrbitRings() {
  const r1=useRef<THREE.Mesh>(null), r2=useRef<THREE.Mesh>(null), r3=useRef<THREE.Mesh>(null);
  useFrame((_,d) => {
    if(r1.current) r1.current.rotation.x += d*0.55;
    if(r2.current) r2.current.rotation.y += d*0.38;
    if(r3.current){ r3.current.rotation.x+=d*0.22; r3.current.rotation.z+=d*0.18; }
  });
  return (
    <group>
      <mesh ref={r1} rotation={[Math.PI/2,0,0]}>
        <torusGeometry args={[2.55,0.007,8,128]} />
        <meshBasicMaterial color="#00f0ff" transparent opacity={0.45} blending={THREE.AdditiveBlending} />
      </mesh>
      <mesh ref={r2} rotation={[0.5,0,0]}>
        <torusGeometry args={[2.78,0.005,8,128]} />
        <meshBasicMaterial color="#a855f7" transparent opacity={0.30} blending={THREE.AdditiveBlending} />
      </mesh>
      <mesh ref={r3} rotation={[1.1,0.4,0]}>
        <torusGeometry args={[2.40,0.004,8,128]} />
        <meshBasicMaterial color="#7c3aed" transparent opacity={0.25} blending={THREE.AdditiveBlending} />
      </mesh>
    </group>
  );
}

// ── Full AI Core ──────────────────────────────────────────────────────────────
function AICore() {
  const groupRef = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y = lerp(groupRef.current.rotation.y, state.pointer.x * 0.5,  0.055);
    groupRef.current.rotation.x = lerp(groupRef.current.rotation.x, -state.pointer.y * 0.3, 0.055);
  });
  return (
    <group ref={groupRef}>
      <ParticleShell radius={1.30} count={900}  color1="#a855f7" color2="#00f0ff" speed={0.18} size={0.032} opacity={0.90} />
      <ParticleShell radius={1.85} count={600}  color1="#00f0ff" color2="#7c3aed" speed={0.10} size={0.024} opacity={0.70} />
      <ParticleShell radius={2.40} count={380}  color1="#7c3aed" color2="#a855f7" speed={0.06} size={0.016} opacity={0.45} />
      <OrbitRings />
      <ArcCore />
    </group>
  );
}

// ── Ambient Dust ──────────────────────────────────────────────────────────────
function AmbientDust() {
  const ref = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const a = new Float32Array(220*3);
    for(let i=0;i<220;i++){
      a[i*3]=(Math.random()-.5)*18; a[i*3+1]=(Math.random()-.5)*18; a[i*3+2]=(Math.random()-.5)*18;
    }
    return a;
  }, []);
  useFrame((_,d) => { if(ref.current) ref.current.rotation.y+=d*0.008; });
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={220} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.009} color="#4a4a6a" transparent opacity={0.4} sizeAttenuation depthWrite={false} />
    </points>
  );
}

// ── Canvas ────────────────────────────────────────────────────────────────────
export function HeroScene() {
  return (
    <Canvas
      camera={{ position:[0,0,7.5], fov:42 }}
      dpr={[1,1.75]}
      gl={{ antialias:true, alpha:true, powerPreference:"high-performance" }}
      style={{ width:"100%", height:"100%", display:"block" }}
    >
      <ambientLight intensity={0.3} />
      <pointLight position={[4,4,6]}   intensity={0.8} color="#00f0ff" />
      <pointLight position={[-4,-3,4]} intensity={0.5} color="#7c3aed" />
      <AICore />
      <AmbientDust />
    </Canvas>
  );
}
