import * as PIXI from 'pixi.js';

export const spreadAllAssets = ( app:PIXI.Application ) => {
  let i = 0;
  for ( const resource of Object.values(PIXI.Loader.shared.resources) ) {
    const o = PIXI.Sprite.from( resource.texture );
    app.stage.addChild( o );
    o.y = i * 39;
    o.x = (i%4) * 150;
    o.scale.set(.5);

    const t = new PIXI.Text(resource.name, {
      fontSize: 16,
      fill: "white",
      strokeThickness: 2
    });
    app.stage.addChild( t )
    t.y = i * 39 + 120;
    t.x = (i%4) * 150;

    i++;
  }
}