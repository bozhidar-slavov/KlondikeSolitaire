/// <reference path="../gameObjects/Card.ts" />
/// <reference path="../enums/CardSuit.ts" />
/// <reference path="../enums/CardType.ts" />

namespace models {
    import Card = gameObjects.Card;
    import CardSuit = enums.CardSuit;
    import CardType = enums.CardType;

    export class Deck {
            private static readonly All_Card_Types = [
            CardType.Two,
            CardType.Three,
            CardType.Four,
            CardType.Five,
            CardType.Six,
            CardType.Seven,
            CardType.Eight,
            CardType.Nine,
            CardType.Ten,
            CardType.Jack,
            CardType.Queen,
            CardType.King,
            CardType.Ace
        ];

            private static readonly All_Card_Suits = [
            CardSuit.Club,
            CardSuit.Diamond,
            CardSuit.Heart,
            CardSuit.Spade
        ];

        private _deck: Card[];

        constructor() {
            this.initializeDeck();
            this.shuffleDeck();
        }

        drawCard() {
            return this._deck.pop();
        }

        insertCards(cards: Card[]) {
            this._deck.push(...cards);
        }

        get cards(): Card[] {
            return this._deck;
        }

        private initializeDeck() {
            this._deck = [];

            for (const cardSuit of Deck.All_Card_Suits) {
                for (const cardType of Deck.All_Card_Types) {
                    this._deck.push(new Card(cardType, cardSuit));
                }
            }
        }

        private shuffleDeck() {
            for (let i = this._deck.length - 1; i > 0; i--) {
                let n = Math.floor(Math.random() * (i + 1));
                let temp = this._deck[i];
                this._deck[i] = this._deck[n];
                this._deck[n] = temp;
            }
        }
    }
}
