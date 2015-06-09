﻿// Type definitions for Ribs
// Project: https://github.com/chrisweb/ribs.js
// Definitions by: Norbert TRAN PHAT <https://github.com/MasGaNo>
// Definitions: https://github.com/borisyankov/DefinitelyTyped

// Library documentation : https://github.com/chrisweb/ribs.js/blob/master/README.md

/// <reference path="../backbone/backbone.d.ts" />
/// <reference path="../jquery/jquery.d.ts" />

declare module Ribs {

    interface ViewOptions extends Backbone.ViewOptions<Backbone.Model> {
        /** 
         * If true, remove model from its collection on view close
         **/
        removeModelOnClose?: boolean;
        reRenderOnChange?: boolean;
        listSelector?: string;
        templateVariables?: Object;
        ModelView?: View|any;//hack...
        ModelViewOptions?: ViewOptions;
    }

    interface ViewReference {
        $html: JQuery;
        container: Backbone.View<Backbone.Model>;
    }

    class View extends Backbone.View<Backbone.Model> {

        public constructor(options?: ViewOptions);
        protected onInitializeStart(): void;
        protected onInitialize(): void;
        public create(): void;
        protected onRenderStart(): void;
        protected onRender(): void;
        protected reRenderModelView(): void;
        public htmlize(): JQuery;
        protected getModelAsJson(): JSON;
        protected getCollectionAsJson(): JSON;
        public clear(): void;
        public empty(): void;
        protected reset(): void;
        public close(): void;
        protected onCloseStart(): void;
        protected onClose(): void;
        protected addModel(model: Backbone.Model): void;
        protected removeModel(model: Backbone.Model): void;
        protected onModelAdded(modelView: View): void;
        protected onModelRemoved(modelView: View): void;

        public isDispatch: boolean;
        //protected template: Function;
        protected referenceModelView: { [cid: string]: ViewReference };
    }

    class Model extends Backbone.Model {
        protected onInitializeStart(): void;
        protected onInitialize(): void;
        /**
         * Get a projection of the model. The model return will be sync with this current model.
         * @param keepAlive If true, when this model will be destroy, the projection will not be destroyed.
         * @param twoWay If true, this model will be sync with its own attribute. So if a projection change one of these attributes, this model will be affected.
         **/
        public getModelProjection(keepAlive?: boolean, twoWay?: boolean): Model;

        /**
         * Original Model source
         */
        public modelSource: Ribs.Model;
    }

    class Collection extends Backbone.Collection<Backbone.Model> {
        onInitialize(options?: any): void;
        batchSave(): void;
        getFilteredCollection(onlyData?: any, notDatas?: any): Collection;
        getRange(start: number, length: number): Collection;
        rangeNextPage(): Collection;
        rangeNext(): Collection;
        rangeGoTo(index: number, newLength?: number): Collection;
        setRangeLength(length: number): Collection;

        _isRange: boolean;
        isCircularRange: boolean;
        _currentRange: number;
        _lengthRange: number;

        collectionSource: Collection;
    }

    class Controller {
        extend(): void;
    }

    module Container {
        function dispatch(containerSelector: string, options?: Object): void;
        function add(containerSelector: string, view: any): void;
        function remove(containerSelector: string, view: any): void;
        function clear(containerSelector: string): void;
    }

    class Router {
        public initialize: void;
        public routes: Object;
        public route: Object;
        public execute: boolean;
        public getCurrentRoute: string;
    }

    function ViewsLoader(views: string, callback: Function);

    class ViewHelpers {
        add(helperName: string, helperCallback: Function): void;
        remove(helperName: string): void;
        get(): { [s: string]: Function };
    }

}

declare module 'ribsjs' {
    export = Ribs;
}