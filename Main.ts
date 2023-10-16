import * as PIXI from "pixi.js";

import { handleKeyboardForDebugging } from "./debug/handleKeyboard";
import { spreadAllAssets } from "./debug/spreadAllAssets";

import data from "./data/data.json";
import { configuration } from "./machine/configuration";
import { Machine } from "./machine/machine";
import { ReelBlurringService } from "./demo/blurring";
import { createDatGui } from "./debug/gui";
import { ReelSpinningService } from "./demo/spinning";
import { ReelDraggingService } from "./demo/dragging";
import { DemoGameplayService } from "./demo/game";
import { addDebuggingHud } from "./debug/hud";

export class Main {
  private readonly machineContainer: PIXI.Container;
  private readonly focusContainer: PIXI.Container;
  private readonly machine: Machine;

  constructor(private readonly app: PIXI.Application) {
    const machineDimensions = {
      width: configuration.symbolTargetWidth * configuration.countColumns,
      height: configuration.symbolTargetHeight * configuration.countRows
    };

    this.machineContainer = new PIXI.Container();
    this.machineContainer.sortableChildren = true;
    this.machineContainer.pivot.set(
      0.5 * configuration.symbolTargetWidth * configuration.countColumns,
      0.5 * configuration.symbolTargetHeight * configuration.countRows
    );
    app.stage.addChild(this.machineContainer);

    this.focusContainer = new PIXI.Container();
    this.focusContainer.sortableChildren = true;
    this.focusContainer.pivot.set(
      0.5 * configuration.symbolTargetWidth * configuration.countColumns,
      0.5 * configuration.symbolTargetHeight * configuration.countRows
    );
    app.stage.addChild(this.focusContainer);

    const bg = new PIXI.Graphics();
    bg.zIndex = -9000;
    bg.lineStyle(6, 0x0, 0.25);
    bg.beginFill(0x444444, 0.25);
    bg.drawRect(0, 0, machineDimensions.width, machineDimensions.height);
    this.machineContainer.addChild(bg);

    const mask = new PIXI.Graphics();
    mask.beginFill(0xffffff);
    mask.drawRect(0, 0, machineDimensions.width, machineDimensions.height);
    mask.endFill();
    this.machineContainer.addChild(mask);
    this.machineContainer.mask = mask;

    const frame = new PIXI.Graphics();
    frame.zIndex = 9000;
    frame.lineStyle(2, 0x0);
    frame.drawRect(0, 0, machineDimensions.width, machineDimensions.height);
    this.machineContainer.addChild(frame);

    this.machine = new Machine(this.machineContainer, configuration);

    const reelsData = data.data.cfg.props[0].value as string[][];

    for (const [reelIndex, reel] of this.machine.reels.entries()) {
      const reelData = reelsData[reelIndex % reelsData.length];
      reel.setFullData(reelData);
      reel.update();
    }

    const animate = () => {
      const machineBounds = new PIXI.Rectangle(
        0, 0,
        40 + configuration.countColumns * configuration.symbolTargetWidth,
        40 + configuration.countRows * configuration.symbolTargetHeight,
      );
      const scale = Math.min( 
        app.view.clientWidth / machineBounds.width,
        app.view.clientHeight / machineBounds.height,
      );
      
      this.machineContainer.scale.set( scale );
      this.machineContainer.position.set(
        .5 * app.view.clientWidth,
        .5 * app.view.clientHeight 
      );

      this.focusContainer.scale.set( scale );
      this.focusContainer.position.set(
        .5 * app.view.clientWidth,
        .5 * app.view.clientHeight 
      );

      requestAnimationFrame( animate );
    }
    animate();

    window["main"] = this;

    const spinner = new ReelSpinningService( this.machine.reels );
    const blurrer = new ReelBlurringService( this.machine );
    const dragger = new ReelDraggingService( this.machine, spinner )
    const game = new DemoGameplayService( this.machine, spinner );

    createDatGui(this.machine, spinner, game, blurrer);
    addDebuggingHud( this.machine, this.focusContainer );

    handleKeyboardForDebugging(this.machine);

    //spreadAllAssets(app);
  }
}
