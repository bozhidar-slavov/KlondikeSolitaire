namespace Pluck {
    export class HashMap {
        private keyArray: any;
        private valueArray: any;

        constructor() {
            this.keyArray = [];
            this.valueArray = [];

        }

        public add(key: any, value: any) {
            var index = this.keyArray.indexOf(key);
            if (index == -1) {
                this.keyArray.push(key);
                this.valueArray.push(value);
            }
            else {
                this.valueArray[index] = value;
            }
        }

        public getVal(key) {
            var index = this.keyArray.indexOf(key);
            return this.valueArray[index];
        }

        public del(key) {
            var index = this.keyArray.indexOf(key);
            if (index != -1) {
                this.keyArray.splice(index, 1);
                this.valueArray.splice(index, 1);
            }
        }
    }
}