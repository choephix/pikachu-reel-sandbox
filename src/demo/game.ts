import * as PIXI from 'pixi.js';
import gsap, { delayedCall } from 'gsap';

import { Machine } from "../machine/machine";

import { ReelSpinningService } from './spinning';
import { range } from '../util/range';
import { Reel } from '../machine/reel';
import { loop } from '../util/loop';

import data from "../data/data.json";

export class DemoGameplayService {
  public snapToSymbol = true;

  private store:any = {};

  constructor(
    private readonly machine: Machine,
    private readonly spinner: ReelSpinningService,
  ) {}

  public readonly spinStart = () => {
    for ( const [i] of this.spinner.speeds.entries() ) {
      gsap.to( this.spinner.speeds, {
        [i] : -.65,
        delay : i * .050,
        duration : .250,
        ease: 'back.in',
      } )
    }
  }

  public readonly spinStart_2 = () => {
    for ( const [i] of this.spinner.speeds.entries() ) {
      gsap.to( this.spinner.speeds, {
        [i] : .125 * ( Math.random() - .5 ),
        delay : i * .033,
        duration : .250,
        ease: 'power3.in',
      } )
    }
  }

  public readonly spinStop = async () => {
    if ( this.snapToSymbol ) {
      let j = 0;
      await Promise.all(
        this.machine.reels.map( async (reel,i) => {
          if ( this.spinner.speeds[i] == 0.0 ) 
            return undefined;

          await gsap.delayedCall( j++ * .150, console.log )
          gsap.killTweensOf( reel, 'scroll' )
          gsap.killTweensOf( this.spinner.speeds, ''+i )

          const reversed = this.spinner.speeds[i] > 0;
          const duration = .580 //Math.abs( reel.length / animator.speeds[i] ) * .017

          await gsap.to( reel, {
            scroll : Math.floor(reel.scroll + ( reversed ? 1.0 : -1.0 ) * reel.length),
            duration,
            onStart : () => this.spinner.speeds[i] = 0.0,
            onUpdate : () => reel.update(),
            ease: 'back(1.6).out',
          } )
        } )
      );
    } 
    else {
      let j = 0;
      await Promise.all(
        this.spinner.speeds.map( async (s,i) => (
          s == 0.0 
          ? undefined 
          : gsap.to( this.spinner.speeds, {
            [i] : 0,
            duration : .500,
            delay : j++ * .150,
            ease: 'back(1.1).out',
          })
        ))
      )
    }
  }

  public readonly spinStop_2 = async ( immediate = false ) => {
    if ( this.store.spin2_busy ) {
      console.error( 'alreadi going' )
      return
    }

    this.store.spin2_busy = true;

    const spinResult = {
      reels : [
        { index : 0, symbols : [ "TEST", "TEST", "TEST" ] }, // 10
        { index : 0, symbols : [ "TEST", "TEST", "TEST" ] }, // 25
        { index : 0, symbols : [ "TEST", "TEST", "TEST" ] }, // 50
        { index : 0, symbols : [ "TEST", "TEST", "TEST" ] }, // 60
        { index : 0, symbols : [ "TEST", "TEST", "TEST" ] }, // 70
      ]
    }

    console.log( spinResult.reels )
    
    let j = 0;
    await Promise.all(
      this.machine.reels.map( async (reel,i) => {
        if ( this.spinner.speeds[i] == 0.0 ) {
          await gsap.to( this.spinner.speeds, {
            [i] : -.65,
            duration : .250,
            ease: 'back.in',
            delay: i * .033,
          } )
          //this.spinner.speeds[i] = direction * .55;
        }

        //if ( this.spinner.speeds[i] == 0.0 ) return;

        //await gsap.delayedCall( j++ * .050, console.log )

        const spinResultData = spinResult.reels[ i ];
        const targetDataIndex = spinResultData.index;
        
        const fullDataLength = reel.fullData.length;

        const speedIsReversed = this.spinner.speeds[i] >= 0;
        const direction = this.spinner.speeds[i] >= 0 ? 1.0 : -1.0;

        const currentScroll = loop( reel.scroll, 0, fullDataLength );
        const currentDataIndex = Math.floor( currentScroll ) + ( speedIsReversed ? 1.0 : 0.0 );

        const targetScroll = ( direction > 0 === targetDataIndex >= currentDataIndex )
          ? targetDataIndex : ( targetDataIndex + direction * fullDataLength );
        
        reel.scroll = currentScroll;
        reel.update();

        const preTargetScroll = targetScroll - direction * reel.length
        
        try {
          await new Promise( async (resolve, reject) => {
            if ( direction > 0 === preTargetScroll <= reel.scroll ) {
              reject( "WTF! preTargetScroll already behind current scroll!" );
            }
            //this.spinner.speeds[i] *= 2.0;
            const onFrame = () => {
              if ( this.spinner.speeds[i] == 0.0 ) {
                reject( "Speed stopped for some reason. Cannot get to target index..." )
              }
              if ( direction > 0 === preTargetScroll <= reel.scroll ) {
                resolve();
              } else {
                requestAnimationFrame( () => onFrame() );
              }
            }
            onFrame();
          } )
        } catch ( e ) {
          console.warn( e );
        }

        gsap.killTweensOf( reel, 'scroll' )
        gsap.killTweensOf( this.spinner.speeds, ''+i )
        this.spinner.speeds[i] = 0.0;

        const duration = .680; //Math.abs( reel.length / animator.speeds[i] ) * .017;

        for ( const [i,symbolKey] of spinResultData.symbols.entries() ) {
          const index = targetScroll + i;
          reel.setSymbolData( index, symbolKey )
          reel.update();
        }

        //fakeTheData( reel );

        await gsap.to( reel, {
          scroll : targetScroll,
          duration,
          onUpdate : () => reel.update(),
          //ease: 'power4.out',
          ease: 'back(1.6).out',
        } )
      } )
    );
    
    this.store.spin2_busy = false;
  }

