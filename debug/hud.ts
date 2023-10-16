import * as PIXI from "pixi.js";

import { Machine } from "../machine/machine";
import { Reel } from "../machine/reel";

import { configuration } from "../machine/configuration";

export const debuggingHudOptions = {
  showReelStats: false,
}

const makeReelText = (reel:Reel) => (`
scroll: ${ reel.scroll.toFixed(1) }

map-size: ${ reel.symbols.length }
pool: ${ reel['pool'].length }

data-size: ${ reel.fullData.length }
`)

export const addDebuggingHud = ( machine:Machine, container:PIXI.Container ) => 
{
  const labels = machine.reels.map( (reel,i) => {
    return container.addChild( new PIXI.Text( '-/-', {
      fill: 'white',
      width: configuration.symbolTargetWidth,
      textAlign: 'center',
    } ) )
  } )

  const animate = () => {
    for ( const [i,label] of labels.entries() ) {
      const reel = machine.reels[i];
      label.x = i * configuration.symbolTargetWidth;
      label.y = reel.length * configuration.symbolTargetHeight;
      label.text = makeReelText( reel );
      label.scale.set( .5 )

      label.visible = debuggingHudOptions.showReelStats;
    }

    requestAnimationFrame( () => animate() );
  }

  animate();
}