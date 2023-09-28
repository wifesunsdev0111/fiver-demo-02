import Phaser from 'phaser';
import _ from 'lodash';
import { createSun } from '../../game/sprites/sun';
import { createPlanet } from '../../game/sprites/planet';
import { createComet } from '../../game/sprites/comet';
import { createAsteroidBelt } from '../../game/sprites/asteroid';
import { handleObjectsCollision } from '../../game/particles/collision';
import config from '../../config/config';
import emitter from '../../emitter';
import { planet_increment } from '../../redux/planetCount';
import { comet_increment } from '../../redux/cometCount';
import { loader } from '../../plugins/components/Preloader';

import {
  LOW_VOLUME,
  HIGH_VOLUME,
  setEndEventType,
  incrementBrokenAsteroidBeltCount,
  getGameVolume,
} from '../../redux/game';
import { wasKeypadUsed } from '../../redux/app';
import { isGameRunning } from '../../redux/game';
import store from '../../redux/store';
const { objects, sun, particle, background } = config;

const FIRST_ZERO_PLANET_TIMEOUT = 90000;
const FIRST_ARIO_ZERO_PLANET_TIMEOUT = 90000;
const FIRST_END_EVENT_TIMEOUT = 90000;
const FIRST_ARIA_END_EVENT_TIMEOUT = 180000;
const NEXT_END_EVENT_TIMEOUT = 90000;
const NEXT_ARIA_END_EVENT_TIMEOUT = 180000;

export default class GameScene extends Phaser.Scene {
  constructor(props) {
    super('GameScene');
    this.maxAsteroids = 0;
    this.volume = getGameVolume(store.getState()); // allowed valus are from 0 to 1
    this.accessibilityMode = wasKeypadUsed(store.getState());
    this.isGameRunning = isGameRunning(store.getState());
  }

  handleChangeComplete = (e) => {
    this.setState((prevState) => ({
      ...prevState,
      test: e.target.value,
    }));
  };

  preload() {
    this.load.image(sun.name, loader.get(sun.image).src);
    this.load.image(particle.name, 'particle.png');
    this.load.image(background.name, loader.get(background.image).src);
    objects.forEach((obj) => {
      this.load.image(obj.name, obj.image);
    });
  }

  create() {
    this.planetGroup = this.add.group();
    this.asteroidGroup = this.add.group();
    this.cometGroup = this.add.group();
    this.asteroidBelts = [];

    //background image settings
    let bg = this.add.image(0, 0, 'background');
    bg.displayHeight = 1920;
    bg.displayWidth = 1080;
    bg.scaleX = 1;
    bg.scaleY = 1;
    bg.x = 1040;
    bg.y = 540;

    this.sun = createSun(this);

    // this.gravityRingGraphics = this.add.graphics();
    // this.gravityRingGraphics.lineStyle(2, 0xffffff);
    // this.gravityRingGraphics.strokeCircle(
    //   window.innerWidth / 2,
    //   window.innerHeight / 2,
    //   300
    // );

    emitter.on('objectDragEnd', (payload) => {
      this.handleDragEnd(payload);
    });

    emitter.on('clearAllObjects', () => {
      this.clearAllGroups();
    });

    emitter.on('pauseGame', () => {
      this.pauseGame();
    });

    emitter.on('resumeGame', () => {
      this.resumeGame();
    });

    emitter.on('turnDownVolume', () => {
      this.volume = LOW_VOLUME;
    });

    emitter.on('turnUpVolume', () => {
      this.volume = HIGH_VOLUME;
    });

    emitter.on('setVolume', (payload) => {
      this.volume = payload.volume;
    });

    emitter.on('initEndEventTimeout', () => {
      if (!_.endsWith(window.location.pathname, 'main')) {
        this.scene.pause();
      } else {
        this.accessibilityMode
          ? this.startEndEventTimeout(NEXT_ARIA_END_EVENT_TIMEOUT)
          : this.startEndEventTimeout(NEXT_END_EVENT_TIMEOUT);
      }
    });

    emitter.on('initZeroPlanetEndEventTimeout', () => {
      if (!_.endsWith(window.location.pathname, 'main')) {
        this.scene.pause();
      } else {
        this.accessibilityMode
          ? this.startEndEventTimeout(FIRST_ARIO_ZERO_PLANET_TIMEOUT)
          : this.startEndEventTimeout(FIRST_ZERO_PLANET_TIMEOUT);
      }
      // console.log('no planet timer start');
    });

    emitter.on('accessibilityModeOn', () => {
      this.accessibilityMode = true;
      this.startEndEventTimeout(FIRST_ARIA_END_EVENT_TIMEOUT);
    });

    emitter.on('reset', () => {
      this.volume = getGameVolume(store.getState()); // allowed valus are from 0 to 1
      this.accessibilityMode = wasKeypadUsed(store.getState());
      this.clearAllGroups();
    });

    // detect collisions
    this.matter.world.on('collisionstart', this.handleCollision);
    // input for development
    // this.input.on('pointerdown', this.handleClick);
    //init timeout for end event
    this.startEndEventTimeout(
      this.accessibilityMode
        ? FIRST_ARIA_END_EVENT_TIMEOUT
        : FIRST_END_EVENT_TIMEOUT
    );
    //console.log("   this.accessibilityMode",this.accessibilityMode);
    // console.log('collision timer start');
    if (!_.endsWith(window.location.pathname, 'main')) {
      this.scene.pause();
    }
  }

