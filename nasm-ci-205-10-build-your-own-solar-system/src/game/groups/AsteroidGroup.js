import Phaser from 'phaser';
import { getDistance } from '../../game/utils/distance';

export default class AsteroidGroup extends Phaser.GameObjects.Group {
  constructor(scene, children, config) {
    super(scene, children, config);
    this.distance = config != null ? config.distance : undefined;
    this.totalCount = children.length;
    this.wasBroken = false;
  }

  //asteroid belt can broke ony once, when it's broken it stays that way
  checkIsBroken(sun) {
    if (this.wasBroken) return true;
    let stableAsteroidCount = 0;
    this.getChildren().forEach((child) => {
      if (child != null && child.body != null) {
        const distance = getDistance(sun, child);
        const distanceDifference = Math.abs(this.distance - distance);
        if (distanceDifference < 15) {
          stableAsteroidCount++;
        }
      }
    });
    const isBroken = this.totalCount * 0.5 > stableAsteroidCount;
    if (!this.wasBroken && isBroken) {
      this.wasBroken = true;
    }
    return this.totalCount * 0.5 > stableAsteroidCount;
  }

  //checks whether asteroid belt broke since last broken check
  checkJustBroke(sun) {
    return !this.wasBroken && this.checkIsBroken(sun);
  }
}
