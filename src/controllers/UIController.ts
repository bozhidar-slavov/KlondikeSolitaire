/// <reference path="../../core/ViewController.ts" />
/// <reference path="../models/Notifications.ts" />
/// <reference path="../views/UIView.ts" />

namespace controllers {

    import ViewController = Pluck.ViewController;
    import Notifications = models.Notifications;
    import UIView = views.UIView;
    
    export class UIController extends ViewController {

        constructor() {

            super();

            this._view = new UIView();

            const viewCast = this._view as UIView;

            viewCast.newGameButton.on("click", () => {
                this.sendNotification(Notifications.New_Game);
            });

            viewCast.undoButton.on("click", () => {
                this.sendNotification(Notifications.Undo);
            });
        }
    }
}