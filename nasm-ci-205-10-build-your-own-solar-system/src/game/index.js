import Phaser from 'phaser';
import GameScene from '../game/scenes/GameScene';

export const EARTH_YEAR_IN_SECOND = 31536000;
export const TIME_SCALE = 1;

window.onload = function () {
  // console.log('on load!!!');
  // game configuration object
  let config = {
    fps: {
      target: 60,
      forceSetTimeOut: true,
    },
    type: Phaser.AUTO,
    // backgroundColor:0x87ceeb,
    scale: {
      mode: Phaser.Scale.RESIZE,
      autoCenter: Phaser.Scale.CENTER_BOTH,
      parent: 'thegame',
      width: window.innerWidth,
      height: window.innerHeight,
    },
    physics: {
      default: 'matter',
      matter: {
        gravity: {
          scale: 0,
        },
        plugins: {
          attractors: true,
        },
        timing: {
          timeScale: TIME_SCALE,
        },
      },
    },
    scene: GameScene,
    banner: false,
  };

  new Phaser.Game(config);
  window.focus();
};

// console.log(Phaser.Physics.Matter.Matter.Plugin.resolve('matter-attractors'));
