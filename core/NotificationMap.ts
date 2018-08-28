namespace Pluck {

    //import * as Notification from 'Notification';
    export class NotificationMap {

        private data : Object = {};


        constructor() {
        }

        register(controller : ViewController) {
            var interests = controller.getInterests();
            for (var i = 0; i < interests.length; i++) {
                this.registerRecipient(interests[i], controller);
            }
        }

        unregister(controller : ViewController) {
            var interests = controller.getInterests();
            for (var i = 0; i < interests.length; i++) {
                var recipients = this.getRecipients(interests[i]);
                recipients.splice(recipients.indexOf(controller), 1);
            }
        }

        notify(notification : Notification) {
            var recipients = this.getRecipients(notification.name);
            if (recipients) {
                recipients = recipients.concat();
                for (var i = 0; i < recipients.length; i++) {
                    if(recipients[i].shouldReceiveNotifications)
                        recipients[i].handleNotification(notification);
                }
            }
        }

        private registerRecipient(notificationName: string, controller: ViewController) {
            if (notificationName in this.data) {
                var recipients = this.getRecipients(notificationName);
                recipients.push(controller);
            }
            else {
                this.data[notificationName] = [];
                this.data[notificationName][0] = controller;
            }
        }

        private getRecipients(notificationName : string) {
            return this.data[notificationName];
        }
    }
}