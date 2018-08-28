/// <reference path="../gameObjects/Card.ts" />
/// <reference path="../gameObjects/Pile.ts" />

namespace models {

    import Card = gameObjects.Card;
    import Pile = gameObjects.Pile;

    export class Operation {

        cards: Card[];
        draggedPile: Pile;
        droppedPile: Pile;

        constructor(cards: Card[], draggedPile: Pile) {
            this.cards = cards;
            this.draggedPile = draggedPile;
        }
    }
}