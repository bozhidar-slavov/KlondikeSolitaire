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
/// <reference path="../views/PilesView.ts" />

namespace controllers {

    import ViewController = Pluck.ViewController;
    import Notifications = models.Notifications;
    import MainModel = models.MainModel;
    import Deck = models.Deck;
    import Pile = gameObjects.Pile;
    import Card = gameObjects.Card;
    import PileType = enums.PileType;
    import Operation = models.Operation;
    import PilesModel = models.PilesModel;
    import PilesView = views.PilesView;

    export class PilesController extends ViewController {

        // Drag and drop
        private _targetCard: Card;
        private _targetPile: Pile;
        private _tempPile: Pile;
        private _dragDifference: PIXI.Point;
        private _isDragging: boolean;

        // Undo
        private _currentOperation: Operation;

        private _pilesModel: PilesModel;
        private _viewCast: PilesView;

        constructor() {
            super(new PIXI.Container());

            this._pilesModel = new PilesModel();

            this._view = new PilesView();
            this._viewCast = this._view as PilesView;

            // deal cards
            this.addCardsInTableauPile();
            this.addCardsInStockPile();

            this.setupEventListeners(true);
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

        addCardsInTableauPile(): void {
            for (let i = 0; i < this._viewCast.tableauPiles.length; i++) {
                for (let j = 0; j <= i; j++) {
                    const card = this.mainModel.drawCardFromDeck();
                    this.attachDragAndDrop(card);
                    this._viewCast.tableauPiles[i].addCard([card]);
                }
            }
            
            this._viewCast.tableauPiles.forEach(pile => TweenMax.staggerFrom(pile.cards, 0.2, { x: -500, y: -500 }, 0.1));
        }

        addCardsInStockPile(): void {
            while (this.mainModel.deck.cards.length !== 0) {
                const card = this.mainModel.drawCardFromDeck();
                card.addChild(card.cardBackImage);
                this._viewCast.stockPile.addCard([card]);
            }

            TweenMax.staggerFrom(this._viewCast.stockPile.cards, 0.2, { x: -150, y: -150, rotation: 0.5}, 0.1);
        }

        createNewGame(): void {
            // clear piles
            this._viewCast.tableauPiles.forEach(pile => pile.removeAllCards());
            this._viewCast.foundationPiles.forEach(pile => pile.removeAllCards());
            this._viewCast.wastePile.removeAllCards();
            this._viewCast.stockPile.removeAllCards();

            // clear undo operations
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
            if (this._viewCast.stockPile.cards.length === 0) {
                // reverse cards in pile to move them back in the same order
                this._viewCast.wastePile.cards.reverse();

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

                for (let i = 0; i < this._viewCast.wastePile.cards.length; i++) {
                    let currentCard = this._viewCast.wastePile.cards[i];

                    // remove drag and drop listeners to avoid conflict with click event.
                    this.removeDragAndDrop(currentCard);

                    this._viewCast.stockPile.addCard([currentCard]);

                    // add card back red to clean card
                    currentCard.addChild(currentCard.cardBackImage);
                }

                this._viewCast.wastePile.removeAllCards();
            } else {
                // for undo operation
                let currentCard = this._viewCast.stockPile.cards[this._viewCast.stockPile.cards.length - 1];
                this._currentOperation = new Operation([currentCard], this._viewCast.stockPile);
                this._currentOperation.droppedPile = this._viewCast.wastePile;
                this._pilesModel.operations.push(this._currentOperation);

                this._viewCast.wastePile.addCard([currentCard]);

                // remove card back image
                currentCard.removeChild(currentCard.cardBackImage);

                this.attachDragAndDrop(currentCard);
                this._viewCast.stockPile.removeCard(currentCard);
                TweenMax.from(currentCard, 0.2, { x: -150 });
            }
        }

        setupKeyboardEvents() {
            document.onkeydown = (e: KeyboardEvent) => {
                if (e.keyCode === 90 && e.ctrlKey) {
                    this.executeUndo();
                } else if (e.keyCode === 32) {
                    this.onStockPileClick();
                }
            }
        }

        setupEventListeners(attach: boolean): void {
            if (attach) {
                this._viewCast.stockPile.on("click", this.onStockPileClick.bind(this));
            } else {
                this._viewCast.stockPile.off("click", this.onStockPileClick.bind(this));
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

            let canDrag = this._pilesModel.canDragCards(this._targetPile, this._targetCard, this._viewCast.tableauPiles);
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

                // when mousedown on card is fired to keep cursor position at the center
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
            let foundationPileIndex: number = this._pilesModel.checkPilesForCollision(this._viewCast.foundationPiles, this._targetCard);
            let tableauPileIndex: number = this._pilesModel.checkPilesForCollision(this._viewCast.tableauPiles, this._targetCard);

            // if card/cards should be placed somewhere
            if (foundationPileIndex !== undefined && this._pilesModel.canAddCardToFoundationPile(this._tempPile.cards[0], this._viewCast.foundationPiles[foundationPileIndex])) {
                this._viewCast.foundationPiles[foundationPileIndex].addCard(this._tempPile.cards);
                this._currentOperation.droppedPile = this._viewCast.foundationPiles[foundationPileIndex];

            } else if (tableauPileIndex !== undefined && this._pilesModel.canAddCardToTableauPile(this._tempPile.cards[0], this._viewCast.tableauPiles[tableauPileIndex])) {
                this._viewCast.tableauPiles[tableauPileIndex].addCard(this._tempPile.cards);
                this._currentOperation.droppedPile = this._viewCast.tableauPiles[tableauPileIndex];
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

        protected get view(): PIXI.Container {
            return this._view;
        }

        protected get mainModel(): MainModel {
            return (ViewController.getRoot() as RootController).mainModel;
        }
    }
}