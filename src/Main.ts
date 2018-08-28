///<reference path="../typings/pixi.js.d.ts" />
/// <reference path="../typings/greensock.d.ts" />

///<reference path="controllers/RootController.ts"/>

namespace solitaire {

    import RootController = controllers.RootController;
    

    export class Main extends PIXI.Container {
        constructor() {
            super();

            window.onload = this.startLoadingAssets.bind(this);
        }

        public start() {
            var rootController = new RootController(this);
        }

        private startLoadingAssets(): void {
            let loader = PIXI.loader;
            loader.add('gameSprite', "../assets/sprites.json");
            loader.on('complete', this.onAssetsLoaded.bind(this));
            loader.load();
        }

        private onAssetsLoaded(): void {
            this.createRenderer();
            this.animate()

            let rootController = new RootController(this);
        }

        private createRenderer(): void {
            PIXI.renderer = PIXI.autoDetectRenderer(1280, 720);

            document.body.appendChild(PIXI.renderer.view);

            this.interactive = true;
            this.animate();
        }

        private animate(): void {
            requestAnimationFrame(this.animate.bind(this));
            PIXI.renderer.render(this);
        }
    }
}