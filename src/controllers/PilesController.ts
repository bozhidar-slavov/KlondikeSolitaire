/// <reference path="../models/Deck.ts"/>
/// <reference path="../models/Notifications.ts"/>
/// <reference path="../gameObjects/Pile.ts" />
/// <reference path="../gameObjects/Card.ts" />
/// <reference path="../enums/PileType.ts" />
/// <reference path="../enums/CardType.ts" />
/// <reference path="../enums/CardSuit.ts" />
/// <reference path="../models/Deck.ts" />
/// <reference path="../models/Operation.ts" />
/// <reference path="../models/PilesModel.ts" />

namespace controllers {

    import ViewController = Pluck.ViewController;
    import Notifications = models.Notifications;
    import MainModel = models.MainModel;
    import Deck = models.Deck;
    import Pile = gameObjects.Pile;
    import Card = gameObjects.Card;
    import PileType = enums.PileType;
    import CardType = enums.CardType;
    import CardSuit = enums.CardSuit;
    import Operation = models.Operation;
    import PilesModel = models.PilesModel;

    export class PilesController extends ViewController {
        // Stock Pile
        private static readonly Stock_Pile_X = 20;
        private static readonly Stock_Pile_Y = 20;
т
        // Waste Pile
        private static readonly Waste_Pile_X = 150;
        private static readonly Waste_Pile_Y = 20;

        // Foundation Pile
        private static readonly Foundation_Piles_Count = 4;
        private static readonly Foundation_Pile_Start_X = 585;
        private static readonly Foundation_Pile_Start_Y = 20;

        // Tableau Pile
        private static readonly Tableau_Piles_Count = 7;
        private static readonly Tableau_Pile_Start_X = 150;
        private static readonly Tableau_Pile_Start_Y = 200;

        // For calculating distance between piles
        private static readonly Distance_Between_Piles = 20;
        private static readonly Line_Width = 4;

        // Pile types
        private _stockPile: Pile;
        private _wastePile: Pile;
        private _foundationPiles: Pile[];
        private _tableauPiles: Pile[];
        private _stockCard: Card;

        // Drag and drop
        private _targetCard: Card;
        private _targetPile: Pile;
        private _tempPile: Pile;
        private _dragDifference: PIXI.Point;
        private _isDragging: boolean;

        // Undo
        private _currentOperation: Operation;
        private _pilesModel: PilesModel;

        constructor() {
            super(new PIXI.Container());

            this._pilesModel = new PilesModel();
            this._stockCard = new Card();

            this.createStockPile();
            this.createWastePile();
            this.createFoundationPiles();
            this.createTableauPiles();

            this.addCardsInTableauPile();
            this.addCardsInStockPile();

            this.setupEventListeners(true)
            this.setupKeyboardEvents();
        }

        getInterests(): string[] {
            return [
                Notifications.New_Game,
                Notifications.Undo
            ];
        }

        handleNotification(notification?: Pluck.Notification) {
            switch (notification.name) {
                case Notifications.Undo:
                    this.executeUndo();
                    break;
                case Notifications.New_Game:
                    this.createNewGame();
                    break;
            }
        }

        createStockPile(): void {
            this._stockPile = new Pile(PileType.Stock);
            this._stockPile.x = PilesController.Stock_Pile_X;
            this._stockPile.y = PilesController.Stock_Pile_Y;
            this.view.addChild(this._stockPile);

            this._stockPile.buttonMode = true;
            this._stockPile.interactive = true;
        }

        createWastePile(): void {
            this._wastePile = new Pile(PileType.Waste);
            this._wastePile.x = PilesController.Waste_Pile_X;
            this._wastePile.y = PilesController.Waste_Pile_Y;
            this.view.addChild(this._wastePile);
        }

        createFoundationPiles(): void {
            this._foundationPiles = [];
            let startX = PilesController.Foundation_Pile_Start_X;
            for (let i = 0; i < PilesController.Foundation_Piles_Count; i++) {
                let foundationPile = new Pile(PileType.Foundation);
                foundationPile.x = startX;
                foundationPile.y = PilesController.Foundation_Pile_Start_Y;

                this._foundationPiles.push(foundationPile);

                this.view.addChild(foundationPile);
                startX += this._stockCard.width + (PilesController.Line_Width * 2) + PilesController.Distance_Between_Piles + 5;
            }
        }