  pauseGame() {
    this.scene.pause();
  }

  resumeGame() {
    this.scene.resume();
  }

  startEndEventTimeout(timeout) {
    //console.log('timer started with timeout', timeout);
    this.timer && this.timer.destroy();
    this.timer = this.time.addEvent({
      delay: timeout,
      callback: () => store.dispatch(setEndEventType()),
    });
  }

  clearAllGroups() {
    //used custom logic for clearing of groups,
    // because particle managers are not destroyed with their objects
    this.clearGroup(this.planetGroup);
    this.clearGroup(this.cometGroup);
    _.forEach(this.asteroidBelts, (asteroidBelt, index) => {
      asteroidBelt.destroy();
    });
    this.asteroidBelts = [];
    this.clearGroup(this.asteroidGroup);
    this.maxAsteroids = 0;
  }

  clearGroup(group) {
    const groupChildren = [...group.children.entries];
    _.forEach(groupChildren, (groupChild) => {
      groupChild.body.gameObject.trailParticles &&
        groupChild.body.gameObject.trailParticles.destroy();
      groupChild.destroy();
    });
  }

  update() {
    this.checkAsteroidBelts();
    this.updateOrbitSound();
    this.updateCometOrientation();
  }

  checkAsteroidBelts() {
    this.asteroidBelts.forEach((asteroidBelt, index) => {
      const justBroke = asteroidBelt && asteroidBelt.checkJustBroke(this.sun);
      if (justBroke) {
        store.dispatch(incrementBrokenAsteroidBeltCount());
      }
    });
  }

  updateOrbitSound() {
    if (this.planetGroup.getLength() > 0) {
      const entries = this.planetGroup.children.entries;
      entries.forEach((planet) => {
        let distance = Phaser.Math.Distance.Between(
          planet.body.position.x,
          planet.body.position.y,
          this.sun.body.position.x,
          this.sun.body.position.y
        );
        if (!planet.isEmmitingSound) {
          planet.emitSound(distance * 10, this.volume);
        }
      });
    }
  }

  updateCometOrientation() {
    if (this.cometGroup.getLength() > 0) {
      this.cometGroup.children.entries.forEach((comet) => {
        const angle = Phaser.Math.Angle.Between(
          this.sun.body.position.x,
          this.sun.body.position.y,
          comet.body.position.x,
          comet.body.position.y
        );
        const distance = Phaser.Math.Distance.Between(
          this.sun.body.position.x,
          this.sun.body.position.y,
          comet.body.position.x,
          comet.body.position.y
        );
        const maxDistance = this.scale.width / 2;
        comet.setRotation(angle + 0.8);
        comet.setScale(0.8 - distance / (maxDistance * 2));
      });
    }
  }

  addObject = (obj, x, y) => {
    if (!obj) return;
    switch (obj.type) {
      case 'planet': {
        createPlanet(this, {
          x,
          y,
          group: this.planetGroup,
          name: obj.name,
          options: obj.options,
          data: obj,
        });
        break;
      }
      case 'asteroid': {
        createAsteroidBelt(this, {
          x,
          y,
          group: this.asteroidGroup,
          name: obj.name,
          options: obj.options,
          data: obj,
        });
        break;
      }
      case 'comet': {
        createComet(this, {
          x,
          y,
          group: this.cometGroup,
          options: obj.options,
          data: obj,
          volume: this.volume,
        });
        break;
      }
      default: {
      }
    }
  };

  handleClick = (e) => {
    const obj = objects.find(
      (obj) => obj === window.__APP_DATA__.selectedObject
    );
    this.handleDragEnd({ obj, x: e.x, y: e.y });
    //remove this when adding by click will be same as adding by drag
    if (obj && obj.type === 'planet') {
      store.dispatch(planet_increment());
    }
    if (obj && obj.type === 'comet') {
      store.dispatch(comet_increment());
    }
    //remove this when adding by click will be same as adding by drag
  };

  handleDragEnd = (payload) => {
    const { obj, x, y } = payload;
    this.addObject(obj, x, y);
  };

  handleCollision = (e) => {
    _.forEach(e.pairs, (pair, index) => {
      handleObjectsCollision(this, pair.bodyA, pair.bodyB);
    });
  };
}
