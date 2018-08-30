/// <reference path="typings/pixi.js.d.ts" />
/// <reference path="typings/greensock.d.ts" />
declare namespace Pluck {
    abstract class Model {
        sendNotification(type: string, body?: any): void;
        dispose(): void;
    }
}
declare namespace Pluck {
    class Notification {
        private _name;
        private _body;
        constructor(name: string, body: any);
        readonly name: string;
        readonly body: any;
    }
}
declare namespace Pluck {
    class NotificationMap {
        private data;
        constructor();
        register(controller: ViewController): void;
        unregister(controller: ViewController): void;
        notify(notification: Notification): void;
        private registerRecipient(notificationName, controller);
        private getRecipients(notificationName);
    }
}
declare namespace Pluck {
    class HashMap {
        private keyArray;
        private valueArray;
        constructor();
        add(key: any, value: any): void;
        getVal(key: any): any;
        del(key: any): void;
    }
}
declare namespace Pluck {
    class ViewController {
        static controllerMap: HashMap;
        static notificationMap: NotificationMap;
        static root: ViewController;
        protected _view: any;
        protected _model: any;
        protected _shouldReceiveNotifications: boolean;
        parent: ViewController;
        children: any[];
        autoDispose: boolean;
        constructor(view?: any, model?: any);
        static setRoot(root: ViewController): void;
        static getRoot(): ViewController;
        static disposeRootController(): void;
        readonly shouldReceiveNotifications: boolean;
        getInterests(): Array<string>;
        sendNotification(type: string, body?: Object): void;
        handleNotification(notification?: Notification): void;
        onRegister(): void;
        onUnregister(): void;
        hasChildViewController(controller: ViewController): boolean;
        addChildViewController(controller: ViewController): ViewController;
        removeChildViewController(controller: ViewController): void;
        destroy(): void;
        dispose(): void;
        getController(constructor: any): ViewController;
        unique(): ViewController;
        zIndex: number;
    }
}
declare namespace Pluck {
    class ArrayTools {
        constructor();
        static flatten(array: Array<any>): any[];
        static equals(arr1: Array<any>, arr2: Array<any>): boolean;
        static diff(array: Array<any>, compare: any): any[];
    }
}
declare namespace Pluck {
    class External {
        serialize(obj: Object): void;
    }
}
declare namespace Pluck {
    class GlobalFNs {
        constructor();
        /**
         *
         * @returns {boolean} Returns true if the userAgent is mobile device
         */
        static isMobile(): boolean;
        /**
         *
         * @param object Instance of an object
         * @returns {string} Name of the class
         */
        static getQualifiedClassName(object: any): any;
    }
}
declare namespace models {
    import Card = gameObjects.Card;
    class MainModel {
        private _deck;
        constructor();
        drawCardFromDeck(): Card;
        insertCardsInDeck(cards: Card[]): void;
        deck: Deck;
    }
}
declare namespace enums {
    enum CardSuit {
        Club = 0,
        Diamond = 1,
        Heart = 2,
        Spade = 3,
    }
}
declare namespace enums {
    enum CardType {
        Ace = 1,
        Two = 2,
        Three = 3,
        Four = 4,
        Five = 5,
        Six = 6,
        Seven = 7,
        Eight = 8,
        Nine = 9,
        Ten = 10,
        Jack = 11,
        Queen = 12,
        King = 13,
    }
}
declare namespace gameObjects {
    import CardType = enums.CardType;
    import CardSuit = enums.CardSuit;
    class Card extends PIXI.Container {
        private static readonly Font_Size;
        private static readonly Font_Weight;
        private static readonly Red_Color;
        private static readonly Black_Color;
        private static readonly Card_Letters;
        private _type;
        private _suit;
        cardClean: PIXI.Sprite;
        cardBackImage: PIXI.Sprite;
        constructor(type?: CardType, suit?: CardSuit);
        readonly type: CardType;
        readonly suit: CardSuit;
        private createCard(type, suit);
    }
}
declare namespace models {
    import Card = gameObjects.Card;
    class Deck {
        private static readonly All_Card_Types;
        private static readonly All_Card_Suits;
        private _deck;
        constructor();
        drawCard(): Card;
        insertCards(cards: Card[]): void;
        readonly cards: Card[];
        private initializeDeck();
        private shuffleDeck();
    }
}
declare namespace models {
    class Notifications {
        static Undo: string;
        static New_Game: string;
    }
}
declare namespace enums {
    enum PileType {
        Stock = 0,
        Waste = 1,
        Foundation = 2,
        Tableau = 3,
        Temp = 4,
    }
}
declare namespace gameObjects {
    import PileType = enums.PileType;
    class Pile extends PIXI.Container {
        private static Pile_Width;
        private static Pile_Height;
        private static readonly Rectangle_Radius;
        private static readonly Black_Color;
        private static readonly Line_Width;
        private static readonly Distance_Between_Stacked_Cards;
        cards: Card[];
        shouldStack: boolean;
        type: PileType;
        constructor(pileType: PileType, shouldStack?: boolean);
        readonly getPileType: PileType;
        createPile(pileType: PileType): PIXI.Graphics;
        addCard(inputCards: Card[]): void;
        removeCard(card: Card): Card;
        removeAllCards(): void;
        initTempPile(): PIXI.Graphics;
        drawSingleFoundationPile(): PIXI.Graphics;
        drawRefreshOnStockPile(): PIXI.Graphics;
        private drawRoundedRectangle();
        private setSpriteCenter(sprite);
    }
}
declare namespace models {
    import Card = gameObjects.Card;
    import Pile = gameObjects.Pile;
    class Operation {
        cards: Card[];
        draggedPile: Pile;
        droppedPile: Pile;
        constructor(cards: Card[], draggedPile: Pile);
    }
}
declare namespace models {
    import Operation = models.Operation;
    import Card = gameObjects.Card;
    import Pile = gameObjects.Pile;
    import CardSuit = enums.CardSuit;
    class PilesModel extends Pluck.Model {
        operations: Operation[];
        constructor();
        canDragCards(targetPile: Pile, targetCard: Card, piles: Pile[]): boolean;
        canAddCardToFoundationPile(card: Card, pile: Pile): boolean;
        canAddCardToTableauPile(card: Card, pile: Pile): boolean;
        checkIfCardSuitIsOpposite(suit: CardSuit, card: Card): boolean;
        checkPilesForCollision(targetPiles: Pile[], targetCard: Card): number;
        checkForCollision(card: Card, pile: Pile): boolean;
    }
}
declare namespace views {
    import Pile = gameObjects.Pile;
    import Card = gameObjects.Card;
    class PilesView extends PIXI.Container {
        private static readonly Stock_Pile_X;
        private static readonly Stock_Pile_Y;
        private static readonly Waste_Pile_X;
        private static readonly Waste_Pile_Y;
        private static readonly Foundation_Piles_Count;
        private static readonly Foundation_Pile_Start_X;
        private static readonly Foundation_Pile_Start_Y;
        private static readonly Tableau_Piles_Count;
        private static readonly Tableau_Pile_Start_X;
        private static readonly Tableau_Pile_Start_Y;
        private static readonly Distance_Between_Piles;
        private static readonly Line_Width;
        stockPile: Pile;
        wastePile: Pile;
        foundationPiles: Pile[];
        tableauPiles: Pile[];
        stockCard: Card;
        constructor();
        createStockPile(): void;
        createWastePile(): void;
        createFoundationPiles(): void;
        createTableauPiles(): void;
    }
}
declare namespace controllers {
    import ViewController = Pluck.ViewController;
    import MainModel = models.MainModel;
    import Card = gameObjects.Card;
    class PilesController extends ViewController {
        private static readonly Tableau_Piles_Count;
        private _targetCard;
        private _targetPile;
        private _tempPile;
        private _dragDifference;
        private _isDragging;
        private _currentOperation;
        private _pilesModel;
        private _viewCast;
        constructor();
        getInterests(): string[];
        handleNotification(notification?: Pluck.Notification): void;
        addCardsInTableauPile(): void;
        addCardsInStockPile(): void;
        createNewGame(): void;
        executeUndo(): void;
        onStockPileClick(): void;
        setupKeyboardEvents(): void;
        setupEventListeners(attach: boolean): void;
        attachDragAndDrop(target: Card): void;
        removeDragAndDrop(target: Card): void;
        onMouseDown(e: PIXI.interaction.InteractionEvent): void;
        onMouseMove(e: PIXI.interaction.InteractionEvent): void;
        onMouseUp(): void;
        protected readonly view: PIXI.Container;
        protected readonly mainModel: MainModel;
    }
}
declare namespace views {
    class SimpleButton extends PIXI.Container {
        private _upState;
        private _downState;
        private _buttonText;
        constructor(buttonText: string, upTexture: PIXI.Texture, downTexture: PIXI.Texture);
        up(): void;
        down(): void;
        private compose();
        private setTextAtButtonCenter(text);
    }
}
declare namespace views {
    import SimpleButton = views.SimpleButton;
    class UIView extends PIXI.Container {
        private static readonly Buttons_Width;
        private static readonly Buttons_Alpha;
        private static readonly New_Game_Button_X;
        private static readonly New_Game_Button_Y;
        private static readonly Undo_Button_X;
        private static readonly Undo_Button_Y;
        textureUp: PIXI.Texture;
        textureDown: PIXI.Texture;
        newGameButton: SimpleButton;
        undoButton: SimpleButton;
        constructor();
        createNewGameButton(): void;
        createUndoButton(): void;
    }
}
declare namespace controllers {
    import ViewController = Pluck.ViewController;
    class UIController extends ViewController {
        constructor();
    }
}
declare namespace controllers {
    import ViewController = Pluck.ViewController;
    import MainModel = models.MainModel;
    class RootController extends ViewController {
        constructor(rootView: PIXI.Container);
        readonly mainModel: MainModel;
    }
}
declare namespace solitaire {
    class Main extends PIXI.Container {
        constructor();
        start(): void;
        private startLoadingAssets();
        private onAssetsLoaded();
        private createRenderer();
        private animate();
    }
}
