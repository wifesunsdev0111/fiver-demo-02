import _ from 'lodash';
import store from '../../redux/store';
import {
  incrementPlanetToPlanetCollisionCount,
  incrementPlanetToSunCollisionCount,
  incrementAsteroidToPlanetCollisionCount,
  incrementCometToPlanetCollisionCount,
} from '../../redux/collision';
import { planet_decrement } from '../../redux/planetCount';
import { comet_decrement } from '../../redux/cometCount';
import {
  ASTEROIDS_COLLISION,
  ASTEROIDS_COLLISION_A,
  ASTEROIDS_COLLISION_B,
  ASTEROIDS_COLLISION_C,
  ASTEROIDS_COLLISION_D,
  ASTEROIDS_COLLISION_E,
  ASTEROIDS_COLLISION_F,
  ASTEROIDS_COLLISION_G,
  ASTEROIDS_COLLISION_H,
  ASTEROIDS_COLLISION_I,
  ASTEROIDS_COLLISION_J,
  ASTEROIDS_COLLISION_K,
  ASTEROIDS_COLLISION_L,
  PLANET_PLANET_COLLISION,
  STAR_PLANET_COLLISION,
  ASTEROID_STAR_COLLISION,
} from '../../config/config';
import { loader } from '../../plugins/components/Preloader';

const particlesBaseOptions = {
  alpha: {
    start: 1,
    end: 0,
  },
  lifespan: 1500,
};

function isPlanet(body) {
  return (
    body.label === 'planet-large' ||
    body.label === 'planet-medium' ||
    body.label === 'planet-small'
  );
}

function playCollisionSound(scene, src) {
  // console.log('volume ', scene.volume);
  const player = new Audio(src);
  player.volume = scene.volume;
  player.play();
}

function playAsteroidCollisionSound(scene, src) {
  let player = null;
  const audioNumber = _.random(0, 11, 0);
  switch (audioNumber) {
    case 0:
      player = new Audio(loader.get(ASTEROIDS_COLLISION_A).src);
      break;
    case 1:
      player = new Audio(loader.get(ASTEROIDS_COLLISION_B).src);
      break;
    case 2:
      player = new Audio(loader.get(ASTEROIDS_COLLISION_C).src);
      break;
    case 3:
      player = new Audio(loader.get(ASTEROIDS_COLLISION_D).src);
      break;
    case 4:
      player = new Audio(loader.get(ASTEROIDS_COLLISION_E).src);
      break;
    case 5:
      player = new Audio(loader.get(ASTEROIDS_COLLISION_F).src);
      break;
    case 6:
      player = new Audio(loader.get(ASTEROIDS_COLLISION_G).src);
      break;
    case 7:
      player = new Audio(loader.get(ASTEROIDS_COLLISION_H).src);
      break;
    case 8:
      player = new Audio(loader.get(ASTEROIDS_COLLISION_I).src);
      break;
    case 9:
      player = new Audio(loader.get(ASTEROIDS_COLLISION_J).src);
      break;
    case 10:
      player = new Audio(loader.get(ASTEROIDS_COLLISION_K).src);
      break;
    case 11:
      player = new Audio(loader.get(ASTEROIDS_COLLISION_L).src);
      break;
    default:
      player = new Audio(loader.get(ASTEROIDS_COLLISION).src);
      break;
  }
  player.volume = scene.volume;
  player.play();
}

function planetToPlanetColision(scene, bodyA, bodyB) {
  store.dispatch(incrementPlanetToPlanetCollisionCount());
  // console.log("from collision");
  try {
    emitParticlesAndDestroy(scene, bodyA);
    emitParticlesAndDestroy(scene, bodyB);
    playCollisionSound(scene, loader.get(PLANET_PLANET_COLLISION).src);
  } catch (error) {
    console.log(error);
  }
}

function planetToSunColision(scene, body) {
  store.dispatch(incrementPlanetToSunCollisionCount());
  emitParticlesAndDestroy(scene, body);
  playCollisionSound(scene, loader.get(STAR_PLANET_COLLISION).src);
}

function astroidToPlanet(scene, body) {
  store.dispatch(incrementAsteroidToPlanetCollisionCount());
  emitParticlesAndDestroy(scene, body);
  playAsteroidCollisionSound(scene, loader.get(ASTEROIDS_COLLISION).src);
}

function astroidToSun(scene, body) {
  emitParticlesAndDestroy(scene, body);
  playCollisionSound(scene, loader.get(ASTEROID_STAR_COLLISION).src);
}

