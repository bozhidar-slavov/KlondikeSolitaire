namespace Pluck {
   export class ArrayTools  {
        constructor() {
            throw new Error("This is a static class");
        }

        static flatten(array : Array<any>) {
            var flattened : Array<any> = [];

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
        }

        static equals(arr1 : Array<any>,arr2 : Array<any>) : boolean{
            if(arr1.length != arr2.length) {
                return false;
            }
            for (var i = 0; i < arr1.length; i++) {
                if(arr1[i] != arr2[i]) {
                    return false;
                }

            }
            return true;
        }

        static diff(array :Array<any>,compare) {
            var unique : Array<any> = [];
            for (var i = 0; i < array.length; i++) {
                if(array.indexOf(compare) > -1) {
                    unique.push(array[i]);
                }
            }
            return unique;
        }

        // TODO merge(array, position) method from source
    }
}