import * as PIXI from 'pixi.js';
import gsap from 'gsap';

import { Machine } from "../machine/machine";
import { ReelSpinningService } from './spinning';

export class ReelDraggingService {
  public readonly configuration: ReelDraggingServiceConfiguration;
  public enableDragging = true;
  
  private readonly currentDrag = {
    column : undefined as number,
    prevY : undefined as number,
    prevDeltaY : undefined as number,
    pointerLocation : new PIXI.Point(),
  }

  constructor(
    machine: Machine,
    spinner: ReelSpinningService,
    options: Partial<ReelDraggingServiceConfiguration> = {}
  ) {
    //// Merge the default configuration and options parameter,
    //// replacing default values with any from 'options' that exist.
    this.configuration = { ...defaultConfiguration, ...options };

    const setSpeed = ( reelIndex:number, value:number ) => {
      gsap.to( spinner.speeds, {
        [ reelIndex ] : value,
        duration: .100,
        ease: 'power.out'
      } )
    }
    
    machine.symbolContainer.interactive = true;
    machine.symbolContainer.buttonMode = true;
    machine.symbolContainer.addListener("pointerdown", e => {
      const drag = this.currentDrag;
      const loc = e.data.getLocalPosition(machine.symbolContainer, drag.pointerLocation)
      for ( const [reelIndex] of machine.reels.entries() ) {
        if ( machine.getReelBounds(reelIndex).contains( loc.x, loc.y ) ) {
          setSpeed( reelIndex, 0 );
          drag.column = reelIndex;
        }
      }
      drag.prevY = loc.y;
      drag.prevDeltaY = 0.0;
    })
    machine.symbolContainer.addListener("pointermove", e => {
      const drag = this.currentDrag;
      if ( drag.column != undefined ) {
        e.data.getLocalPosition(machine.symbolContainer,drag.pointerLocation);
      }
    })
    machine.symbolContainer.addListener("pointerup", e => {    
      const drag = this.currentDrag;
      if ( drag.column != undefined ) {
        if ( Math.abs( drag.prevDeltaY ) > .0045 ) {
          setSpeed( drag.column, 
          -6.0 * drag.prevDeltaY || 0 );
        } else {
          setSpeed( drag.column, 0 );
        }
        delete drag.column;
      }
    })

    const animate = () => {
      const drag = this.currentDrag;
      const loc = drag.pointerLocation;
      const deltaY = loc.y - ( drag.prevY || 0 )
      const reel = machine.reels[ drag.column ];
      if ( reel ) {
        const stepLength = deltaY / machine.config.symbolTargetHeight;
        reel.scroll -= stepLength;
        reel.update();
      }
      drag.prevY = loc.y;
      drag.prevDeltaY = deltaY / machine.config.symbolTargetHeight;
      requestAnimationFrame(animate)
    }
    animate();
  }
}

const defaultConfiguration = {
};

export type ReelDraggingServiceConfiguration = typeof defaultConfiguration;