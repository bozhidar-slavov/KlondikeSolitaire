namespace Pluck {
    export class External {
        serialize(obj: Object) {
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
                            } else {
                                let objectClassConstructor = this[key][0].constructor;
                                for (let i = 0; i < obj[key].length; i++) {
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
        }
    }
}

