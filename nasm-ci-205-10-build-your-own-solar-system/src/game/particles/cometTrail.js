export const emitCometTrailParticles = (scene, comet) => {
  const particles = scene.add.particles('particle');
  const emitter = particles.createEmitter({
    count: 50,
    speed: {
      min: -25,
      max: 25,
    },
    scale: {
      start: 0.35,
      end: 0,
    },
    alpha: {
      start: 1,
      end: 0,
    },
    frequency: 70,
    lifespan: 300,
    tint: [0x3a6d85, 0x357c93],
  });
  emitter.startFollow(comet);
  return particles;
};
