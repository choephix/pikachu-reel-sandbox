import './style.css';

import PIXI from './pixi';

import { Main } from './Main';

//import assets from './data/assets.1.json'
import assets from './data/assets.2.json';
import * as test from './_/singleton';
import Service from './service';

const app = new PIXI.Application({
  width: 800,
  height: 600,
  antialias: true,
  transparent: false,
  autoStart: true,
  resizeTo: document.body,
  backgroundColor: 0xb000b5,
  autoDensity: true,
  resolution: window.devicePixelRatio || 1,
});

document.body.innerHTML = '';
document.body.appendChild(app.view);
document.title = 'devicePixelRatio: ' + window.devicePixelRatio;

load();

function load() {
  const text = new PIXI.Text('Loading...', { color: 0xffffff });
  app.stage.addChild(text);

  const loader = PIXI.Loader.shared;
  Object.entries(assets).forEach(([name, path]) => loader.add(name, path));
  loader.load().onComplete.add(onAssetsLoaded);

  app.stage.removeChild(text);
}

function onAssetsLoaded() {
  const loader = PIXI.Loader.shared;
  console.log(loader.resources);
  new Main(app);
}
