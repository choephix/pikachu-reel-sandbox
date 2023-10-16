import * as PIXI from "pixi.js";

import { range } from "../util/range";

import { SlotMachineConfiguration } from "./configuration";
import { Reel } from "./reel";

export class Machine {
  public readonly reels: Reel[] = [];

  constructor(
    public readonly symbolContainer: PIXI.Container,
    public readonly config: SlotMachineConfiguration
  ) {
    for (const i of range(config.countColumns)) {
      this.reels.push(new Reel(symbolContainer, config, i));
    }
  }

  public getMachineBounds() {
    return new PIXI.Rectangle(
      0,
      0,
      this.config.countColumns * this.config.symbolTargetWidth,
      this.config.countRows * this.config.symbolTargetHeight
    );
  }

  public getReelBounds(column: number) {
    const reel = this.reels[column];
    return new PIXI.Rectangle(
      reel.reelIndex * this.config.symbolTargetWidth,
      0,
      this.config.symbolTargetWidth,
      reel.length * this.config.symbolTargetHeight
    );
  }

  public getSymbolBounds(column: number, row: number) {
    return new PIXI.Rectangle(
      column * this.config.symbolTargetWidth,
      row * this.config.symbolTargetHeight,
      this.config.symbolTargetWidth,
      this.config.symbolTargetHeight
    );
  }
}