function cometToPlanet(scene, body) {
  store.dispatch(incrementCometToPlanetCollisionCount());
  emitParticlesAndDestroy(scene, body);
  playAsteroidCollisionSound(scene, loader.get(ASTEROIDS_COLLISION).src);
}

function cometToSun(scene, body) {
  emitParticlesAndDestroy(scene, body);
  playCollisionSound(scene, loader.get(ASTEROID_STAR_COLLISION).src);
}

function cometToCometColision(scene, bodyA, bodyB) {
  try {
    emitParticlesAndDestroy(scene, bodyA);
    emitParticlesAndDestroy(scene, bodyB);
    playAsteroidCollisionSound(scene, loader.get(ASTEROIDS_COLLISION).src);
  } catch (error) {
    console.log(error);
  }
}

function cometToAsteroidColision(scene, bodyA, bodyB) {
  try {
    emitParticlesAndDestroy(scene, bodyB);
    emitParticlesAndDestroy(scene, bodyA);
    playAsteroidCollisionSound(scene, loader.get(ASTEROIDS_COLLISION).src);
  } catch (error) {
    console.log(error);
  }
}

function asteroidToAsteroidColision(scene, bodyA, bodyB) {
  // do nothing
}

export function handleObjectsCollision(scene, bodyA, bodyB) {
  if (bodyA.label === 'sun') {
    if (isPlanet(bodyB)) {
      planetToSunColision(scene, bodyB);
    } else if (bodyB.label === 'asteroid') {
      astroidToSun(scene, bodyB);
    } else if (bodyB.label === 'comet') {
      cometToSun(scene, bodyB);
    }
  } else if (isPlanet(bodyA)) {
    if (isPlanet(bodyB)) {
      planetToPlanetColision(scene, bodyA, bodyB);
    } else if (bodyB.label === 'sun') {
      planetToSunColision(scene, bodyA);
    } else if (bodyB.label === 'asteroid') {
      astroidToPlanet(scene, bodyB);
    } else if (bodyB.label === 'comet') {
      cometToPlanet(scene, bodyB);
    }
  } else if (bodyA.label === 'asteroid') {
    if (bodyB.label === 'asteroid') {
      asteroidToAsteroidColision(scene, bodyA, bodyB);
    } else if (bodyB.label === 'comet') {
      cometToAsteroidColision(scene, bodyA, bodyB);
    } else if (isPlanet(bodyB)) {
      astroidToPlanet(scene, bodyA);
    } else if (bodyB.label === 'sun') {
      astroidToSun(scene, bodyA);
    }
  } else if (bodyA.label === 'comet') {
    if (bodyB.label === 'asteroid') {
      cometToAsteroidColision(scene, bodyA, bodyB);
    } else if (bodyB.label === 'comet') {
      cometToCometColision(scene, bodyA, bodyB);
    } else if (isPlanet(bodyB)) {
      cometToPlanet(scene, bodyA);
    } else if (bodyB.label === 'sun') {
      cometToSun(scene, bodyA);
    }
  }
}

function emitParticlesAndDestroy(scene, body) {
  const particles = scene.add.particles('particle');
  const explosionParticles = {
    ...body.gameObject.info.explosionParticles,
    ...particlesBaseOptions,
  };
  const emitter = particles.createEmitter(explosionParticles);
  emitter.explode(explosionParticles.count, body.position.x, body.position.y);
  destroyObject(scene, body);
}

function destroyObject(scene, body) {
  if (body.gameObject.trailParticles) {
    body.gameObject.trailParticles.destroy();
  }
  const planetBodies = scene.planetGroup.children.entries.map((entry) => {
    return entry.body;
  });
  const asteroidBodies = scene.asteroidGroup.children.entries.map((entry) => {
    return entry.body;
  });
  const cometBodies = scene.cometGroup.children.entries.map((entry) => {
    return entry.body;
  });
  const planetGroupIndex = planetBodies.indexOf(body);
  const asteroidGroupIndex = asteroidBodies.indexOf(body);
  const cometGroupIndex = cometBodies.indexOf(body);
  if (planetGroupIndex > -1) {
    scene.planetGroup.children.entries[planetGroupIndex].destroy();
    store.dispatch(planet_decrement());
  } else if (asteroidGroupIndex > -1) {
    scene.asteroidGroup.children.entries[asteroidGroupIndex].destroy();
  } else if (cometGroupIndex > -1) {
    scene.cometGroup.children.entries[cometGroupIndex].destroy();
    store.dispatch(comet_decrement());
  } else {
    body.destroy();
  }
}
