import Phaser from 'phaser';
import Matter from 'matter-js';
import AsteroidGroup from '../../game/groups/AsteroidGroup';
import { getDistanceFromObject } from '../../game/utils/distance';
import { TIME_SCALE } from '../../game/index';
import { loader } from '../../plugins/components/Preloader';

// import { emitTrailParticles } from '../game/particles/trail';
import {
  gravitationalForceSun,
  gravitationalForcePlanet,
} from '../../game/utils/gravity';

export const createAsteroid = (scene, config) => {
  const { matter, sun } = scene;
  const { x, y, options, group, name, data } = config;

  const dataWithPreloadedImages = {
    ...data,
    image: loader.get(data.image).src,
    thumb: loader.get(data.thumb).src,
  };
  let asteroid = matter.add.image(x, y, name, null, {});

  asteroid.displayWidth = options.displayRadius * 2;
  asteroid.displayHeight = options.displayRadius * 2;

  asteroid.setCircle(options.radius, {
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

  asteroid.info = dataWithPreloadedImages;

  //   asteroid.trailParticles = emitTrailParticles(scene, asteroid);
  asteroid.setAngularVelocity(0.1);
  setInitVelocity(asteroid, sun);

  asteroid.setDepth(100);

  group.add(asteroid);

  return asteroid;
};

function setInitVelocity(asteroid, sun) {
  const force = getGravitationalForceOfSun(asteroid, sun);

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
        asteroid.body.position.x,
        asteroid.body.position.y,
        sun.body.position.x,
        sun.body.position.y
      )) /
      asteroid.body.mass
  );

  const positionX = asteroid.body.position.x;
  const positionY = asteroid.body.position.y;
  const angle = Phaser.Math.Angle.Between(
    sun.body.position.x,
    sun.body.position.y,
    positionX,
    positionY
  );

  const multiplier = 16.67 * TIME_SCALE; // 60 fps
  const velocityX = Math.sin(angle) * velocity * multiplier;
  const velocityY = -Math.cos(angle) * velocity * multiplier;

  asteroid.setVelocity(velocityX, velocityY);
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

function getGravitationalForceOfSun(asteroid, sun) {
  // const bToA = Matter.Vector.sub(planet.body.position, sun.body.position);
  // const distanceSq = Matter.Vector.magnitudeSquared(bToA);
  // const normal = Matter.Vector.normalise(bToA);
  // const magnitude = -0.001 * ((planet.body.mass * sun.body.mass) / distanceSq);
  // const force = Matter.Vector.mult(normal, magnitude);

  // const forceMagnitude = Math.sqrt(Math.pow(force.x, 2) + Math.pow(force.y, 2));

  const force = gravitationalForceSun(asteroid.body, sun.body);
  const forceMagnitude = Math.sqrt(Math.pow(force.x, 2) + Math.pow(force.y, 2));

  return {
    x: force.x,
    y: force.y,
    magnitude: forceMagnitude,
  };
}

export const createAsteroidBelt = (scene, config) => {
  const { x, y } = config;
  const asteroids = [];
  const distance = getDistanceFromObject(scene.sun, x, y);
  const dotsPerCircle = Math.floor(distance / 11);
  const interval = (Math.PI * 2) / dotsPerCircle;

  const sunX = scene.sun.x;
  const sunY = scene.sun.y;
  scene.maxAsteroids = scene.maxAsteroids + dotsPerCircle;
  if (scene.asteroidBelts.length < 6) {
    for (var i = 0; i < dotsPerCircle; i++) {
      const distanceNoise = 100 * (0.2 * Math.random() - 0.1);
      const angleNoise = 1 + (0.2 * Math.random() - 0.1);
      var desiredRadianAngleOnCircle = interval * i;

      const asteroid = createAsteroid(scene, {
        ...config,
        x:
          sunX +
          (distance + distanceNoise) *
            Math.cos(desiredRadianAngleOnCircle * angleNoise),
        y:
          sunY +
          (distance + distanceNoise) *
            Math.sin(desiredRadianAngleOnCircle * angleNoise),
      });
      asteroids.push(asteroid);
    }
  }

  const asteroidBeltGroup = new AsteroidGroup(scene, asteroids, {
    distance: distance,
  });
  scene.asteroidBelts.push(asteroidBeltGroup);

  // console.log('total num of asteroids:', scene.maxAsteroids);
  // console.log('asteroid belt length is', asteroids.length);
  // console.log('asteroid belts num is', scene.asteroidBelts.length);
};
