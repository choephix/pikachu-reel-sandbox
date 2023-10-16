import * as PIXI from 'pixi.js';

import { SlotMachineConfiguration } from './configuration';

const res = PIXI.Loader.shared.resources;

export interface SymbolData {
  key:string;
  sizeX:number;
  sizeY:number;
}

export class Symbol extends PIXI.Container {
  public symbolKey?:string;

  public pad?:PIXI.Graphics;
  public sprite?:PIXI.DisplayObject;

  constructor ( public readonly config:SlotMachineConfiguration ) { 
    super();

    const color = ~~(Math.random() * 0xFFFFFF);
    this.pad = new PIXI.Graphics();
    this.pad.zIndex = -1;
    this.pad.beginFill( color, .5 );
    this.pad.drawRect( 0, 0, config.symbolTargetWidth, config.symbolTargetHeight );
    this.addChild( this.pad );
  }

  setSymbolKey( key:string ) {
    if ( this.symbolKey !== key ) {
      this.symbolKey = keyToResourceName( key );
      this.removeChild(this.sprite);
      if ( res[ this.symbolKey ] ) {
        this.sprite = PIXI.Sprite.from( res[ this.symbolKey ].texture )
        this.addChild( this.sprite );
        this.sprite.scale.set(.25);
        //this.sprite.pivot.set(
        //  -.5 * this.sprite['width'],
        //  -.5 * this.sprite['height'],
        //);
        this.sprite['anchor'].set(.5);
        this.sprite.x = .5 * this.config.symbolTargetWidth;
        this.sprite.y = .5 * this.config.symbolTargetHeight;
      } else {
        console.error(`Texture not found: `, this.symbolKey, key )
      }
    }
  }
}

export function keyToResourceName( key:string ) {
  const BE_Keys = [
    "SCATTER",
    "WILD",
    "SUPER_HIGH",
    "HIGH1",
    "HIGH2",
    "HIGH3",
    "HIGH4",
    "LOW1",
    "LOW2",
    "LOW3",
    "LOW4",
    "TEST",
  ]

  const FE_Keys = [
    "bonus-2",
    "bonus-1",
    "bonus-4",
    "high-1",
    "high-2",
    "high-3",
    "high-4",
    "low-5",
    "low-6",
    "low-7",
    "low-8",
    "bonus-3",
  ]

  return FE_Keys[ BE_Keys.indexOf( key ) ];
}