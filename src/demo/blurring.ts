import * as PIXI from "pixi.js";

import { Machine } from "../machine/machine";

export class ReelBlurringService {
  public enableBlurring = true;
  public readonly configuration: ReelBlurringServiceConfiguration;
  private readonly prevScrollValues: number[];
  private readonly blurs: number[];

  constructor(
    private readonly machine: Machine,
    options: Partial<ReelBlurringServiceConfiguration> = {}
  ) {
    //// Merge the default configuration and options parameter,
    //// replacing default values with any from 'options' that exist.
    this.configuration = { ...defaultConfiguration, ...options };
    this.prevScrollValues = this.machine.reels.map(reel => reel.scroll);
    this.blurs = this.machine.reels.map(() => NaN);

    requestAnimationFrame( () => this.animate() );
  }

  public animate() {
    for (const [reelIndex, reel] of this.machine.reels.entries()) {
      const scrollDelta = reel.scroll - this.prevScrollValues[reelIndex];
      const blurAmount = !this.enableBlurring ? 0 : this.configuration.ease(scrollDelta)
      this.updateBlur( reelIndex, blurAmount );
      this.prevScrollValues[reelIndex] = reel.scroll;
    }
    requestAnimationFrame( () => this.animate() );
  }

  public updateBlur(reelIndex: number, stepLength: number) {

    if (!this.machine.reels[reelIndex]) {
      console.warn(`there is no reel with index [${reelIndex}]`);
      return;
    }
    const blurAmount = Math.min(
      Math.abs(stepLength) * 500,
      this.configuration.blurAmountMax
    );

    if (this.blurs[reelIndex] !== blurAmount) {
      if (blurAmount > this.configuration.blurAmountMin) {
        const filter = new PIXI.filters.BlurFilter();
        filter.resolution = this.configuration.resolution;
        filter.quality = this.configuration.quality;
        filter.blurX = 0;
        filter.blurY = blurAmount;
        for (const symba of this.machine.reels[reelIndex].symbols) {
          symba.filters = [filter];
        }
      }
    }

    this.blurs[reelIndex] = blurAmount;

    if (!blurAmount) {
      for (const symba of this.machine.reels[reelIndex].symbols) {
        symba.filters = null;
      }
    }
  }
}

const defaultConfiguration = {
  /** Blur filter quality (higher values reduce performance) */
  quality: 24,
  /** Blurring below this value results in no blur */
  blurAmountMin: 1,
  /** Blurring is capped to this value */
  blurAmountMax: 200,
  /** Reducing blur resolution yields higher performance and ugly results  */
  resolution: 1,
  /** Blur amount easing function */
  ease: (value: number) => Math.abs(value) ** 1.7 * 5
};

export type ReelBlurringServiceConfiguration = typeof defaultConfiguration;
