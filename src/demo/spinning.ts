export type ReelSpinnerTarget = { scroll : number, update : () => any }

export class ReelSpinningService {
  public enabled = true;
  public readonly speeds: number[];
  public readonly reels: ReelSpinnerTarget[];

  constructor( reels: ReelSpinnerTarget[] = [] ) {
    this.speeds = reels.map( () => 0 );
    this.reels = reels;

    requestAnimationFrame( () => this.animate() );
  }

  public setTargetReels( reels:ReelSpinnerTarget[] ) {
    this.reels.length = 0;
    this.reels.push( ...reels );
    this.speeds.length = reels.length;
  }

  public animate() {
    if ( this.enabled ) {
      this.reels.forEach( (reel,i) => {
        if ( this.speeds[i] ) {
          reel.scroll += this.speeds[i] || 0;
          reel.update();
        }
      } );
    }
    requestAnimationFrame( () => this.animate() );
  }
}

const defaultConfiguration = {};

export type ReelSpinnerConfiguration = typeof defaultConfiguration;