import Phaser from 'phaser';
import { TIME_SCALE } from '../../game/index';

import { COMET_SOUND } from '../../config/config';
import { loader } from '../../plugins/components/Preloader';

import { gravitationalForceSun } from '../../game/utils/gravity';

export const createComet = (scene, config) => {
  const { matter, sun } = scene;
  const { x, y, options, data, volume, group } = config;

  const dataWithPreloadedImages = {
    ...data,
    image: loader.get(data.image).src,
    thumb: loader.get(data.thumb).src,
  };

  let comet = matter.add.image(x, y, 'comet', null, {});
  comet.displayWidth = options.displayRadius * 2;
  comet.displayHeight = options.displayRadius * 2;

  comet.setCircle(options.radius, {
    ...options,
    label: 'comet',
    ignorePointer: true,
    friction: 0,
    frictionAir: 0.0,
    frictionStatic: 0,
  });

  comet.info = dataWithPreloadedImages;
  // comet.trailParticles = emitCometTrailParticles(scene, comet);
  setInitVelocity(comet, sun, scene.scale.width / 2);

  comet.sound = new Audio(loader.get(COMET_SOUND).src);
  comet.sound.volume = volume;
  comet.sound.play();

  group.add(comet);

  return comet;
};

function setInitVelocity(comet, sun, maxDistance) {
  const force = getGravitationalForceFromSun(comet, sun);
  const distance = Phaser.Math.Distance.Between(
    comet.body.position.x,
    comet.body.position.y,
    sun.body.position.x,
    sun.body.position.y
  );

  const velocity = Math.sqrt((force.magnitude * distance) / comet.body.mass);

  const positionX = comet.body.position.x;
  const positionY = comet.body.position.y;
  const angle = Phaser.Math.Angle.Between(
    sun.body.position.x,
    sun.body.position.y,
    positionX,
    positionY
  );

  const multiplier = 16.67 * TIME_SCALE; // 60 fps
  const normalizedDistance = distance / maxDistance;
  const angleAdjust = 2.85 - 0.8 * normalizedDistance;
  const velocityX = Math.sin(angle - angleAdjust) * velocity * multiplier;
  const velocityY = -Math.cos(angle - angleAdjust) * velocity * multiplier;

  comet.setVelocity(velocityX, velocityY);
}

function getGravitationalForceFromSun(comet, sun) {
  const force = gravitationalForceSun(comet.body, sun.body);
  const forceMagnitude = Math.sqrt(Math.pow(force.x, 2) + Math.pow(force.y, 2));

  return {
    x: force.x,
    y: force.y,
    magnitude: forceMagnitude,
  };
}