        createTableauPiles(): void {
            this._tableauPiles = [];
            let startX = PilesController.Tableau_Pile_Start_X;
            for (let i = 0; i < PilesController.Tableau_Piles_Count; i++) {
                let tableauPile = new Pile(PileType.Tableau, true);

                tableauPile.x = startX;
                tableauPile.y = PilesController.Tableau_Pile_Start_Y;

                this._tableauPiles.push(tableauPile);

                this.view.addChild(tableauPile);
                startX += this._stockCard.width + (PilesController.Line_Width * 2) + PilesController.Distance_Between_Piles;
            }
        }

        addCardsInTableauPile(): void {
            for (let i = 0; i < PilesController.Tableau_Piles_Count; i++) {
                for (let j = 0; j <= i; j++) {
                    const card = this.mainModel.drawCardFromDeck();
                    this.attachDragAndDrop(card);
                    this._tableauPiles[i].addCard([card]);
                }
            }
        }

        addCardsInStockPile(): void {
            while (this.mainModel.deck.cards.length !== 0) {
                const card = this.mainModel.drawCardFromDeck();
                card.addChild(card.cardBackImage);
                this._stockPile.addCard([card]);
            }
        }

        createNewGame(): void {
            // clear piles
            this._tableauPiles.forEach(pile => pile.removeAllCards());
            this._foundationPiles.forEach(pile => pile.removeAllCards());
            this._wastePile.removeAllCards();
            this._stockPile.removeAllCards();

            // reset undo operations
            this._pilesModel.operations = [];

            // create new deck
            this.mainModel.deck = new Deck();

            // add cards
            this.addCardsInTableauPile();
            this.addCardsInStockPile();
        }

        executeUndo(): void {
            if (this._pilesModel.operations.length === 0) {
                return;
            }

            let droppedPile = this._pilesModel.operations[this._pilesModel.operations.length - 1].droppedPile;
            let draggedPile = this._pilesModel.operations[this._pilesModel.operations.length - 1].draggedPile;
            let cards = this._pilesModel.operations[this._pilesModel.operations.length - 1].cards;

            for (let i = 0; i < cards.length; i++) {
                droppedPile.removeCard(cards[i]);
            }

            if (draggedPile.getPileType === PileType.Stock && droppedPile.getPileType === PileType.Waste) {
                this.removeDragAndDrop(cards[0]);

                // return card back image on card clean
                cards[0].addChild(cards[0].cardBackImage);
            }

            draggedPile.addCard(cards);

            this._pilesModel.operations.pop();
        }

        onStockPileClick() {
            if (this._stockPile.cards.length === 0) {
                // reverse cards in pile to move them back in the same order
                this._wastePile.cards.reverse();
                
                // clear unnecessary undo operations between stock and waste piles
                let counter = 0;
                let operationsLength = this._pilesModel.operations.length;
                while (this._pilesModel.operations.length > 0) {
                    let operation = this._pilesModel.operations[counter];

                    if (operation.draggedPile.getPileType === PileType.Stock && operation.droppedPile.getPileType === PileType.Waste) {
                        let operationToRemove = this._pilesModel.operations.indexOf(operation);
                        this._pilesModel.operations.splice(operationToRemove, 1);
                        operationsLength--;
                    } else {
                        counter++;
                    }

                    if (operationsLength === counter) {
                        break;
                    }
                }
                
                for (let i = 0; i < this._wastePile.cards.length; i++) {
                    let currentCard = this._wastePile.cards[i];
                    
                    // remove drag and drop listeners to avoid conflict with click event.
                    this.removeDragAndDrop(currentCard);

                    this._stockPile.addCard([currentCard]);

                    // add card back red to clean card
                    currentCard.addChild(currentCard.cardBackImage);
                }

                this._wastePile.removeAllCards();
            } else {
                // for undo operation
                let currentCard = this._stockPile.cards[this._stockPile.cards.length - 1];
                this._currentOperation = new Operation([currentCard], this._stockPile);
                this._currentOperation.droppedPile = this._wastePile;
                this._pilesModel.operations.push(this._currentOperation);
                
                this._wastePile.addCard([currentCard]);

                // remove card back image
                currentCard.removeChild(currentCard.cardBackImage);

                this.attachDragAndDrop(currentCard);
                this._stockPile.removeCard(currentCard);
            }
        }

        setupKeyboardEvents() {
            document.onkeydown = (e: KeyboardEvent) => {
                if (e.keyCode === 90 && e.ctrlKey) {
                    this.executeUndo();
                } else if(e.keyCode === 32) {
                    this.onStockPileClick();
                }
            }
        }

        setupEventListeners(attach: boolean): void {
            if (attach) {
                // add event
                this._stockPile.on("click", this.onStockPileClick.bind(this));
            } else {
                // remove event
                this._stockPile.off("click", this.onStockPileClick.bind(this));
            }
        }

