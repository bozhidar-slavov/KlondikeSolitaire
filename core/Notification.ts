namespace Pluck {
    export class Notification {

        private _name : string;
        private _body : any;
        
        constructor(name : string, body : any) {
            this._name = name;
            this._body = body;
        }

        get name() {
            return this._name;
        }

        get body() {
            return this._body;
        }
    }
}