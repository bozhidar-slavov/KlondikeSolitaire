namespace views {
    export class SimpleButton extends PIXI.Container {

        private _upState: PIXI.Sprite;
        private _downState: PIXI.Sprite;
        private _buttonText: PIXI.Text

        constructor(buttonText: string, upTexture: PIXI.Texture, downTexture: PIXI.Texture) {

            super();
            
            this._upState = new PIXI.Sprite();
            this._downState = new PIXI.Sprite();

            this._upState.texture = upTexture;
            this._downState.texture = downTexture;

            this._buttonText = new PIXI.Text(buttonText, { fontSize: 28, fontWeight: "1000", fill: 0x000000 });
            this.setTextAtButtonCenter(this._buttonText);
            
            // on click
            this.on("mousedown", () => {
                this.down();
            });

            this.on("mouseup", () => {
                this.up();
            });

            this.on("mouseout", () => {
                if (this._downState.visible && !this._upState.visible) {
                    this.up();
                }
            });

            // on hover
            this.on("mouseover", () => {
                this.alpha = 0.7;
            });

            this.on("mouseout", () => {
                this.alpha = 1;
            });

            this.interactive = true;
            this.buttonMode = true;
            this.compose();
            this.up();
        }

        up(): void {
            this._upState.visible = true;
            this._downState.visible = false;
        }

        down(): void {
            this._upState.visible = false;
            this._downState.visible = true;
        }

        private compose(): void {
            this.addChild(this._upState);
            this.addChild(this._downState);
            this.addChild(this._buttonText);
        }
        
        private setTextAtButtonCenter(text: PIXI.Text) {
            const buttonTexture = PIXI.Texture.fromImage("buttonUp.png");
            const buttonWidth = buttonTexture.width;
            const buttonHeight = buttonTexture.height;

            let xPosition = ((buttonWidth - this._buttonText.width) / 2);
            let yPosition = ((buttonHeight - this._buttonText.height) / 2);
            text.x = xPosition;
            text.y = yPosition;
        }
    }
}