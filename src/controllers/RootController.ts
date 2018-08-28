/// <reference path="../models/MainModel.ts"/>
/// <reference path="../controllers/PilesController.ts"/>
/// <reference path="../controllers/UIController.ts" />

namespace controllers {
    import ViewController = Pluck.ViewController;
    import MainModel = models.MainModel;

    export class RootController extends ViewController {
        constructor(rootView: PIXI.Container) {
            super(rootView, new MainModel());
            ViewController.setRoot(this);

            const background = new PIXI.Sprite(PIXI.Texture.fromImage("background.png"));
            this._view.addChild(background);

            const uiController = new UIController();
            this.addChildViewController(uiController);

            const pilesController = new PilesController();
            this.addChildViewController(pilesController);
        }

        get mainModel(): MainModel {
            return this._model;
        }
    }
}