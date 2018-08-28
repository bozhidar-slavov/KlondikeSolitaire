/// <reference path="../../typings/pixi.js.d.ts" />
/// <reference path="../views/SimpleButton.ts" />

namespace views {

    import SimpleButton = views.SimpleButton;

    export class UIView extends PIXI.Container {

        newGameButton: SimpleButton;
        undoButton: SimpleButton;

        constructor() {

            super();
            
            const textureUp = PIXI.Texture.fromImage("buttonUp.png");
            const textureDown = PIXI.Texture.fromImage("buttonDown.png");

            // create new game button and add to stage
            this.newGameButton = new SimpleButton("New Game", textureUp, textureDown);
            this.addChild(this.newGameButton);
            
            // set position to new game button
            this.newGameButton.x = 20;
            this.newGameButton.y = 630;
            this.newGameButton.width = 115;

            // create undo button and add to stage
            this.undoButton = new SimpleButton("Undo (ctrl+z)", textureUp, textureDown);
            this.addChild(this.undoButton);

            // set position to undo button
            this.undoButton.x = 20;
            this.undoButton.y = 550;
            this.undoButton.width = 115;
        }
    }
}