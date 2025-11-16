// src/components/Dancer.tsx
import React, { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useGLTF } from "@react-three/drei";

type MoveName =
  | "kickstep"
  | "runningman"
  | "locking"
  | "wave"
  | "snake"
  | "step"
  | "samba1"
  | "samba2"
  | "samba3"
  | "samba4"
  | "idle"
  | string;

interface DancerProps {
  move: MoveName;
  danceStyle: "hiphop" | "samba";
  isPaused: boolean;   // ⭐ NEW
}

export default function Dancer({ move, danceStyle, isPaused }: DancerProps) {
  const root = useRef<THREE.Group | null>(null);

  // -----------------------------------------------------
  // USE SAME MODEL FOR BOTH HIPHOP & SAMBA

  const model = useGLTF("animations/character.glb") as any;

  // -----------------------------------------------------
  // LOAD ALL ANIMATION CLIPS
  // -----------------------------------------------------
  const clips = {
    kickstep: useGLTF("animations/kickstep.glb").animations?.[0] ?? null,
    runningman: useGLTF("animations/runningman.glb").animations?.[0] ?? null,
    locking: useGLTF("animations/locking.glb").animations?.[0] ?? null,
    wave: useGLTF("animations/wave.glb").animations?.[0] ?? null,
    snake: useGLTF("animations/snake.glb").animations?.[0] ?? null,
    step: useGLTF("animations/step.glb").animations?.[0] ?? null,

    samba1: useGLTF("animations/samba1.glb").animations?.[0] ?? null,
    samba2: useGLTF("animations/samba2.glb").animations?.[0] ?? null,
    samba3: useGLTF("animations/samba3.glb").animations?.[0] ?? null,
    samba4: useGLTF("animations/samba4.glb").animations?.[0] ?? null,
  };

  // -----------------------------------------------------
  // IDLE ANIMATION
  // -----------------------------------------------------
  const idleClip = clips.step || clips.kickstep || clips.samba1 || null;

  const animations = useMemo(
    () => ({
      ...clips,
      idle: idleClip,
    }),
    []
  );

  // -----------------------------------------------------
  // ANIMATION MIXER
  // -----------------------------------------------------
  const mixer = useMemo(() => new THREE.AnimationMixer(model.scene), [model.scene]);
  const currentAction = useRef<THREE.AnimationAction | null>(null);

  // -----------------------------------------------------
  // MATERIAL FIX
  // -----------------------------------------------------
  useEffect(() => {
    model.scene.traverse((obj: any) => {
      if (obj.isMesh) {
        obj.castShadow = true;
        obj.receiveShadow = true;
        if (obj.material) {
          obj.material.roughness = 0.45;
          obj.material.metalness = 0.1;
        }
      }
    });
  }, [model.scene]);

  // -----------------------------------------------------
  // PLAY / CROSSFADE ANIMATIONS
  // -----------------------------------------------------
  useEffect(() => {
    const clip = animations[move] || animations.idle;
    if (!clip) return;

    const action = mixer.clipAction(clip);
    action.reset().setLoop(THREE.LoopRepeat, Infinity).play();

    if (currentAction.current && currentAction.current !== action) {
      currentAction.current.crossFadeTo(action, 0.3, false);
    }

    currentAction.current = action;
  }, [move, animations, mixer]);

  // -----------------------------------------------------
  // ⭐ PAUSE / RESUME ANIMATION
  // -----------------------------------------------------
  useEffect(() => {
    if (!mixer) return;

    mixer.timeScale = isPaused ? 0 : 1;
  }, [isPaused, mixer]);

  // -----------------------------------------------------
  // ANIMATION LOOP
  // -----------------------------------------------------
  useEffect(() => {
    let last = performance.now();
    let raf: number;

    const loop = () => {
      const now = performance.now();
      const delta = (now - last) / 1000;

      mixer.update(delta);

      last = now;
      raf = requestAnimationFrame(loop);
    };

    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [mixer]);

  return (
    <primitive
      ref={root}
      object={model.scene}
      scale={1.8}
      position={[0, -1.2, 0]}
    />
  );
}
