/// <reference path="../enums/PileType.ts" />
/// <reference path="../enums/CardSuit.ts" />
/// <reference path="../enums/CardType.ts" />

namespace gameObjects {
    import PileType = enums.PileType;

    export class Pile extends PIXI.Container {
        private static Pile_Width: number;
        private static Pile_Height: number;
        private static readonly Rectangle_Radius = 20;
        private static readonly Black_Color = 0x000000;
        private static readonly Line_Width = 4;
        private static readonly Distance_Between_Stacked_Cards = 30;

        cards: Card[];
        shouldStack: boolean;
        type: PileType;

        constructor(pileType: PileType, shouldStack = false) {
            super();
            this.type = pileType;
            this.shouldStack = shouldStack;

            let card = new Card();
            Pile.Pile_Width = card.width - 10;
            Pile.Pile_Height = card.height - 10;

            this.cards = [];

            let pile = this.createPile(pileType);
            pile.x += 6;
            pile.y += 2;
            this.addChild(pile);
        }

        get getPileType(): PileType {
            return this.type;
        }

        createPile(pileType: PileType): PIXI.Graphics {
            return {
                [PileType.Stock]: this.drawRefreshOnStockPile(),
                [PileType.Waste]: this.drawRoundedRectangle(),
                [PileType.Foundation]: this.drawSingleFoundationPile(),
                [PileType.Tableau]: this.drawRoundedRectangle(),
                [PileType.Temp]: this.initTempPile()
            }[pileType];
        }

        addCard(inputCards: Card[]): void {
            for (let i = 0; i < inputCards.length; i++) {
                this.cards.push(inputCards[i]);

                inputCards[i].x = inputCards[i].y = 0;
                if (this.shouldStack) {
                    inputCards[i].y = (this.cards.length - 1) * Pile.Distance_Between_Stacked_Cards;
                }

                this.addChild(inputCards[i]);
            }
        }

        removeCard(card: Card): Card {
            let cardIndex = this.cards.indexOf(card);
            this.cards.splice(cardIndex, 1);

            this.removeChild(card);

            return card;
        }

        removeAllCards(): void {
            while (this.cards.length > 0) {
                this.removeChild(this.cards.pop());
            }
        }

        initTempPile(): PIXI.Graphics {
            return new PIXI.Graphics();
        }
        
        drawSingleFoundationPile(): PIXI.Graphics {
            let rectangle = this.drawRoundedRectangle();

            // add suits transparent image to rectangle
            let suits = new PIXI.Sprite(PIXI.Texture.fromImage("suits.png"));
            this.setSpriteCenter(suits);
            rectangle.addChild(suits);
            return rectangle;
        }

        drawRefreshOnStockPile(): PIXI.Graphics {
            let rectangle = this.drawRoundedRectangle();

            // add refresh transparent image to rectangle
            let refresh = new PIXI.Sprite(PIXI.Texture.fromImage("refresh.png"));
            this.setSpriteCenter(refresh);
            rectangle.addChild(refresh);
            return rectangle;
        }

        private drawRoundedRectangle(): PIXI.Graphics {
            let graphics = new PIXI.Graphics();
            graphics.lineStyle(Pile.Line_Width, Pile.Black_Color);
            graphics.drawRoundedRect(0, 0, Pile.Pile_Width, Pile.Pile_Height, Pile.Rectangle_Radius);
            return graphics;
        }

        private setSpriteCenter(sprite: PIXI.Sprite) {
            const suitsImageTexture = PIXI.Texture.fromImage("suits.png");
            const suitsImageWidth = suitsImageTexture.width;
            const suitsImageHeigth = suitsImageTexture.height;

            let xPosition = ((Pile.Pile_Width - suitsImageWidth) / 2);
            let yPosition = ((Pile.Pile_Height - suitsImageHeigth) / 2);
            sprite.x = xPosition;
            sprite.y = yPosition;
        }
    }
}