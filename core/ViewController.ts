///<reference path="../utils/HashMap.ts"/>

namespace Pluck {

    export class ViewController {

        // TODO check if works

        static controllerMap: HashMap = new HashMap;
        static notificationMap = new NotificationMap();
        static root : ViewController = null;
        protected _view;
        protected _model;
        protected _shouldReceiveNotifications: boolean;
        public parent: ViewController = null;
        public children = [];
        public autoDispose = true;

        constructor(view : any = null, model : any = null) {
            this._view = view;
            this._model = model; // not every controller has model

            this._shouldReceiveNotifications = true;
        }

        static setRoot(root : ViewController) {
            if (this.root) {
                throw new Error('Root controller has been already set!');
            }

            this.root = root;
            this.controllerMap.add(this.root.constructor, this.root);
            this.root.onRegister();
            this.notificationMap.register(this.root);
        }

        static getRoot() {
            return this.root;
        }

        static disposeRootController() {
            while (this.root.children.length > 0) {
                this.root.removeChildViewController(this.root.children[0]);
            }
            this.controllerMap.del(this.root.constructor);
            this.notificationMap.unregister(this.root);
            this.root.onUnregister();
            this.root.dispose();
            const rootModel = this.root._model;
            if ( rootModel && 'dispose' in rootModel)
                rootModel.dispose();
            this.root = null;
        }

        get shouldReceiveNotifications(): boolean {
            return this._shouldReceiveNotifications;
        }

        //body parameter should be optional ?

        getInterests(): Array<string> {
            return [];
        }

        sendNotification(type : string, body? : Object) {
            ViewController.notificationMap.notify(new Notification(type, body));
        }


        handleNotification(notification ?: Notification) {

        }

        onRegister() {

        }

        onUnregister() {

        }

        hasChildViewController(controller : ViewController): boolean {
            return this.children.indexOf(controller) != -1;
        }

        addChildViewController(controller : ViewController) {
            if (!this.hasChildViewController(controller)) {
                this.children.push(controller);
                controller.parent = this;
                ViewController.controllerMap.add(controller.constructor, controller);
                ViewController.notificationMap.register(controller);
                if(this._view instanceof PIXI.Container && controller._view instanceof PIXI.DisplayObject) {
                    this._view.addChild(controller._view);
                }
                controller.onRegister();
            }
            return controller;
        }

        removeChildViewController(controller : ViewController) {
            if (this.hasChildViewController(controller)) {
                while (controller.children.length > 0) {
                    controller.removeChildViewController(controller.children[0]);
                }
                this.children.splice(this.children.indexOf(controller), 1);
                controller.parent = null;
                ViewController.controllerMap.del(controller.constructor);
                ViewController.notificationMap.unregister(controller);
                controller.onUnregister();
                if (controller.autoDispose) {
                    controller._shouldReceiveNotifications = false;
                    controller.destroy();
                }
            }
        }

        destroy() {
            if (this._view instanceof PIXI.DisplayObject) {
                if((this._view as PIXI.DisplayObject).parent)
                {
                    (this._view as PIXI.DisplayObject).parent.removeChild(this._view); 
                }
            }

            this.dispose();
            if ( this._view && 'dispose' in this._view)
                this._view.dispose();
            if ( this._model && 'dispose' in this._model)
                this._model.dispose();

            this._view = null;
            this._model = null;
        }

        dispose() {

        }

        getController(constructor: any): ViewController {
             if ( ViewController.controllerMap.getVal(constructor) == undefined) {
                 return null;
             }
            return ViewController.controllerMap.getVal(constructor);
        }

        unique() {
            return this.getController(this.constructor) || this;
        }

        get zIndex(): number
        {
            if (this._view instanceof PIXI.DisplayObject) {
                const displayObject: PIXI.DisplayObject = this._view;
                
                if (displayObject.parent)
                    return displayObject.parent.getChildIndex(displayObject);
                else
                    return -1;
            }
            
            return -1;
        }
        
        set zIndex(value: number)
        {
            if (this._view instanceof PIXI.DisplayObject) {
                const displayObject: PIXI.DisplayObject = this._view;
                
                if (displayObject.parent)
                    displayObject.parent.setChildIndex(displayObject, value);
            }
        }

    }
}