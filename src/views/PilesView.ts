/// <reference path="../../typings/pixi.js.d.ts" />

/// <reference path="../gameObjects/Card.ts" />
/// <reference path="../gameObjects/Pile.ts" />
/// <reference path="../enums/PileType.ts" />

namespace views {
    
    import Pile = gameObjects.Pile;
    import Card = gameObjects.Card
    import PileType = enums.PileType;

    export class PilesView extends PIXI.Container {

        // Stock Pile
        private static readonly Stock_Pile_X = 20;
        private static readonly Stock_Pile_Y = 20;

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
        stockPile: Pile;
        wastePile: Pile;
        foundationPiles: Pile[];
        tableauPiles: Pile[];

        stockCard: Card;


        constructor() {

            super();

            this.stockCard = new Card();

            this.createStockPile();
            this.createWastePile();
            this.createFoundationPiles();
            this.createTableauPiles();

            this.addChild(this.stockPile);
            this.addChild(this.wastePile);
            this.foundationPiles.forEach(pile => this.addChild(pile));
            this.tableauPiles.forEach(pile => this.addChild(pile));

        }

        createStockPile(): void {
            this.stockPile = new Pile(PileType.Stock);

            this.stockPile.x = PilesView.Stock_Pile_X;
            this.stockPile.y = PilesView.Stock_Pile_Y;

            this.stockPile.buttonMode = true;
            this.stockPile.interactive = true;
        }

        createWastePile(): void {
            this.wastePile = new Pile(PileType.Waste);

            this.wastePile.x = PilesView.Waste_Pile_X;
            this.wastePile.y = PilesView.Waste_Pile_Y;
        }

        createFoundationPiles(): void {
            this.foundationPiles = [];
            let startX = PilesView.Foundation_Pile_Start_X;
            for (let i = 0; i < PilesView.Foundation_Piles_Count; i++) {
                let foundationPile = new Pile(PileType.Foundation);
                foundationPile.x = startX;
                foundationPile.y = PilesView.Foundation_Pile_Start_Y;

                this.foundationPiles.push(foundationPile);

                startX += this.stockCard.width + (PilesView.Line_Width * 2) + PilesView.Distance_Between_Piles + 5;
            }
        }

        createTableauPiles(): void {
            this.tableauPiles = [];
            let startX = PilesView.Tableau_Pile_Start_X;
            for (let i = 0; i < PilesView.Tableau_Piles_Count; i++) {
                let tableauPile = new Pile(PileType.Tableau, true);

                tableauPile.x = startX;
                tableauPile.y = PilesView.Tableau_Pile_Start_Y;

                this.tableauPiles.push(tableauPile);

                startX += this.stockCard.width + (PilesView.Line_Width * 2) + PilesView.Distance_Between_Piles;
            }
        }
    }
}