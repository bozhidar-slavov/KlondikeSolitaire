/// <reference path="../../core/Model.ts" />
/// <reference path="../models/Operation.ts" />
/// <reference path="../gameObjects/Pile.ts" />
/// <reference path="../gameObjects/Card.ts" />
/// <reference path="../enums/PileType.ts" />
/// <reference path="../enums/CardSuit.ts" />
/// <reference path="../enums/CardType.ts" />

namespace models {

    import Operation = models.Operation;
    import Card = gameObjects.Card;
    import Pile = gameObjects.Pile;
    import PileType = enums.PileType;
    import CardSuit = enums.CardSuit;
    import CardType = enums.CardType;

    export class PilesModel extends Pluck.Model  {

        operations: Operation[];

        constructor() {
            super();

            this.operations = [];
        }

        canDragCards(targetPile: Pile, targetCard: Card, piles: Pile[]): boolean {
            const targetPileIndex = this.checkPilesForCollision(piles, targetCard);
            const targetCardIndex = targetPile.cards.indexOf(targetCard);

            let canDrag: boolean = false;

            if (targetPile.getPileType === PileType.Waste || targetPile.getPileType === PileType.Foundation) {
                return true;
            }

            if (targetPile.getPileType === PileType.Tableau && (targetPile.cards.length - 1 === targetCardIndex)) {
                return true;
            }

            let currentPile: Pile = piles[targetPileIndex];
            let currentPileLength = currentPile.cards.length;

            for (let i = targetCardIndex; i < currentPileLength - 1; i++) {
                let currentCard = currentPile.cards[i];
                let nextCard = currentPile.cards[i + 1];

                if (currentCard.type - 1 === nextCard.type && this.checkIfCardSuitIsOpposite(currentCard.suit, nextCard)) {
                    canDrag = true;
                } else {
                    return false;
                }
            }

            return canDrag;
        }

        canAddCardToFoundationPile(card: Card, pile: Pile): boolean {
            let canAdd: boolean;
            let currentPileSuit: CardSuit;
            let bottomPileCard: Card;
            let getPileCardOnTop: number;
            let canAddNextCard: boolean;

            if (pile.cards.length === 0 && card.type === CardType.Ace) {
                canAdd = true;
            }

            if (pile.cards.length > 0) {
                bottomPileCard = pile.cards[0];
                currentPileSuit = bottomPileCard.suit;

                getPileCardOnTop = pile.cards[pile.cards.length - 1].type;
                canAddNextCard = card.type - 1 === getPileCardOnTop ? true : false;

                currentPileSuit === card.suit && canAddNextCard ? canAdd = true : canAdd = false;
            }

            return canAdd;
        }

        canAddCardToTableauPile(card: Card, pile: Pile): boolean {
            let canAdd: boolean;
            let lastCardOfPile: Card;
            let lastCardOfPileSuit: CardSuit;
            let lastCardOfPileType: CardType;

            if (pile.cards.length === 0 && card.type !== CardType.King) {
                return false;
            }

            if (pile.cards.length === 0 && card.type === CardType.King) {
                return true;
            }

            lastCardOfPile = pile.cards[pile.cards.length - 1];
            lastCardOfPileSuit = lastCardOfPile.suit;
            lastCardOfPileType = lastCardOfPile.type;

            if (lastCardOfPileType - 1 === card.type) {
                canAdd = true;
            } else {
                return canAdd;
            }

            canAdd = this.checkIfCardSuitIsOpposite(lastCardOfPileSuit, card);

            return canAdd;
        }

        checkIfCardSuitIsOpposite(suit: CardSuit, card: Card): boolean {
            let isOpposite: boolean = false;
            switch (suit) {
                case CardSuit.Club:
                    isOpposite = card.suit === CardSuit.Diamond || card.suit === CardSuit.Heart ? true : false;
                    break;
                case CardSuit.Diamond:
                    isOpposite = card.suit === CardSuit.Club || card.suit === CardSuit.Spade ? true : false;
                    break;
                case CardSuit.Heart:
                    isOpposite = card.suit === CardSuit.Club || card.suit === CardSuit.Spade ? true : false;
                    break;
                case CardSuit.Spade:
                    isOpposite = card.suit === CardSuit.Diamond || card.suit === CardSuit.Heart ? true : false;
            }

            return isOpposite;
        }

        checkPilesForCollision(targetPiles: Pile[], targetCard: Card): number {
            let pileIndex: number;
            for (let i = 0; i < targetPiles.length; i++) {
                let currentPile = targetPiles[i];

                if (this.checkForCollision(targetCard, currentPile)) {
                    pileIndex = i;
                    break;
                }
            }

            return pileIndex;
        }

        checkForCollision(card: Card, pile: Pile) {
            let cardBounds = card.getBounds();
            let pileBounds = pile.getBounds();
            return cardBounds.x + cardBounds.width > pileBounds.x &&
                cardBounds.x < pileBounds.x + pileBounds.width &&
                cardBounds.y + cardBounds.height > pileBounds.y &&
                cardBounds.y < pileBounds.y + pileBounds.height;
        }
    }
}