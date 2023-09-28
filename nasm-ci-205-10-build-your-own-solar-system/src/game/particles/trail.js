export const emitTrailParticles = (scene, planet) => {
  const emmiterManager = scene.add.particles('particle');
  const emitter = emmiterManager.createEmitter({
    speed: 0,
    scale: {
      start: 0.125,
      // start: 0.1,
      end: 0,
    },
    alpha: {
      start: 0.5,
      end: 0,
    },
    frequency: 100,
    lifespan: 25000,
  });
  emitter.startFollow(planet);
  // scene.emitterGroup.add(emmiterManager)
  return emmiterManager;
};
