// import Phaser from 'phaser';
import Matter from 'matter-js';
// import MatterAttractors from 'matter-attractors';

import config from '../../config/config';
import { gravitationalForceSun } from '../../game/utils/gravity';

const { displayRadius, radius, mass } = config.sun;

export const createSun = (scene) => {
  let { matter } = scene;
  let sun = matter.add.image(1920 / 2 + 164.5, 1080 / 2, 'sun', null, {
    label: 'sun',
    shape: {
      type: 'circle',
      radius,
    },
    mass,
    isStatic: true,
    plugin: {
      // attractors: [
      //   Phaser.Physics.Matter.Matter.Plugin.resolve('matter-attractors')
      //     .Attractors.gravity,
      // ],

      // attractors: [MatterAttractors.Attractors.gravity],

      attractors: [
        function (bodyA, bodyB) {
          // // use Newton's law of gravitation
          // var bToA = Matter.Vector.sub(bodyB.position, bodyA.position),
          //   distanceSq = Matter.Vector.magnitudeSquared(bToA) || 0.0001,
          //   normal = Matter.Vector.normalise(bToA),
          //   magnitude = -0.001 * ((bodyA.mass * bodyB.mass) / distanceSq),
          //   force = Matter.Vector.mult(normal, magnitude);

          // Matter.Body.applyForce(bodyB, bodyB.position, force);

          //let magnitude = Matter.Vector.magnitude(
          //Matter.Vector.sub(bodyB.position, bodyA.position)
          //);

          // planet is too close apply stronger gravitational pull
          // if (
          //   (bodyB.label.includes('asteroid') ||
          //     bodyB.label.includes('planet')) &&
          //   magnitude <= 60
          // ) {
          //   let force = gravitationalForceSun(bodyA, bodyB, -0.00075);
          //   Matter.Body.applyForce(bodyB, bodyB.position, force);
          //   return;
          // }

          let force = gravitationalForceSun(bodyA, bodyB);
          Matter.Body.applyForce(bodyB, bodyB.position, force);
        },
      ],
    },
  });

  sun.displayHeight = displayRadius * 2;
  sun.displayWidth = displayRadius * 2;

  return sun;
};

// function gravitationalForce(bodyA, bodyB) {
//   let bToA = Matter.Vector.sub(bodyB.position, bodyA.position);
//   let distanceSq = Matter.Vector.magnitudeSquared(bToA) || 0.0001;
//   let normal = Matter.Vector.normalise(bToA);
//   let magnitude = -0.001 * ((bodyA.mass * bodyB.mass) / distanceSq);
//   let force = Matter.Vector.mult(normal, magnitude);

//   return force;
// }

// function gravitationalForceNewton(bodyA, bodyB) {
//   let bToA = Matter.Vector.sub(bodyB.position, bodyA.position);
//   let distanceSq = Matter.Vector.magnitudeSquared(bToA) || 0.0001;
//   let normal = Matter.Vector.normalise(bToA);
//   let magnitude = -0.001 * ((bodyA.mass * bodyB.mass) / distanceSq);
//   let force = Matter.Vector.mult(normal, magnitude);
//   return force;
// }
