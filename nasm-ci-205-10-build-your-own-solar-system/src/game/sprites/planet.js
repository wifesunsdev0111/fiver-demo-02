import Phaser from 'phaser';
import Matter from 'matter-js';
import { TIME_SCALE } from '../../game/index';

import { PLANET_1, PLANET_2, PLANET_3 } from '../../config/config';
import { loader } from '../../plugins/components/Preloader';

import { emitTrailParticles } from '../../game/particles/trail';
import {
  gravitationalForceSun,
  gravitationalForcePlanet,
} from '../../game/utils/gravity';

export const createPlanet = (scene, config) => {
  const { matter, sun } = scene;
  const { x, y, options, group, name, data } = config;

  const dataWithPreloadedImages = {
    ...data,
    image: loader.get(data.image).src,
    thumb: loader.get(data.thumb).src,
  };
  // console.log("data",data)

  let planet = matter.add.image(x, y, name, null, {});

  planet.displayWidth = options.displayRadius * 2;
  planet.displayHeight = options.displayRadius * 2;

  planet.setCircle(options.radius, {
    ...options,
    label: name,
    ignorePointer: true,
    friction: 0,
    frictionAir: 0.0,
    frictionStatic: 0,

    plugin: {
      attractors: [
        function (bodyA, bodyB) {
          const force = gravitationalForcePlanet(bodyA, bodyB);
          Matter.Body.applyForce(
            bodyA,
            bodyA.position,
            Matter.Vector.neg(force)
          );
          Matter.Body.applyForce(bodyB, bodyB.position, force);
        },
      ],
    },
  });

  planet.info = dataWithPreloadedImages;

  planet.trailParticles = emitTrailParticles(scene, planet);

  //PLANET ROTATION
  // planet.setAngularVelocity(0.1);
  setInitVelocity(planet, sun);

  planet.setDepth(100);

  planet.sound = createPlanetAudio(planet);

  //this is addition to planet so it's making sound
  planet.isEmmitingSound = false;
  planet.emitSound = (delay = 1300, volume = 1) => {
    planet.isEmmitingSound = true;
    planet.sound.volume = volume;
    planet.sound.play();
    const delayWithMin = delay > 1300 ? delay : 1300;
    setTimeout(() => {
      planet.isEmmitingSound = false;
    }, delayWithMin);
  };

  group.add(planet);

  return planet;
};

function setInitVelocity(planet, sun) {
  const force = getGravitationalForceOfSun(planet, sun);

  /**
   * Centripetal force
   * v = √(Fr/m)
   * F = Gravitational force of sun
   * r = distance from sun
   * m = mass of planet
   * v = velocity
   */

  const velocity = Math.sqrt(
    (force.magnitude *
      Phaser.Math.Distance.Between(
        planet.body.position.x,
        planet.body.position.y,
        sun.body.position.x,
        sun.body.position.y
      )) /
      planet.body.mass
  );

  const positionX = planet.body.position.x;
  const positionY = planet.body.position.y;
  const angle = Phaser.Math.Angle.Between(
    sun.body.position.x,
    sun.body.position.y,
    positionX,
    positionY
  );

  const multiplier = 16.67 * TIME_SCALE; // 60 fps
  const velocityX = Math.sin(angle) * velocity * multiplier;
  const velocityY = -Math.cos(angle) * velocity * multiplier;

  planet.setVelocity(velocityX, velocityY);
  // Matter.Body.applyForce(planet, planet.body.position, force);
}

// function getGravitationalForceOfSun(planet, sun) {
//   const bToA = Matter.Vector.sub(planet.body.position, sun.body.position);
//   const distanceSq = Matter.Vector.magnitudeSquared(bToA);
//   const normal = Matter.Vector.normalise(bToA);
//   const magnitude = -0.001 * ((planet.body.mass * sun.body.mass) / distanceSq);
//   const force = Matter.Vector.mult(normal, magnitude);

//   const forceMagnitude = Math.sqrt(Math.pow(force.x, 2) + Math.pow(force.y, 2));

//   return {
//     x: force.x,
//     y: force.y,
//     magnitude: forceMagnitude,
//   };
// }

function getGravitationalForceOfSun(planet, sun) {
  // const bToA = Matter.Vector.sub(planet.body.position, sun.body.position);
  // const distanceSq = Matter.Vector.magnitudeSquared(bToA);
  // const normal = Matter.Vector.normalise(bToA);
  // const magnitude = -0.001 * ((planet.body.mass * sun.body.mass) / distanceSq);
  // const force = Matter.Vector.mult(normal, magnitude);

  // const forceMagnitude = Math.sqrt(Math.pow(force.x, 2) + Math.pow(force.y, 2));

  const force = gravitationalForceSun(planet.body, sun.body);
  const forceMagnitude = Math.sqrt(Math.pow(force.x, 2) + Math.pow(force.y, 2));

  return {
    x: force.x,
    y: force.y,
    magnitude: forceMagnitude,
  };
}

function createPlanetAudio(planet) {
  const name = planet.body.label;
  switch (name) {
    case 'planet-small':
      return new Audio(loader.get(PLANET_1).src);
    case 'planet-medium':
      return new Audio(loader.get(PLANET_2).src);
    case 'planet-large':
      return new Audio(loader.get(PLANET_3).src);
    default:
      return new Audio(loader.get(PLANET_1).src);
  }
}
