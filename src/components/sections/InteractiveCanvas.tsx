"use client";

import { useRef, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { MeshDistortMaterial, Sphere, Environment } from "@react-three/drei";
import * as THREE from "three";

function AnimatedSphere() {
    const meshRef = useRef<THREE.Mesh>(null!);
    const mouseRef = useRef({ x: 0, y: 0 });

    useEffect(() => {
        const handleMouseMove = (event: MouseEvent) => {
            // Normalize mouse position (-1 to 1)
            mouseRef.current.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouseRef.current.y = -(event.clientY / window.innerHeight) * 2 + 1;
        };

        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, []);

    useFrame((state) => {
        const t = state.clock.getElapsedTime();

        // Constant gentle rotation
        meshRef.current.rotation.x = t * 0.2;
        meshRef.current.rotation.y = t * 0.3;

        // Smoothly interpolate towards mouse position
        // This works globally regardless of what UI element is on top
        meshRef.current.position.x = THREE.MathUtils.lerp(meshRef.current.position.x, mouseRef.current.x * 2, 0.1);
        meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, mouseRef.current.y * 2, 0.1);
    });

    return (
        <Sphere ref={meshRef} visible args={[1, 100, 200]} scale={2.5}>
            <MeshDistortMaterial
                color="#B08463"
                attach="material"
                distort={0.6}
                speed={2}
                roughness={0.2}
                metalness={0.4}
            />
        </Sphere>
    );
}

export function InteractiveCanvas() {
    return (
        <div className="absolute inset-0 -z-10 opacity-70 pointer-events-none">
            <Canvas>
                <ambientLight intensity={1.5} />
                <directionalLight position={[10, 10, 5]} intensity={2} />
                <AnimatedSphere />
                <Environment preset="city" />
            </Canvas>
        </div>
    );
}
