/// <reference path="../../typings/pixi.js.d.ts" />
/// <reference path="../views/SimpleButton.ts" />

namespace views {

    import SimpleButton = views.SimpleButton;

    export class UIView extends PIXI.Container {

        private static readonly Buttons_Width = 115;
        private static readonly Buttons_Alpha = 0.8;

        private static readonly New_Game_Button_X = 20;
        private static readonly New_Game_Button_Y = 630;
        
        private static readonly Undo_Button_X = 20;
        private static readonly Undo_Button_Y = 550;

        textureUp: PIXI.Texture;
        textureDown: PIXI.Texture;
        
        newGameButton: SimpleButton;
        undoButton: SimpleButton;

        constructor() {

            super();
            
            this.textureUp = PIXI.Texture.fromImage("buttonUp.png");
            this.textureDown = PIXI.Texture.fromImage("buttonDown.png");

            this.createNewGameButton();
            this.createUndoButton();

            this.addChild(this.newGameButton);
            this.addChild(this.undoButton);
        }

        createNewGameButton(): void {
            this.newGameButton = new SimpleButton("New Game", this.textureUp, this.textureDown);

            this.newGameButton.alpha = UIView.Buttons_Alpha
            this.newGameButton.x = UIView.New_Game_Button_X;
            this.newGameButton.y = UIView.New_Game_Button_Y;
            this.newGameButton.width = UIView.Buttons_Width;
        }

        createUndoButton(): void {
            this.undoButton = new SimpleButton("Undo (ctrl+z)", this.textureUp, this.textureDown);

            this.undoButton.alpha = UIView.Buttons_Alpha;
            this.undoButton.x = UIView.Undo_Button_X;
            this.undoButton.y = UIView.Undo_Button_Y;
            this.undoButton.width = UIView.Buttons_Width;
        }
    }
}