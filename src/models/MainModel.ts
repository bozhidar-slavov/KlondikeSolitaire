namespace models {
    
    import Card = gameObjects.Card;

    export class MainModel {
        
        private _deck: Deck; 

        constructor() {
            this._deck = new Deck();
        }

        drawCardFromDeck(): Card {
            return this._deck.drawCard();
        }

        insertCardsInDeck(cards: Card[]): void {
            this._deck.insertCards(cards);
        }

        get deck(): Deck {
            return this._deck;
        }

        set deck(deck: Deck) {
            this._deck = deck;
        }
    }
}