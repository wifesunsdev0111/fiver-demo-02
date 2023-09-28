import Matter from 'matter-js';
import config from '../../config/config';

export function gravitationalForceSun(bodyA, bodyB, baseGravityOverride) {
  return gravitationalForce(bodyA, bodyB);
}

export function gravitationalForcePlanet(bodyA, bodyB) {
  return gravitationalForce(bodyA, bodyB);
}

function gravitationalForce(bodyA, bodyB) {
  const { baseGravity } = config.gravity;
  let bToA = Matter.Vector.sub(bodyB.position, bodyA.position);
  let distanceExponential = Math.pow(Matter.Vector.magnitude(bToA), 2);
  let normal = Matter.Vector.normalise(bToA);
  let magnitude =
    baseGravity * ((bodyA.mass * bodyB.mass) / distanceExponential);
  let force = Matter.Vector.mult(normal, magnitude);

  return force;
}