  public readonly spinStop_2_hard = async () => {
    const spinResult = {
      reels : [
        { scroll : ~~( Math.random() * 80 ), symbols : [ "TEST", "TEST", "TEST" ] },
        { scroll : ~~( Math.random() * 80 ), symbols : [ "TEST", "TEST", "TEST" ] },
        { scroll : ~~( Math.random() * 80 ), symbols : [ "TEST", "TEST", "TEST" ] },
        { scroll : ~~( Math.random() * 80 ), symbols : [ "TEST", "TEST", "TEST" ] },
        { scroll : ~~( Math.random() * 80 ), symbols : [ "TEST", "TEST", "TEST" ] },
      ]
    }

    console.log( spinResult )
    
    let j = 0;
    await Promise.all(
      this.machine.reels.map( async (reel,i) => {

        //await gsap.delayedCall( j++ * .150, console.log )
        gsap.killTweensOf( reel, 'scroll' )
        gsap.killTweensOf( this.spinner.speeds, ''+i )

        if ( this.spinner.speeds[i] == 0.0 ) return;

        console.log( this.spinner.speeds[i] )

        const duration = .580; //Math.abs( reel.length / animator.speeds[i] ) * .017;

        const speedIsReversed = this.spinner.speeds[i] > 0;
        const direction = this.spinner.speeds[i] > 0 ? 1.0 : -1.0;

        const fakeData = spinResult.reels[ i ];
        const currentScroll = Math.floor( reel.scroll ) + ( speedIsReversed ? 1.0 : 0.0 );
        const targetScroll = currentScroll + direction * fakeData.symbols.length;

        for ( const [i,symbolKey] of fakeData.symbols.entries() ) {
          reel.setSymbolData( targetScroll + i, symbolKey )
          reel.update();
        }

        //fakeTheData( reel );

        await gsap.to( reel, {
          scroll : targetScroll,
          duration,
          onStart : () => this.spinner.speeds[i] = 0.0,
          onUpdate : () => reel.update(),
          ease: 'back(1.6).out',
        } )
      } )
    );
  }

  public readonly jumble = async () => {
    await Promise.all(
      this.machine.reels.map( async (reel,i) => {
        gsap.killTweensOf( reel, 'scroll' )
        gsap.killTweensOf( this.spinner.speeds, ''+i )
        gsap.to( reel, {
          scroll : reel.scroll - 10 + Math.random() * 20,
          duration : .250,
          delay : i * .033,
          onStart : () => this.spinner.speeds[i] = 0.0,
          onUpdate : () => reel.update(),
        })
      })
    )
  }

  public readonly jumble2 = async () => {
    await Promise.all(
      this.machine.reels.map( async (reel,i) => {
        gsap.killTweensOf( reel, 'scroll' )
        gsap.killTweensOf( this.spinner.speeds, ''+i )
        gsap.to( reel, {
          scroll : reel.scroll - 100 + Math.random() * 200,
          duration : .250,
          delay : i * .033,
          onStart : () => this.spinner.speeds[i] = 0.0,
          onUpdate : () => reel.update(),
        })
      })
    )
  }

  public readonly snap = async () => {
    await Promise.all(
      this.machine.reels.map( async (reel,i) => {
        gsap.killTweensOf( reel, 'scroll' )
        gsap.killTweensOf( this.spinner.speeds, ''+i )
        gsap.to( reel, {
          scroll : Math.round( reel.scroll ),
          duration : .250,
          delay : i * .033,
          onStart : () => this.spinner.speeds[i] = 0.0,
          onUpdate : () => reel.update(),
        })
      })
    )
  }

  public readonly reset = async () => {
    const reelsData = data.data.cfg.props[0].value as string[][];
    await Promise.all(
      this.machine.reels.map( async (reel,i) => {
        gsap.killTweensOf( reel, 'scroll' )
        gsap.killTweensOf( this.spinner.speeds, ''+i )
        gsap.to( reel, {
          scroll : 0,
          duration : .250,
          delay : i * .033,
          onStart : () => {
            this.spinner.speeds[i] = 0.0
            const reelData = reelsData[i % reelsData.length];
            reel.setFullData(reelData);
          },
          onUpdate : () => reel.update(),
        })
      })
    )
  }
}