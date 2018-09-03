/// <reference path="../enums/CardSuit.ts" />
/// <reference path="../enums/CardType.ts" />

namespace gameObjects {
    import CardType = enums.CardType;
    import CardSuit = enums.CardSuit;

    export class Card extends PIXI.Container {

        private static readonly Font_Size = 26;
        private static readonly Font_Weight = "720";
        private static readonly Red_Color = 0xff1010;
        private static readonly Black_Color = 0x000000;

        private static readonly Card_Letters = {
            ace: "A",
            king: "K",
            queen: "Q",
            jack: "J",
            ten: "10",
            nine: "9",
            eight: "8",
            seven: "7",
            six: "6",
            five: "5",
            four: "4",
            three: "3",
            two: "2"
        };

        private _type: CardType;
        private _suit: CardSuit;

        cardClean: PIXI.Sprite;
        cardBackImage: PIXI.Sprite;

        constructor(type?: CardType, suit?: CardSuit) {
            super();
            this._type = type;
            this._suit = suit;

            this.cardBackImage = new PIXI.Sprite(PIXI.Texture.fromImage("cardBackRed.png"));

            const card = this.createCard(type, suit);
            this.addChild(card);
            this.interactive = true;
        }

        get type(): CardType {
            return this._type;
        }

        get suit(): CardSuit {
            return this._suit;
        }

        private createCard(type: CardType, suit: CardSuit): PIXI.Sprite {
            if(!type && !suit) {
                return new PIXI.Sprite(PIXI.Texture.fromImage("cardBackRed.png"));
            }

            this.cardClean = new PIXI.Sprite(PIXI.Texture.fromImage("cardClean.png"));
            let cardSuit: PIXI.Sprite;
            let cardText: PIXI.Text;
            let cardPicture: PIXI.Sprite;

            // adding card suit image to clean card
            switch (suit) {
                case CardSuit.Club:
                    cardSuit = new PIXI.Sprite(PIXI.Texture.fromImage("clubs.png"));
                    this._suit = 0;
                    break;
                case CardSuit.Diamond:
                    cardSuit = new PIXI.Sprite(PIXI.Texture.fromImage("diamonds.png"));
                    this._suit = 1;
                    break;
                case CardSuit.Heart:
                    cardSuit = new PIXI.Sprite(PIXI.Texture.fromImage("hearts.png"));
                    this._suit = 2;
                    break;
                case CardSuit.Spade:
                    cardSuit = new PIXI.Sprite(PIXI.Texture.fromImage("spades.png"));
                    this._suit = 3;
                    break;
            }

            // set suit position to clean card
            this.cardClean.addChild(cardSuit);
            cardSuit.width = 80;
            cardSuit.height = 80;
            cardSuit.position.x = 45;
            cardSuit.position.y = -10;

            //objects for text color
            let blackColorTextStyle = {
                fontSize: Card.Font_Size,
                fontWeight: Card.Font_Weight,
                fill: Card.Black_Color
            };

            let redColorTextStyle = {
                fontSize: Card.Font_Size,
                fontWeight: Card.Font_Weight,
                fill: Card.Red_Color
            };

            // adding card text and picture to clean card
            let isTextBlack: boolean;
            if (this._suit === CardSuit.Club || this._suit === CardSuit.Spade) {
                isTextBlack = true;
            }

            switch (type) {
                case CardType.Ace:
                    cardText = new PIXI.Text(Card.Card_Letters.ace, isTextBlack ? blackColorTextStyle : redColorTextStyle);
                    cardPicture = new PIXI.Sprite(PIXI.Texture.fromImage("aceImage.png"));
                    break;
                case CardType.King:
                    cardText = new PIXI.Text(Card.Card_Letters.king, isTextBlack ? blackColorTextStyle : redColorTextStyle);
                    cardPicture = new PIXI.Sprite(PIXI.Texture.fromImage("kingImage.png"));
                    break;
                case CardType.Queen:
                    cardText = new PIXI.Text(Card.Card_Letters.queen, isTextBlack ? blackColorTextStyle : redColorTextStyle);
                    cardPicture = new PIXI.Sprite(PIXI.Texture.fromImage("queenImage.png"));
                    break;
                case CardType.Jack:
                    cardText = new PIXI.Text(Card.Card_Letters.jack, isTextBlack ? blackColorTextStyle : redColorTextStyle);
                    cardPicture = new PIXI.Sprite(PIXI.Texture.fromImage("jackImage.png"));
                    break;
                case CardType.Ten:
                    cardText = new PIXI.Text(Card.Card_Letters.ten, isTextBlack ? blackColorTextStyle : redColorTextStyle);
                    cardPicture = new PIXI.Sprite();
                    break;
                case CardType.Nine:
                    cardText = new PIXI.Text(Card.Card_Letters.nine, isTextBlack ? blackColorTextStyle : redColorTextStyle);
                    cardPicture = new PIXI.Sprite();
                    break;
                case CardType.Eight:
                    cardText = new PIXI.Text(Card.Card_Letters.eight, isTextBlack ? blackColorTextStyle : redColorTextStyle);
                    cardPicture = new PIXI.Sprite();
                    break;
                case CardType.Seven:
                    cardText = new PIXI.Text(Card.Card_Letters.seven, isTextBlack ? blackColorTextStyle : redColorTextStyle);
                    cardPicture = new PIXI.Sprite();
                    break;
                case CardType.Six:
                    cardText = new PIXI.Text(Card.Card_Letters.six, isTextBlack ? blackColorTextStyle : redColorTextStyle);
                    cardPicture = new PIXI.Sprite();
                    break;
                case CardType.Five:
                    cardText = new PIXI.Text(Card.Card_Letters.five, isTextBlack ? blackColorTextStyle : redColorTextStyle);
                    cardPicture = new PIXI.Sprite();
                    break;
                case CardType.Four:
                    cardText = new PIXI.Text(Card.Card_Letters.four, isTextBlack ? blackColorTextStyle : redColorTextStyle);
                    cardPicture = new PIXI.Sprite();
                    break;
                case CardType.Three:
                    cardText = new PIXI.Text(Card.Card_Letters.three, isTextBlack ? blackColorTextStyle : redColorTextStyle);
                    cardPicture = new PIXI.Sprite();
                    break;
                case CardType.Two:
                    cardText = new PIXI.Text(Card.Card_Letters.two, isTextBlack ? blackColorTextStyle : redColorTextStyle);
                    cardPicture = new PIXI.Sprite();
                    break;
            }

            // add picture and text to clean card
            this.cardClean.addChild(cardPicture);
            this.cardClean.addChild(cardText);

            // set text and card picture positions
            cardPicture.x = 32;
            cardPicture.y = 80;
            cardText.x = 15;
            cardText.y = 5;

            return this.cardClean;
        }
    }
}