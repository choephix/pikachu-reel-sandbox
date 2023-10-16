import * as PIXI from 'pixi.js';
import * as dat from 'dat.gui';
import gsap, { delayedCall } from 'gsap';

import { Machine } from "../machine/machine";

import { ReelBlurringService } from '../demo/blurring';
import { DemoGameplayService } from '../demo/game';
import { ReelSpinningService } from '../demo/spinning';
import { debuggingHudOptions } from './hud';

export const createDatGui = ( 
  machine:Machine, 
  spinner?:ReelSpinningService, 
  game?:DemoGameplayService, 
  blurrer?:ReelBlurringService ) => 
{
  const gui = new dat.GUI({
    name: "7Mojos - Spin The Reels Test",
    autoPlace: true,
    closed: false,
    hideable: true,
  });
  gui.domElement.style.userSelect = "none";

  const store:any = {}
  const o = {
    toggleMask : () => {
      ! store.mask && ( store.mask = machine.symbolContainer.mask )
      machine.symbolContainer.mask = machine.symbolContainer.mask ? null : store.mask
      store.mask.visible = store.mask.isMask
    },
    toggleSymbolPads : () => {
      const flag = ! machine.reels[0]?.symbols[0]?.pad?.visible
      machine.reels.forEach( reel => {
        reel.symbols.forEach( symba => symba.pad.visible = flag )
        reel['pool'].forEach( symba => symba.pad.visible = flag )
      } )
    },
  }
  
  Object.keys(o).forEach( key => gui.add( o, key ) );

  const gameKeys_1 = [ "spinStart", "spinStop", "reset" ]
  const gameKeys_2 = [ "spinStart_2", "spinStop_2", "spinStop_2_hard" ]

  const f1 = gui.addFolder("gameplay");
  gameKeys_1.forEach( key => f1.add( game, key ) )

  const f2 = gui.addFolder("gameplay (advanced)");
  for ( const [key,prop] of Object.entries( game ) ) {
    if ( typeof prop === "function" || typeof prop === "boolean" ) {
      if ( ! gameKeys_1.includes(key)) {
        f2.add( game, key );
      }
    }
  }

  if ( !! blurrer ) {
    gui.add( blurrer, 'enableBlurring' );
  }

  gui.add( debuggingHudOptions, 'showReelStats' )
}