import * as PIXI from 'pixi.js';
import { loop } from '../util/loop';

import { range, rangeFromTo } from '../util/range';
import { SlotMachineConfiguration } from './configuration';
import { Symbol } from './symbol';

type SymbolData = string

export class Reel {
  public readonly length:number = this.config.countRows;

  public scroll:number = 0;
  public fullData:SymbolData[] = [];

  private map:Record<number,Symbol> = {}
  private pool:Symbol[] = [];

  public get symbols():Symbol[] {
    return Object.values( this.map );
  }

  constructor ( 
    public readonly symbolContainer:PIXI.Container,
    public readonly config:SlotMachineConfiguration,
    public readonly reelIndex:number,
  ) {
    for ( const i in range( config.countRows + 1 ) ) {
      this.pool.push( new Symbol( config ) )
    }
  }

  public setFullData( data:SymbolData[] ) {
    this.fullData = [...data];
  }

  public setSymbolData( indexOnFull:number, data:SymbolData ) {
    const normalizeIndex = i => {
      while ( i >= this.fullData.length ) {
        i -= this.fullData.length;
      }
      while ( i < 0 ) {
        i += this.fullData.length;
      }
      return i;
    }
    indexOnFull = normalizeIndex( indexOnFull );

    this.fullData[indexOnFull] = data;
  }

  public borrowSymbol = () => this.pool.length ? this.pool.pop() : new Symbol( this.config );
  public returnSymbol = (symba:Symbol) => this.pool.push( symba );

  public update() {
    const normalizeIndex = i => {
      while ( i >= this.fullData.length ) {
        i -= this.fullData.length;
      }
      while ( i <= 0 ) {
        i += this.fullData.length;
      }
      return i;
    }
    //this.scroll = normalizeIndex( this.scroll );

    for ( const [indexOnFull,symba] of Object.entries( this.map ) ) {
      if ( ! this.shouldShowSymbol( +indexOnFull ) ) {
        this.symbolContainer.removeChild( symba );
        this.returnSymbol( symba );
        delete this.map[ indexOnFull ];
      }
    }

    const virtualRangeToCheck:[number,number] = [ this.scroll - 10, this.scroll + this.length + 2 ]

    for ( const virtualIndex of rangeFromTo( ...virtualRangeToCheck ) ) {
      //const mapKey = normalizeIndex( virtualIndex );
      const mapKey = virtualIndex;
      if ( this.map[ mapKey ] == undefined && this.shouldShowSymbol( virtualIndex ) ) {
        this.map[ mapKey ] = this.borrowSymbol()
      }
      if ( !! this.map[ mapKey ] ) {
        const symba:Symbol = this.map[ mapKey ];
        this.symbolContainer.addChild( symba );

        const indexOnFull = loop( virtualIndex, 0, this.fullData.length );
        symba.setSymbolKey( this.fullData[ indexOnFull ] );
        
        const viewIndex = virtualIndex - this.scroll;
        symba.x = this.reelIndex * this.config.symbolTargetWidth;
        symba.y = viewIndex * this.config.symbolTargetHeight; 
      }
    }
  }

  public shouldShowSymbol( indexOnFull:number, symbolData?:any ) {
    const symbolSizeY = symbolData?.sizeY || 1.0;
    return (
      indexOnFull > this.scroll - symbolSizeY &&
      indexOnFull < this.scroll + this.length
    );
  }
}