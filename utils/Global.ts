namespace Pluck {
    export class GlobalFNs {
        constructor() {
            throw new Error("This is a static class");
        }

        /**
         *
         * @returns {boolean} Returns true if the userAgent is mobile device
         */
        static isMobile(): boolean {
            if (navigator.userAgent.match(/Android/i) ||
                navigator.userAgent.match(/webOS/i) ||
                navigator.userAgent.match(/iPhone/i) ||
                navigator.userAgent.match(/iPad/i) ||
                navigator.userAgent.match(/iPod/i) ||
                navigator.userAgent.match(/BlackBerry/i) ||
                navigator.userAgent.match(/Windows Phone/i)) {
                return true;
            } else {
                return false;
            }
        }

        /**
         *
         * @param object Instance of an object
         * @returns {string} Name of the class
         */
        static getQualifiedClassName(object: any) {
            return object.constructor.Name;
        }
    }
}