        attachDragAndDrop(target: Card) {
            target.on('mousedown', this.onMouseDown.bind(this));
            target.on('mouseup', this.onMouseUp.bind(this));
            target.on('mouseupoutside', this.onMouseUp.bind(this));
            target.on('mousemove', this.onMouseMove.bind(this));

            target.buttonMode = true;
        }

        removeDragAndDrop(target: Card) {
            target.off("mousedown");
            target.off("mouseup");
            target.off("mouseupoutside");
            target.off("mousemove");
        }

        onMouseDown(e: PIXI.interaction.InteractionEvent) {
            this._targetCard = e.target as Card;
            (this._targetCard as any).data = e.data;

            const cardPile: Pile = (this._targetCard.parent as Pile);
            this._targetPile = cardPile;

            let canDrag = this.canDragCards();
            if (canDrag) {
                const targetCardIndex = this._targetPile.cards.indexOf(this._targetCard);
                this._tempPile = new Pile(PileType.Temp, true);

                let targetPileLength = this._targetPile.cards.length

                for (let i = targetCardIndex; i < targetPileLength; i++) {
                    let currentCard: Card = this._targetPile.removeCard(this._targetPile.cards[targetCardIndex]);
                    this._tempPile.addCard([currentCard]);
                }

                this._currentOperation = new Operation(this._tempPile.cards, this._targetPile);
                this.view.addChild(this._tempPile);

                this._dragDifference = e.data.getLocalPosition(this._targetCard);
                this._tempPile.position.set(e.data.global.x - this._dragDifference.x, e.data.global.y - this._dragDifference.y);

                this._isDragging = true;

            } else {
                this._targetCard = null;
                this._targetPile = null;
                this._tempPile = null;
                return;
            }
        }

        onMouseMove(e: PIXI.interaction.InteractionEvent) {
            if (this._isDragging) {
                this._tempPile.position.set(
                    e.data.global.x - this._dragDifference.x,
                    e.data.global.y - this._dragDifference.y
                )
            }
        }

        onMouseUp() {
            if (!this._targetCard) {
                return;
            }

            this._isDragging = false;
            let foundationPileIndex: number = this.checkPilesForCollision(this._foundationPiles);
            let tableauPileIndex: number = this.checkPilesForCollision(this._tableauPiles);

            // if card/cards should be placed somewhere
            if (foundationPileIndex !== undefined && this.canAddCardToFoundationPile(this._tempPile.cards[0], this._foundationPiles[foundationPileIndex])) {
                this._foundationPiles[foundationPileIndex].addCard(this._tempPile.cards);
                this._currentOperation.droppedPile = this._foundationPiles[foundationPileIndex]
            } else if (tableauPileIndex !== undefined && this.canAddCardToTableauPile(this._tempPile.cards[0], this._tableauPiles[tableauPileIndex])) {
                this._tableauPiles[tableauPileIndex].addCard(this._tempPile.cards);
                this._currentOperation.droppedPile = this._tableauPiles[tableauPileIndex]
            } else { // return card/cards to pile
                this._targetPile.addCard(this._tempPile.cards);
                this._currentOperation = undefined;
            }

            // add operation in array for Undo
            if (this._currentOperation !== undefined) {
                this._pilesModel.operations.push(this._currentOperation);
            }

            this._targetPile = null;
            this._targetCard = null;
            this._tempPile = null;
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
                return canAdd = false;
            }

            if (pile.cards.length === 0 && card.type === CardType.King) {
                return canAdd = true;
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

        canDragCards(): boolean {
            const targetPileIndex = this.checkPilesForCollision(this._tableauPiles);
            const targetCardIndex = this._targetPile.cards.indexOf(this._targetCard);

            let canDrag: boolean = false;

            if (this._targetPile.getPileType === PileType.Waste || this._targetPile.getPileType === PileType.Foundation) {
                return true;
            }

            if (this._targetPile.getPileType === PileType.Tableau && (this._targetPile.cards.length - 1 === targetCardIndex)) {
                return true;
            }

            let currentPile: Pile = this._tableauPiles[targetPileIndex];
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

        checkPilesForCollision(targetPiles: Pile[]): number {
            let pileIndex: number;
            for (let i = 0; i < targetPiles.length; i++) {
                let currentPile = targetPiles[i];

                if (this.checkForCollision(this._targetCard, currentPile)) {
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

        protected get view(): PIXI.Container {
            return this._view;
        }

        protected get mainModel(): MainModel {
            return (ViewController.getRoot() as RootController).mainModel;
        }
    }
}