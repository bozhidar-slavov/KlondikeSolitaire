/// <reference path="../../core/Model.ts" />
/// <reference path="../models/Operation.ts" />

namespace models {

    import Operation = models.Operation;

    export class PilesModel extends Pluck.Model  {
        operations: Operation[];

        constructor() {
            super();

            this.operations = [];
        }
    }
}