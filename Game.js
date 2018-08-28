var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var Pluck;
(function (Pluck) {
    var Model = /** @class */ (function () {
        function Model() {
        }
        Model.prototype.sendNotification = function (type, body) {
            Pluck.ViewController.getRoot().sendNotification(type, body);
        };
        Model.prototype.dispose = function () {
        };
        return Model;
    }());
    Pluck.Model = Model;
})(Pluck || (Pluck = {}));
var Pluck;
(function (Pluck) {
    var Notification = /** @class */ (function () {
        function Notification(name, body) {
            this._name = name;
            this._body = body;
        }
        Object.defineProperty(Notification.prototype, "name", {
            get: function () {
                return this._name;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Notification.prototype, "body", {
            get: function () {
                return this._body;
            },
            enumerable: true,
            configurable: true
        });
        return Notification;
    }());
    Pluck.Notification = Notification;
})(Pluck || (Pluck = {}));
var Pluck;
(function (Pluck) {
    //import * as Notification from 'Notification';
    var NotificationMap = /** @class */ (function () {
        function NotificationMap() {
            this.data = {};
        }
        NotificationMap.prototype.register = function (controller) {
            var interests = controller.getInterests();
            for (var i = 0; i < interests.length; i++) {
                this.registerRecipient(interests[i], controller);
            }
        };
        NotificationMap.prototype.unregister = function (controller) {
            var interests = controller.getInterests();
            for (var i = 0; i < interests.length; i++) {
                var recipients = this.getRecipients(interests[i]);
                recipients.splice(recipients.indexOf(controller), 1);
            }
        };
        NotificationMap.prototype.notify = function (notification) {
            var recipients = this.getRecipients(notification.name);
            if (recipients) {
                recipients = recipients.concat();
                for (var i = 0; i < recipients.length; i++) {
                    if (recipients[i].shouldReceiveNotifications)
                        recipients[i].handleNotification(notification);
                }
            }
        };
        NotificationMap.prototype.registerRecipient = function (notificationName, controller) {
            if (notificationName in this.data) {
                var recipients = this.getRecipients(notificationName);
                recipients.push(controller);
            }
            else {
                this.data[notificationName] = [];
                this.data[notificationName][0] = controller;
            }
        };
        NotificationMap.prototype.getRecipients = function (notificationName) {
            return this.data[notificationName];
        };
        return NotificationMap;
    }());
    Pluck.NotificationMap = NotificationMap;
})(Pluck || (Pluck = {}));
var Pluck;
(function (Pluck) {
    var HashMap = /** @class */ (function () {
        function HashMap() {
            this.keyArray = [];
            this.valueArray = [];
        }
        HashMap.prototype.add = function (key, value) {
            var index = this.keyArray.indexOf(key);
            if (index == -1) {
                this.keyArray.push(key);
                this.valueArray.push(value);
            }
            else {
                this.valueArray[index] = value;
            }
        };
        HashMap.prototype.getVal = function (key) {
            var index = this.keyArray.indexOf(key);
            return this.valueArray[index];
        };
        HashMap.prototype.del = function (key) {
            var index = this.keyArray.indexOf(key);
            if (index != -1) {
                this.keyArray.splice(index, 1);
                this.valueArray.splice(index, 1);
            }
        };
        return HashMap;
    }());
    Pluck.HashMap = HashMap;
})(Pluck || (Pluck = {}));
///<reference path="../utils/HashMap.ts"/>
var Pluck;
(function (Pluck) {
    var ViewController = /** @class */ (function () {
        function ViewController(view, model) {
            if (view === void 0) { view = null; }
            if (model === void 0) { model = null; }
            this.parent = null;
            this.children = [];
            this.autoDispose = true;
            this._view = view;
            this._model = model; // not every controller has model
            this._shouldReceiveNotifications = true;
        }
        ViewController.setRoot = function (root) {
            if (this.root) {
                throw new Error('Root controller has been already set!');
            }
            this.root = root;
            this.controllerMap.add(this.root.constructor, this.root);
            this.root.onRegister();
            this.notificationMap.register(this.root);
        };
        ViewController.getRoot = function () {
            return this.root;
        };
        ViewController.disposeRootController = function () {
            while (this.root.children.length > 0) {
                this.root.removeChildViewController(this.root.children[0]);
            }
            this.controllerMap.del(this.root.constructor);
            this.notificationMap.unregister(this.root);
            this.root.onUnregister();
            this.root.dispose();
            var rootModel = this.root._model;
            if (rootModel && 'dispose' in rootModel)
                rootModel.dispose();
            this.root = null;
        };
        Object.defineProperty(ViewController.prototype, "shouldReceiveNotifications", {
            get: function () {
                return this._shouldReceiveNotifications;
            },
            enumerable: true,
            configurable: true
        });
        //body parameter should be optional ?
        ViewController.prototype.getInterests = function () {
            return [];
        };
        ViewController.prototype.sendNotification = function (type, body) {
            ViewController.notificationMap.notify(new Pluck.Notification(type, body));
        };
        ViewController.prototype.handleNotification = function (notification) {
        };
        ViewController.prototype.onRegister = function () {
        };
        ViewController.prototype.onUnregister = function () {
        };
        ViewController.prototype.hasChildViewController = function (controller) {
            return this.children.indexOf(controller) != -1;
        };
        ViewController.prototype.addChildViewController = function (controller) {
            if (!this.hasChildViewController(controller)) {
                this.children.push(controller);
                controller.parent = this;
                ViewController.controllerMap.add(controller.constructor, controller);
                ViewController.notificationMap.register(controller);
                if (this._view instanceof PIXI.Container && controller._view instanceof PIXI.DisplayObject) {
                    this._view.addChild(controller._view);
                }
                controller.onRegister();
            }
            return controller;
        };
        ViewController.prototype.removeChildViewController = function (controller) {
            if (this.hasChildViewController(controller)) {
                while (controller.children.length > 0) {
                    controller.removeChildViewController(controller.children[0]);
                }
                this.children.splice(this.children.indexOf(controller), 1);
                controller.parent = null;
                ViewController.controllerMap.del(controller.constructor);
                ViewController.notificationMap.unregister(controller);
                controller.onUnregister();
                if (controller.autoDispose) {
                    controller._shouldReceiveNotifications = false;
                    controller.destroy();
                }
            }
        };
        ViewController.prototype.destroy = function () {
            if (this._view instanceof PIXI.DisplayObject) {
                if (this._view.parent) {
                    this._view.parent.removeChild(this._view);
                }
            }
            this.dispose();
            if (this._view && 'dispose' in this._view)
                this._view.dispose();
            if (this._model && 'dispose' in this._model)
                this._model.dispose();
            this._view = null;
            this._model = null;
        };
        ViewController.prototype.dispose = function () {
        };
        ViewController.prototype.getController = function (constructor) {
            if (ViewController.controllerMap.getVal(constructor) == undefined) {
                return null;
            }
            return ViewController.controllerMap.getVal(constructor);
        };
        ViewController.prototype.unique = function () {
            return this.getController(this.constructor) || this;
        };
        Object.defineProperty(ViewController.prototype, "zIndex", {
            get: function () {
                if (this._view instanceof PIXI.DisplayObject) {
                    var displayObject = this._view;
                    if (displayObject.parent)
                        return displayObject.parent.getChildIndex(displayObject);
                    else
                        return -1;
                }
                return -1;
            },
            set: function (value) {
                if (this._view instanceof PIXI.DisplayObject) {
                    var displayObject = this._view;
                    if (displayObject.parent)
                        displayObject.parent.setChildIndex(displayObject, value);
                }
            },
            enumerable: true,
            configurable: true
        });
        // TODO check if works
        ViewController.controllerMap = new Pluck.HashMap;
        ViewController.notificationMap = new Pluck.NotificationMap();
        ViewController.root = null;
        return ViewController;
    }());
    Pluck.ViewController = ViewController;
})(Pluck || (Pluck = {}));
var Pluck;
(function (Pluck) {
    var ArrayTools = /** @class */ (function () {
        function ArrayTools() {
            throw new Error("This is a static class");
        }
        ArrayTools.flatten = function (array) {
            var flattened = [];
            for (var i = 0; i < array.length; i++) {
                var obj = array[i];
                if (obj instanceof Array) {
                    flattened = flattened.concat(this.flatten(obj));
                }
                else {
                    flattened.push(obj);
                }
            }
            return flattened;
        };
        ArrayTools.equals = function (arr1, arr2) {
            if (arr1.length != arr2.length) {
                return false;
            }
            for (var i = 0; i < arr1.length; i++) {
                if (arr1[i] != arr2[i]) {
                    return false;
                }
            }
            return true;
        };
        ArrayTools.diff = function (array, compare) {
            var unique = [];
            for (var i = 0; i < array.length; i++) {
                if (array.indexOf(compare) > -1) {
                    unique.push(array[i]);
                }
            }
            return unique;
        };
        return ArrayTools;
    }());
    Pluck.ArrayTools = ArrayTools;
})(Pluck || (Pluck = {}));
var Pluck;
(function (Pluck) {
    var External = /** @class */ (function () {
        function External() {
        }
        External.prototype.serialize = function (obj) {
            for (var key in obj) {
                if (this.hasOwnProperty(key)) {
                    if (typeof this[key] === "object" && this[key] instanceof External) {
                        this[key].serialize(obj[key]);
                    }
                    else {
                        if (this[key] instanceof Array && typeof this[key][0] === "object" &&
                            this[key][0] instanceof External) {
                            if (obj[key].length == 0) {
                                this[key].length = 0;
                            }
                            else {
                                var objectClassConstructor = this[key][0].constructor;
                                for (var i = 0; i < obj[key].length; i++) {
                                    this[key][i] = new objectClassConstructor();
                                    this[key][i].serialize(obj[key][i]);
                                }
                            }
                        }
                        else {
                            this[key] = obj[key];
                        }
                    }
                }
            }
        };
        return External;
    }());
    Pluck.External = External;
})(Pluck || (Pluck = {}));
var Pluck;
(function (Pluck) {
    var GlobalFNs = /** @class */ (function () {
        function GlobalFNs() {
            throw new Error("This is a static class");
        }
        /**
         *
         * @returns {boolean} Returns true if the userAgent is mobile device
         */
        GlobalFNs.isMobile = function () {
            if (navigator.userAgent.match(/Android/i) ||
                navigator.userAgent.match(/webOS/i) ||
                navigator.userAgent.match(/iPhone/i) ||
                navigator.userAgent.match(/iPad/i) ||
                navigator.userAgent.match(/iPod/i) ||
                navigator.userAgent.match(/BlackBerry/i) ||
                navigator.userAgent.match(/Windows Phone/i)) {
                return true;
            }
            else {
                return false;
            }
        };
        /**
         *
         * @param object Instance of an object
         * @returns {string} Name of the class
         */
        GlobalFNs.getQualifiedClassName = function (object) {
            return object.constructor.Name;
        };
        return GlobalFNs;
    }());
    Pluck.GlobalFNs = GlobalFNs;
})(Pluck || (Pluck = {}));
var models;
(function (models) {
    var MainModel = /** @class */ (function () {
        function MainModel() {
            this._deck = new models.Deck();
        }
        MainModel.prototype.drawCardFromDeck = function () {
            return this._deck.drawCard();
        };
        MainModel.prototype.insertCardsInDeck = function (cards) {
            this._deck.insertCards(cards);
        };
        Object.defineProperty(MainModel.prototype, "deck", {
            get: function () {
                return this._deck;
            },
            set: function (deck) {
                this._deck = deck;
            },
            enumerable: true,
            configurable: true
        });
        return MainModel;
    }());
    models.MainModel = MainModel;
})(models || (models = {}));
var enums;
(function (enums) {
    var CardSuit;
    (function (CardSuit) {
        CardSuit[CardSuit["Club"] = 0] = "Club";
        CardSuit[CardSuit["Diamond"] = 1] = "Diamond";
        CardSuit[CardSuit["Heart"] = 2] = "Heart";
        CardSuit[CardSuit["Spade"] = 3] = "Spade"; // ♠
    })(CardSuit = enums.CardSuit || (enums.CardSuit = {}));
})(enums || (enums = {}));
var enums;
(function (enums) {
    var CardType;
    (function (CardType) {
        CardType[CardType["Ace"] = 1] = "Ace";
        CardType[CardType["Two"] = 2] = "Two";
        CardType[CardType["Three"] = 3] = "Three";
        CardType[CardType["Four"] = 4] = "Four";
        CardType[CardType["Five"] = 5] = "Five";
        CardType[CardType["Six"] = 6] = "Six";
        CardType[CardType["Seven"] = 7] = "Seven";
        CardType[CardType["Eight"] = 8] = "Eight";
        CardType[CardType["Nine"] = 9] = "Nine";
        CardType[CardType["Ten"] = 10] = "Ten";
        CardType[CardType["Jack"] = 11] = "Jack";
        CardType[CardType["Queen"] = 12] = "Queen";
        CardType[CardType["King"] = 13] = "King";
    })(CardType = enums.CardType || (enums.CardType = {}));
})(enums || (enums = {}));
/// <reference path="../enums/CardSuit.ts" />
/// <reference path="../enums/CardType.ts" />
var gameObjects;
(function (gameObjects) {
    var CardType = enums.CardType;
    var CardSuit = enums.CardSuit;
    var Card = /** @class */ (function (_super) {
        __extends(Card, _super);
        function Card(type, suit) {
            var _this = _super.call(this) || this;
            _this._type = type;
            _this._suit = suit;
            _this.cardBackImage = new PIXI.Sprite(PIXI.Texture.fromImage("cardBackRed.png"));
            var card = _this.createCard(type, suit);
            _this.addChild(card);
            _this.interactive = true;
            return _this;
        }
        Object.defineProperty(Card.prototype, "type", {
            get: function () {
                return this._type;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Card.prototype, "suit", {
            get: function () {
                return this._suit;
            },
            enumerable: true,
            configurable: true
        });
        Card.prototype.createCard = function (type, suit) {
            if (!type && !suit) {
                return new PIXI.Sprite(PIXI.Texture.fromImage("cardBackRed.png"));
            }
            this.cardClean = new PIXI.Sprite(PIXI.Texture.fromImage("cardClean.png"));
            var cardSuit;
            var cardText;
            var cardPicture;
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
            var blackColorTextStyle = {
                fontSize: Card.Font_Size,
                fontWeight: Card.Font_Weight,
                fill: Card.Black_Color
            };
            var redColorTextStyle = {
                fontSize: Card.Font_Size,
                fontWeight: Card.Font_Weight,
                fill: Card.Red_Color
            };
            // adding card text and picture to clean card
            var isTextBlack;
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
        };
        Card.Font_Size = 26;
        Card.Font_Weight = "720";
        Card.Red_Color = 0xff1010;
        Card.Black_Color = 0x000000;
        Card.Card_Letters = {
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
        return Card;
    }(PIXI.Container));
    gameObjects.Card = Card;
})(gameObjects || (gameObjects = {}));
/// <reference path="../gameObjects/Card.ts" />
/// <reference path="../enums/CardSuit.ts" />
/// <reference path="../enums/CardType.ts" />
var models;
(function (models) {
    var Card = gameObjects.Card;
    var CardSuit = enums.CardSuit;
    var CardType = enums.CardType;
    var Deck = /** @class */ (function () {
        function Deck() {
            this.initializeDeck();
            this.shuffleDeck();
        }
        Deck.prototype.drawCard = function () {
            return this._deck.pop();
        };
        Deck.prototype.insertCards = function (cards) {
            (_a = this._deck).push.apply(_a, cards);
            var _a;
        };
        Object.defineProperty(Deck.prototype, "cards", {
            get: function () {
                return this._deck;
            },
            enumerable: true,
            configurable: true
        });
        Deck.prototype.initializeDeck = function () {
            this._deck = [];
            for (var _i = 0, _a = Deck.All_Card_Suits; _i < _a.length; _i++) {
                var cardSuit = _a[_i];
                for (var _b = 0, _c = Deck.All_Card_Types; _b < _c.length; _b++) {
                    var cardType = _c[_b];
                    this._deck.push(new Card(cardType, cardSuit));
                }
            }
        };
        Deck.prototype.shuffleDeck = function () {
            for (var i = this._deck.length - 1; i > 0; i--) {
                var n = Math.floor(Math.random() * (i + 1));
                var temp = this._deck[i];
                this._deck[i] = this._deck[n];
                this._deck[n] = temp;
            }
        };
        Deck.All_Card_Types = [
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
        Deck.All_Card_Suits = [
            CardSuit.Club,
            CardSuit.Diamond,
            CardSuit.Heart,
            CardSuit.Spade
        ];
        return Deck;
    }());
    models.Deck = Deck;
})(models || (models = {}));
var models;
(function (models) {
    var Notifications = /** @class */ (function () {
        function Notifications() {
        }
        Notifications.Undo = "Undo";
        Notifications.New_Game = "New Game";
        return Notifications;
    }());
    models.Notifications = Notifications;
})(models || (models = {}));
var enums;
(function (enums) {
    var PileType;
    (function (PileType) {
        PileType[PileType["Stock"] = 0] = "Stock";
        PileType[PileType["Waste"] = 1] = "Waste";
        PileType[PileType["Foundation"] = 2] = "Foundation";
        PileType[PileType["Tableau"] = 3] = "Tableau";
        PileType[PileType["Temp"] = 4] = "Temp";
    })(PileType = enums.PileType || (enums.PileType = {}));
})(enums || (enums = {}));
/// <reference path="../enums/PileType.ts" />
/// <reference path="../enums/CardSuit.ts" />
/// <reference path="../enums/CardType.ts" />
var gameObjects;
(function (gameObjects) {
    var PileType = enums.PileType;
    var Pile = /** @class */ (function (_super) {
        __extends(Pile, _super);
        function Pile(pileType, shouldStack) {
            if (shouldStack === void 0) { shouldStack = false; }
            var _this = _super.call(this) || this;
            _this.type = pileType;
            _this.shouldStack = shouldStack;
            var card = new gameObjects.Card();
            Pile.Pile_Width = card.width - 10;
            Pile.Pile_Height = card.height - 10;
            _this.cards = [];
            var pile = _this.createPile(pileType);
            pile.x += 6;
            pile.y += 2;
            _this.addChild(pile);
            return _this;
        }
        Object.defineProperty(Pile.prototype, "getPileType", {
            get: function () {
                return this.type;
            },
            enumerable: true,
            configurable: true
        });
        Pile.prototype.createPile = function (pileType) {
            return (_a = {},
                _a[PileType.Stock] = this.drawRefreshOnStockPile(),
                _a[PileType.Waste] = this.drawRoundedRectangle(),
                _a[PileType.Foundation] = this.drawSingleFoundationPile(),
                _a[PileType.Tableau] = this.drawRoundedRectangle(),
                _a[PileType.Temp] = this.initTempPile(),
                _a)[pileType];
            var _a;
        };
        Pile.prototype.addCard = function (inputCards) {
            for (var i = 0; i < inputCards.length; i++) {
                this.cards.push(inputCards[i]);
                inputCards[i].x = inputCards[i].y = 0;
                if (this.shouldStack) {
                    inputCards[i].y = (this.cards.length - 1) * Pile.Distance_Between_Stacked_Cards;
                }
                this.addChild(inputCards[i]);
            }
        };
        Pile.prototype.removeCard = function (card) {
            var cardIndex = this.cards.indexOf(card);
            this.cards.splice(cardIndex, 1);
            this.removeChild(card);
            return card;
        };
        Pile.prototype.removeAllCards = function () {
            while (this.cards.length > 0) {
                this.removeChild(this.cards.pop());
            }
        };
        Pile.prototype.initTempPile = function () {
            return new PIXI.Graphics();
        };
        Pile.prototype.drawSingleFoundationPile = function () {
            var rectangle = this.drawRoundedRectangle();
            // add suits transparent image to rectangle
            var suits = new PIXI.Sprite(PIXI.Texture.fromImage("suits.png"));
            this.setSpriteCenter(suits);
            rectangle.addChild(suits);
            return rectangle;
        };
        Pile.prototype.drawRefreshOnStockPile = function () {
            var rectangle = this.drawRoundedRectangle();
            // add refresh transparent image to rectangle
            var refresh = new PIXI.Sprite(PIXI.Texture.fromImage("refresh.png"));
            this.setSpriteCenter(refresh);
            rectangle.addChild(refresh);
            return rectangle;
        };
        Pile.prototype.drawRoundedRectangle = function () {
            var graphics = new PIXI.Graphics();
            graphics.lineStyle(Pile.Line_Width, Pile.Black_Color);
            graphics.drawRoundedRect(0, 0, Pile.Pile_Width, Pile.Pile_Height, Pile.Rectangle_Radius);
            return graphics;
        };
        Pile.prototype.setSpriteCenter = function (sprite) {
            var suitsImageTexture = PIXI.Texture.fromImage("suits.png");
            var suitsImageWidth = suitsImageTexture.width;
            var suitsImageHeigth = suitsImageTexture.height;
            var xPosition = ((Pile.Pile_Width - suitsImageWidth) / 2);
            var yPosition = ((Pile.Pile_Height - suitsImageHeigth) / 2);
            sprite.x = xPosition;
            sprite.y = yPosition;
        };
        Pile.Rectangle_Radius = 20;
        Pile.Black_Color = 0x000000;
        Pile.Line_Width = 4;
        Pile.Distance_Between_Stacked_Cards = 30;
        return Pile;
    }(PIXI.Container));
    gameObjects.Pile = Pile;
})(gameObjects || (gameObjects = {}));
/// <reference path="../gameObjects/Card.ts" />
/// <reference path="../gameObjects/Pile.ts" />
var models;
(function (models) {
    var Operation = /** @class */ (function () {
        function Operation(cards, draggedPile) {
            this.cards = cards;
            this.draggedPile = draggedPile;
        }
        return Operation;
    }());
    models.Operation = Operation;
})(models || (models = {}));
/// <reference path="../../core/Model.ts" />
/// <reference path="../models/Operation.ts" />
var models;
(function (models) {
    var PilesModel = /** @class */ (function (_super) {
        __extends(PilesModel, _super);
        function PilesModel() {
            var _this = _super.call(this) || this;
            _this.operations = [];
            return _this;
        }
        return PilesModel;
    }(Pluck.Model));
    models.PilesModel = PilesModel;
})(models || (models = {}));
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
var controllers;
(function (controllers) {
    var ViewController = Pluck.ViewController;
    var Notifications = models.Notifications;
    var Deck = models.Deck;
    var Pile = gameObjects.Pile;
    var Card = gameObjects.Card;
    var PileType = enums.PileType;
    var CardType = enums.CardType;
    var CardSuit = enums.CardSuit;
    var Operation = models.Operation;
    var PilesModel = models.PilesModel;
    var PilesController = /** @class */ (function (_super) {
        __extends(PilesController, _super);
        function PilesController() {
            var _this = _super.call(this, new PIXI.Container()) || this;
            _this._pilesModel = new PilesModel();
            _this._stockCard = new Card();
            _this.createStockPile();
            _this.createWastePile();
            _this.createFoundationPiles();
            _this.createTableauPiles();
            _this.addCardsInTableauPile();
            _this.addCardsInStockPile();
            _this.setupEventListeners(true);
            _this.setupKeyboardEvents();
            return _this;
        }
        PilesController.prototype.getInterests = function () {
            return [
                Notifications.New_Game,
                Notifications.Undo
            ];
        };
        PilesController.prototype.handleNotification = function (notification) {
            switch (notification.name) {
                case Notifications.Undo:
                    this.executeUndo();
                    break;
                case Notifications.New_Game:
                    this.createNewGame();
                    break;
            }
        };
        PilesController.prototype.createStockPile = function () {
            this._stockPile = new Pile(PileType.Stock);
            this._stockPile.x = PilesController.Stock_Pile_X;
            this._stockPile.y = PilesController.Stock_Pile_Y;
            this.view.addChild(this._stockPile);
            this._stockPile.buttonMode = true;
            this._stockPile.interactive = true;
        };
        PilesController.prototype.createWastePile = function () {
            this._wastePile = new Pile(PileType.Waste);
            this._wastePile.x = PilesController.Waste_Pile_X;
            this._wastePile.y = PilesController.Waste_Pile_Y;
            this.view.addChild(this._wastePile);
        };
        PilesController.prototype.createFoundationPiles = function () {
            this._foundationPiles = [];
            var startX = PilesController.Foundation_Pile_Start_X;
            for (var i = 0; i < PilesController.Foundation_Piles_Count; i++) {
                var foundationPile = new Pile(PileType.Foundation);
                foundationPile.x = startX;
                foundationPile.y = PilesController.Foundation_Pile_Start_Y;
                this._foundationPiles.push(foundationPile);
                this.view.addChild(foundationPile);
                startX += this._stockCard.width + (PilesController.Line_Width * 2) + PilesController.Distance_Between_Piles + 5;
            }
        };
        PilesController.prototype.createTableauPiles = function () {
            this._tableauPiles = [];
            var startX = PilesController.Tableau_Pile_Start_X;
            for (var i = 0; i < PilesController.Tableau_Piles_Count; i++) {
                var tableauPile = new Pile(PileType.Tableau, true);
                tableauPile.x = startX;
                tableauPile.y = PilesController.Tableau_Pile_Start_Y;
                this._tableauPiles.push(tableauPile);
                this.view.addChild(tableauPile);
                startX += this._stockCard.width + (PilesController.Line_Width * 2) + PilesController.Distance_Between_Piles;
            }
        };
        PilesController.prototype.addCardsInTableauPile = function () {
            for (var i = 0; i < PilesController.Tableau_Piles_Count; i++) {
                for (var j = 0; j <= i; j++) {
                    var card = this.mainModel.drawCardFromDeck();
                    this.attachDragAndDrop(card);
                    this._tableauPiles[i].addCard([card]);
                }
            }
        };
        PilesController.prototype.addCardsInStockPile = function () {
            while (this.mainModel.deck.cards.length !== 0) {
                var card = this.mainModel.drawCardFromDeck();
                card.addChild(card.cardBackImage);
                this._stockPile.addCard([card]);
            }
        };
        PilesController.prototype.createNewGame = function () {
            // clear piles
            this._tableauPiles.forEach(function (pile) { return pile.removeAllCards(); });
            this._foundationPiles.forEach(function (pile) { return pile.removeAllCards(); });
            this._wastePile.removeAllCards();
            this._stockPile.removeAllCards();
            // reset undo operations
            this._pilesModel.operations = [];
            // create new deck
            this.mainModel.deck = new Deck();
            // add cards
            this.addCardsInTableauPile();
            this.addCardsInStockPile();
        };
        PilesController.prototype.executeUndo = function () {
            if (this._pilesModel.operations.length === 0) {
                return;
            }
            var droppedPile = this._pilesModel.operations[this._pilesModel.operations.length - 1].droppedPile;
            var draggedPile = this._pilesModel.operations[this._pilesModel.operations.length - 1].draggedPile;
            var cards = this._pilesModel.operations[this._pilesModel.operations.length - 1].cards;
            for (var i = 0; i < cards.length; i++) {
                droppedPile.removeCard(cards[i]);
            }
            if (draggedPile.getPileType === PileType.Stock && droppedPile.getPileType === PileType.Waste) {
                this.removeDragAndDrop(cards[0]);
                // return card back image on card clean
                cards[0].addChild(cards[0].cardBackImage);
            }
            draggedPile.addCard(cards);
            this._pilesModel.operations.pop();
        };
        PilesController.prototype.onStockPileClick = function () {
            if (this._stockPile.cards.length === 0) {
                // reverse cards in pile to move them back in the same order
                this._wastePile.cards.reverse();
                // clear unnecessary undo operations between stock and waste piles
                var counter = 0;
                var operationsLength = this._pilesModel.operations.length;
                while (this._pilesModel.operations.length > 0) {
                    var operation = this._pilesModel.operations[counter];
                    if (operation.draggedPile.getPileType === PileType.Stock && operation.droppedPile.getPileType === PileType.Waste) {
                        var operationToRemove = this._pilesModel.operations.indexOf(operation);
                        this._pilesModel.operations.splice(operationToRemove, 1);
                        operationsLength--;
                    }
                    else {
                        counter++;
                    }
                    if (operationsLength === counter) {
                        break;
                    }
                }
                for (var i = 0; i < this._wastePile.cards.length; i++) {
                    var currentCard = this._wastePile.cards[i];
                    // remove drag and drop listeners to avoid conflict with click event.
                    this.removeDragAndDrop(currentCard);
                    this._stockPile.addCard([currentCard]);
                    // add card back red to clean card
                    currentCard.addChild(currentCard.cardBackImage);
                }
                this._wastePile.removeAllCards();
            }
            else {
                // for undo operation
                var currentCard = this._stockPile.cards[this._stockPile.cards.length - 1];
                this._currentOperation = new Operation([currentCard], this._stockPile);
                this._currentOperation.droppedPile = this._wastePile;
                this._pilesModel.operations.push(this._currentOperation);
                this._wastePile.addCard([currentCard]);
                // remove card back image
                currentCard.removeChild(currentCard.cardBackImage);
                this.attachDragAndDrop(currentCard);
                this._stockPile.removeCard(currentCard);
            }
        };
        PilesController.prototype.setupKeyboardEvents = function () {
            var _this = this;
            document.onkeydown = function (e) {
                if (e.keyCode === 90 && e.ctrlKey) {
                    _this.executeUndo();
                }
                else if (e.keyCode === 32) {
                    _this.onStockPileClick();
                }
            };
        };
        PilesController.prototype.setupEventListeners = function (attach) {
            if (attach) {
                // add event
                this._stockPile.on("click", this.onStockPileClick.bind(this));
            }
            else {
                // remove event
                this._stockPile.off("click", this.onStockPileClick.bind(this));
            }
        };
        PilesController.prototype.attachDragAndDrop = function (target) {
            target.on('mousedown', this.onMouseDown.bind(this));
            target.on('mouseup', this.onMouseUp.bind(this));
            target.on('mouseupoutside', this.onMouseUp.bind(this));
            target.on('mousemove', this.onMouseMove.bind(this));
            target.buttonMode = true;
        };
        PilesController.prototype.removeDragAndDrop = function (target) {
            target.off("mousedown");
            target.off("mouseup");
            target.off("mouseupoutside");
            target.off("mousemove");
        };
        PilesController.prototype.onMouseDown = function (e) {
            this._targetCard = e.target;
            this._targetCard.data = e.data;
            var cardPile = this._targetCard.parent;
            this._targetPile = cardPile;
            var canDrag = this.canDragCards();
            if (canDrag) {
                var targetCardIndex = this._targetPile.cards.indexOf(this._targetCard);
                this._tempPile = new Pile(PileType.Temp, true);
                var targetPileLength = this._targetPile.cards.length;
                for (var i = targetCardIndex; i < targetPileLength; i++) {
                    var currentCard = this._targetPile.removeCard(this._targetPile.cards[targetCardIndex]);
                    this._tempPile.addCard([currentCard]);
                }
                this._currentOperation = new Operation(this._tempPile.cards, this._targetPile);
                this.view.addChild(this._tempPile);
                this._dragDifference = e.data.getLocalPosition(this._targetCard);
                this._tempPile.position.set(e.data.global.x - this._dragDifference.x, e.data.global.y - this._dragDifference.y);
                this._isDragging = true;
            }
            else {
                this._targetCard = null;
                this._targetPile = null;
                this._tempPile = null;
                return;
            }
        };
        PilesController.prototype.onMouseMove = function (e) {
            if (this._isDragging) {
                this._tempPile.position.set(e.data.global.x - this._dragDifference.x, e.data.global.y - this._dragDifference.y);
            }
        };
        PilesController.prototype.onMouseUp = function () {
            if (!this._targetCard) {
                return;
            }
            this._isDragging = false;
            var foundationPileIndex = this.checkPilesForCollision(this._foundationPiles);
            var tableauPileIndex = this.checkPilesForCollision(this._tableauPiles);
            // if card/cards should be placed somewhere
            if (foundationPileIndex !== undefined && this.canAddCardToFoundationPile(this._tempPile.cards[0], this._foundationPiles[foundationPileIndex])) {
                this._foundationPiles[foundationPileIndex].addCard(this._tempPile.cards);
                this._currentOperation.droppedPile = this._foundationPiles[foundationPileIndex];
            }
            else if (tableauPileIndex !== undefined && this.canAddCardToTableauPile(this._tempPile.cards[0], this._tableauPiles[tableauPileIndex])) {
                this._tableauPiles[tableauPileIndex].addCard(this._tempPile.cards);
                this._currentOperation.droppedPile = this._tableauPiles[tableauPileIndex];
            }
            else {
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
        };
        PilesController.prototype.canAddCardToFoundationPile = function (card, pile) {
            var canAdd;
            var currentPileSuit;
            var bottomPileCard;
            var getPileCardOnTop;
            var canAddNextCard;
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
        };
        PilesController.prototype.canAddCardToTableauPile = function (card, pile) {
            var canAdd;
            var lastCardOfPile;
            var lastCardOfPileSuit;
            var lastCardOfPileType;
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
            }
            else {
                return canAdd;
            }
            canAdd = this.checkIfCardSuitIsOpposite(lastCardOfPileSuit, card);
            return canAdd;
        };
        PilesController.prototype.canDragCards = function () {
            var targetPileIndex = this.checkPilesForCollision(this._tableauPiles);
            var targetCardIndex = this._targetPile.cards.indexOf(this._targetCard);
            var canDrag = false;
            if (this._targetPile.getPileType === PileType.Waste || this._targetPile.getPileType === PileType.Foundation) {
                return true;
            }
            if (this._targetPile.getPileType === PileType.Tableau && (this._targetPile.cards.length - 1 === targetCardIndex)) {
                return true;
            }
            var currentPile = this._tableauPiles[targetPileIndex];
            var currentPileLength = currentPile.cards.length;
            for (var i = targetCardIndex; i < currentPileLength - 1; i++) {
                var currentCard = currentPile.cards[i];
                var nextCard = currentPile.cards[i + 1];
                if (currentCard.type - 1 === nextCard.type && this.checkIfCardSuitIsOpposite(currentCard.suit, nextCard)) {
                    canDrag = true;
                }
                else {
                    return false;
                }
            }
            return canDrag;
        };
        PilesController.prototype.checkIfCardSuitIsOpposite = function (suit, card) {
            var isOpposite = false;
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
        };
        PilesController.prototype.checkPilesForCollision = function (targetPiles) {
            var pileIndex;
            for (var i = 0; i < targetPiles.length; i++) {
                var currentPile = targetPiles[i];
                if (this.checkForCollision(this._targetCard, currentPile)) {
                    pileIndex = i;
                    break;
                }
            }
            return pileIndex;
        };
        PilesController.prototype.checkForCollision = function (card, pile) {
            var cardBounds = card.getBounds();
            var pileBounds = pile.getBounds();
            return cardBounds.x + cardBounds.width > pileBounds.x &&
                cardBounds.x < pileBounds.x + pileBounds.width &&
                cardBounds.y + cardBounds.height > pileBounds.y &&
                cardBounds.y < pileBounds.y + pileBounds.height;
        };
        Object.defineProperty(PilesController.prototype, "view", {
            get: function () {
                return this._view;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PilesController.prototype, "mainModel", {
            get: function () {
                return ViewController.getRoot().mainModel;
            },
            enumerable: true,
            configurable: true
        });
        // Stock Pile
        PilesController.Stock_Pile_X = 20;
        PilesController.Stock_Pile_Y = 20;
        // Waste Pile
        PilesController.Waste_Pile_X = 150;
        PilesController.Waste_Pile_Y = 20;
        // Foundation Pile
        PilesController.Foundation_Piles_Count = 4;
        PilesController.Foundation_Pile_Start_X = 585;
        PilesController.Foundation_Pile_Start_Y = 20;
        // Tableau Pile
        PilesController.Tableau_Piles_Count = 7;
        PilesController.Tableau_Pile_Start_X = 150;
        PilesController.Tableau_Pile_Start_Y = 200;
        // For calculating distance between piles
        PilesController.Distance_Between_Piles = 20;
        PilesController.Line_Width = 4;
        return PilesController;
    }(ViewController));
    controllers.PilesController = PilesController;
})(controllers || (controllers = {}));
var views;
(function (views) {
    var SimpleButton = /** @class */ (function (_super) {
        __extends(SimpleButton, _super);
        function SimpleButton(buttonText, upTexture, downTexture) {
            var _this = _super.call(this) || this;
            _this._upState = new PIXI.Sprite();
            _this._downState = new PIXI.Sprite();
            _this._upState.texture = upTexture;
            _this._downState.texture = downTexture;
            _this._buttonText = new PIXI.Text(buttonText, { fontSize: 28, fontWeight: "1000", fill: 0x000000 });
            _this.setTextAtButtonCenter(_this._buttonText);
            // on click
            _this.on("mousedown", function () {
                _this.down();
            });
            _this.on("mouseup", function () {
                _this.up();
            });
            _this.on("mouseout", function () {
                if (_this._downState.visible && !_this._upState.visible) {
                    _this.up();
                }
            });
            // on hover
            _this.on("mouseover", function () {
                _this.alpha = 0.7;
            });
            _this.on("mouseout", function () {
                _this.alpha = 1;
            });
            _this.interactive = true;
            _this.buttonMode = true;
            _this.compose();
            _this.up();
            return _this;
        }
        SimpleButton.prototype.up = function () {
            this._upState.visible = true;
            this._downState.visible = false;
        };
        SimpleButton.prototype.down = function () {
            this._upState.visible = false;
            this._downState.visible = true;
        };
        SimpleButton.prototype.compose = function () {
            this.addChild(this._upState);
            this.addChild(this._downState);
            this.addChild(this._buttonText);
        };
        SimpleButton.prototype.setTextAtButtonCenter = function (text) {
            var buttonTexture = PIXI.Texture.fromImage("buttonUp.png");
            var buttonWidth = buttonTexture.width;
            var buttonHeight = buttonTexture.height;
            var xPosition = ((buttonWidth - this._buttonText.width) / 2);
            var yPosition = ((buttonHeight - this._buttonText.height) / 2);
            text.x = xPosition;
            text.y = yPosition;
        };
        return SimpleButton;
    }(PIXI.Container));
    views.SimpleButton = SimpleButton;
})(views || (views = {}));
/// <reference path="../../typings/pixi.js.d.ts" />
/// <reference path="../views/SimpleButton.ts" />
var views;
(function (views) {
    var SimpleButton = views.SimpleButton;
    var UIView = /** @class */ (function (_super) {
        __extends(UIView, _super);
        function UIView() {
            var _this = _super.call(this) || this;
            var textureUp = PIXI.Texture.fromImage("buttonUp.png");
            var textureDown = PIXI.Texture.fromImage("buttonDown.png");
            // create new game button and add to stage
            _this.newGameButton = new SimpleButton("New Game", textureUp, textureDown);
            _this.addChild(_this.newGameButton);
            // set position to new game button
            _this.newGameButton.x = 20;
            _this.newGameButton.y = 630;
            _this.newGameButton.width = 115;
            // create undo button and add to stage
            _this.undoButton = new SimpleButton("Undo (ctrl+z)", textureUp, textureDown);
            _this.addChild(_this.undoButton);
            // set position to undo button
            _this.undoButton.x = 20;
            _this.undoButton.y = 550;
            _this.undoButton.width = 115;
            return _this;
        }
        return UIView;
    }(PIXI.Container));
    views.UIView = UIView;
})(views || (views = {}));
/// <reference path="../../core/ViewController.ts" />
/// <reference path="../models/Notifications.ts" />
/// <reference path="../views/UIView.ts" />
var controllers;
(function (controllers) {
    var ViewController = Pluck.ViewController;
    var Notifications = models.Notifications;
    var UIView = views.UIView;
    var UIController = /** @class */ (function (_super) {
        __extends(UIController, _super);
        function UIController() {
            var _this = _super.call(this) || this;
            _this._view = new UIView();
            var viewCast = _this._view;
            viewCast.newGameButton.on("click", function () {
                _this.sendNotification(Notifications.New_Game);
            });
            viewCast.undoButton.on("click", function () {
                _this.sendNotification(Notifications.Undo);
            });
            return _this;
        }
        return UIController;
    }(ViewController));
    controllers.UIController = UIController;
})(controllers || (controllers = {}));
/// <reference path="../models/MainModel.ts"/>
/// <reference path="../controllers/PilesController.ts"/>
/// <reference path="../controllers/UIController.ts" />
var controllers;
(function (controllers) {
    var ViewController = Pluck.ViewController;
    var MainModel = models.MainModel;
    var RootController = /** @class */ (function (_super) {
        __extends(RootController, _super);
        function RootController(rootView) {
            var _this = _super.call(this, rootView, new MainModel()) || this;
            ViewController.setRoot(_this);
            var background = new PIXI.Sprite(PIXI.Texture.fromImage("background.png"));
            _this._view.addChild(background);
            var uiController = new controllers.UIController();
            _this.addChildViewController(uiController);
            var pilesController = new controllers.PilesController();
            _this.addChildViewController(pilesController);
            return _this;
        }
        Object.defineProperty(RootController.prototype, "mainModel", {
            get: function () {
                return this._model;
            },
            enumerable: true,
            configurable: true
        });
        return RootController;
    }(ViewController));
    controllers.RootController = RootController;
})(controllers || (controllers = {}));
///<reference path="../typings/pixi.js.d.ts" />
/// <reference path="../typings/greensock.d.ts" />
///<reference path="controllers/RootController.ts"/>
var solitaire;
(function (solitaire) {
    var RootController = controllers.RootController;
    var Main = /** @class */ (function (_super) {
        __extends(Main, _super);
        function Main() {
            var _this = _super.call(this) || this;
            window.onload = _this.startLoadingAssets.bind(_this);
            return _this;
        }
        Main.prototype.start = function () {
            var rootController = new RootController(this);
        };
        Main.prototype.startLoadingAssets = function () {
            var loader = PIXI.loader;
            loader.add('gameSprite', "../assets/sprites.json");
            loader.on('complete', this.onAssetsLoaded.bind(this));
            loader.load();
        };
        Main.prototype.onAssetsLoaded = function () {
            this.createRenderer();
            this.animate();
            var rootController = new RootController(this);
        };
        Main.prototype.createRenderer = function () {
            PIXI.renderer = PIXI.autoDetectRenderer(1280, 720);
            document.body.appendChild(PIXI.renderer.view);
            this.interactive = true;
            this.animate();
        };
        Main.prototype.animate = function () {
            requestAnimationFrame(this.animate.bind(this));
            PIXI.renderer.render(this);
        };
        return Main;
    }(PIXI.Container));
    solitaire.Main = Main;
})(solitaire || (solitaire = {}));
//# sourceMappingURL=Game.js.map