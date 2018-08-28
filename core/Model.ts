namespace Pluck {
    export abstract class Model {
        sendNotification(type : string, body? : any) {
            Pluck.ViewController.getRoot().sendNotification(type, body);
        }
        
        dispose() {

        }
    }
}