'use strict';
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
(function (deps, factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(deps, factory);
    }
})(["require", "exports", './viewHelper', 'backbone', 'jquery'], function (require, exports) {
    var ViewHelper = require('./viewHelper');
    var Backbone = require('backbone');
    var $ = require('jquery');
    var View = (function (_super) {
        __extends(View, _super);
        function View() {
            _super.apply(this, arguments);
            this.defaultOptions = {
                removeModelOnClose: true,
                reRenderOnChange: false,
                listSelector: '.list',
                templateVariables: {},
                ModelView: null,
                ModelViewOptions: {}
            };
            this.options = {};
            this.isDispatch = false;
        }
        View.prototype.initialize = function (options) {
            this.options = $.extend({}, this.defaultOptions, options || {});
            // if oninitialize exists
            if (this.onInitializeStart) {
                // execute it now
                this.onInitializeStart();
            }
            // collection children views, usefull when collection view gets
            // destroyed and we want to take some action on sub views
            this.collectionModelViews = {};
            // list of reference view by model. Usefull to delete all view
            // reference when a model is remove from the collection
            this.referenceModelView = {};
            // check if a template has been defined
            /*if (typeof this.template === 'undefined') {
                    
                throw 'missing template, you need to define a template in your view';
                    
            }*/
            var renderedTemplate;
            if (this.model !== undefined) {
                var templateKeyValues;
                // are there also templateVariables
                if (_.keys(this.options.templateVariables).length > 0) {
                    templateKeyValues = $.extend({}, ViewHelper.get(), this.options.templateVariables, this.getModelAsJson());
                }
                else {
                    templateKeyValues = $.extend({}, ViewHelper.get(), this.getModelAsJson());
                }
                renderedTemplate = this.template(templateKeyValues);
            }
            else if (_.keys(this.options.templateVariables).length > 0) {
                renderedTemplate = this.template($.extend({}, ViewHelper.get(), this.options.templateVariables));
            }
            else {
                renderedTemplate = this.template(ViewHelper.get());
            }
            // sizzle of jquery will throw an error if the view content is
            // not encaplsulated in an html element, for example if the
            // content is just a text
            try {
                var $renderedTemplate = $(renderedTemplate);
            }
            catch (error) {
                throw 'The view template should have at least one root element and not more then one';
            }
            if ($renderedTemplate.length === 1) {
                var rootElement = $renderedTemplate.first().html('');
                this.setElement(rootElement);
            }
            else {
                // unfortunatly we have to ensure that the view template has
                // a root html element and that it only has one ... this is
                // because backbone views by design have an $el attribute
                // containing an element in which the template will be rendered
                throw 'The view template should have at least one root element and not more then one';
            }
            if (this.collection !== undefined) {
                this.listenTo(this.collection, 'add', this.addModel);
                this.listenTo(this.collection, 'remove', this.removeModel);
                this.listenTo(this.collection, 'reset', this.reset);
                this.listenTo(this.collection, 'sort', this.sortModel);
            }
            if (this.model !== undefined) {
                this.listenTo(this.model, 'destroy', this.close);
                if (this.options.reRenderOnChange) {
                    this.listenTo(this.model, 'change', this.reRenderModelView);
                }
            }
            // if oninitialize exists
            if (this.onInitialize) {
                // execute it now
                this.onInitialize();
            }
        };
        View.prototype.render = function () {
            // if onRender exists
            if (this.onRenderStart) {
                // execute it now
                this.onRenderStart();
            }
            var $renderedTemplate = this.htmlize();
            this.setElement($renderedTemplate);
            // if onRender exists
            if (this.onRender) {
                // execute it now
                this.onRender();
            }
            this.isDispatch = true;
            return this;
        };
        View.prototype.reRenderModelView = function () {
            var $renderedTemplate = this.htmlize();
            $(this.el).replaceWith($renderedTemplate);
            this.setElement($renderedTemplate);
        };
        View.prototype.htmlize = function () {
            var _this = this;
            var renderedTemplate;
            // is there a collection?
            if (this.collection !== undefined) {
                // and also a model or templateVariables or nothing?
                if (this.model !== undefined) {
                    var templateKeyValues;
                    // are there also templateVariables
                    if (_.keys(this.options.templateVariables).length > 0) {
                        templateKeyValues = $.extend({}, ViewHelper.get(), this.options.templateVariables, this.getModelAsJson());
                    }
                    else {
                        templateKeyValues = $.extend({}, ViewHelper.get(), this.getModelAsJson());
                    }
                    renderedTemplate = this.template(templateKeyValues);
                }
                else if (_.keys(this.options.templateVariables).length > 0) {
                    renderedTemplate = this.template($.extend({}, ViewHelper.get(), this.options.templateVariables));
                }
                else {
                    renderedTemplate = this.template(ViewHelper.get());
                }
                // for each model of the collection append a modelView to
                // collection dom
                if (this.collection.models.length > 0) {
                    if (this.options.ModelView !== null) {
                        var ModelView = this.options.ModelView;
                    }
                    else {
                        throw 'a collection view needs a ModelView passed on instantiation through the options';
                    }
                    var modelViewsAsHtml = [];
                    _.each(this.collection.models, function (model) {
                        var mergedModelViewOptions = $.extend({}, _this.options.ModelViewOptions, { model: model, parentView: _this });
                        var modelView = new ModelView(mergedModelViewOptions);
                        _this.collectionModelViews[model.cid] = modelView;
                        var $html = modelView.create();
                        _this.referenceModelView[model.cid] = { $html: $html };
                        modelViewsAsHtml.push($html);
                        if (_this.onModelAdded) {
                            _this.onModelAdded(modelView);
                        }
                    });
                    var $renderedTemplateCache = $(renderedTemplate);
                    if ($renderedTemplateCache.is(this.options.listSelector)) {
                        $renderedTemplateCache.append(modelViewsAsHtml);
                    }
                    else {
                        $renderedTemplateCache.find(this.options.listSelector).append(modelViewsAsHtml);
                    }
                    // collection view
                    renderedTemplate = $renderedTemplateCache[0];
                }
            }
            else if (this.model !== undefined) {
                var templateKeyValues;
                // are there also templateVariables
                if (_.keys(this.options.templateVariables).length > 0) {
                    templateKeyValues = $.extend({}, ViewHelper.get(), this.options.templateVariables, this.getModelAsJson());
                }
                else {
                    templateKeyValues = $.extend({}, ViewHelper.get(), this.getModelAsJson());
                }
                // model view
                renderedTemplate = this.template(templateKeyValues);
            }
            else if (_.keys(this.options.templateVariables).length > 0) {
                // templateVariables view
                renderedTemplate = this.template($.extend({}, ViewHelper.get(), this.options.templateVariables));
            }
            else {
                // basic view
                renderedTemplate = this.template(ViewHelper.get());
            }
            return $(renderedTemplate);
        };
        View.prototype.getModelAsJson = function () {
            var data;
            if (this.model) {
                data = this.model.toJSON();
            }
            return data;
        };
        View.prototype.getCollectionAsJson = function () {
            var data;
            if (this.collection) {
                data = this.collection.toJSON();
            }
            return data;
        };
        View.prototype.close = function () {
            if (this.onCloseStart) {
                this.onCloseStart();
            }
            if (this.collectionModelViews !== null) {
                _.each(this.collectionModelViews, (function closeModelViews(modelView) {
                    if (this.onModelRemoved) {
                        this.onModelRemoved(modelView);
                    }
                    modelView.close();
                }).bind(this));
                this.collectionModelViews = {};
            }
            // remove the view from dom and stop listening to events that were
            // added with listenTo or that were added to the events declaration
            this.remove();
            // unbind events triggered from within views using backbone events
            this.unbind();
            if (this.model !== undefined && this.options) {
                if (this.options.removeModelOnClose === true && !!this.collection === true) {
                    this.collection.remove(this.model);
                }
            }
            if (this.collection !== null) {
            }
            // if there is a onClose function ...
            if (this.onClose) {
                // execute it now
                this.onClose();
            }
        };
        View.prototype.create = function () {
            if (this.isDispatch === true) {
                return this.$el;
            }
            return this.render().$el;
        };
        View.prototype.clear = function () {
            Ribs.Container.clear(this.options.listSelector);
            this.referenceModelView = {};
        };
        View.prototype.empty = function () {
            //Container.clear(this.options.listSelector);
            if (this.collectionModelViews !== null) {
                _.each(this.collectionModelViews, (function closeModelViews(modelView) {
                    if (this.onModelRemoved) {
                        this.onModelRemoved(modelView);
                    }
                    modelView.close();
                }).bind(this));
                this.collectionModelViews = {};
            }
            this.referenceModelView = {};
        };
        View.prototype.reset = function (collection) {
            this.removeUnusedModelView(collection);
            _.each(collection.models, (function (newModel) {
                this.addModel(newModel);
            }).bind(this));
        };
        View.prototype.removeUnusedModelView = function (collection) {
            collection = collection || this.collection;
            _.each(this.collectionModelViews, (function (viewModel, cid) {
                if (!collection.get(cid)) {
                    viewModel.close();
                    delete this.collectionModelViews[cid];
                    delete this.referenceModelView[cid];
                }
            }).bind(this));
        };
        View.prototype.addModel = function (model) {
            if (model.cid in this.collectionModelViews) {
                var $element = this.collectionModelViews[model.cid].$el;
                var $container = this.$el.find(this.options.listSelector);
                if ($container.length > 0) {
                    $container.append($element);
                }
                else if (($container = this.$el.filter(this.options.listSelector)).length) {
                    $container.append($element);
                }
                return;
            }
            if (this.options.ModelView !== null) {
                var ModelView = this.options.ModelView;
            }
            else {
                throw 'a collection view needs a ModelView passed on instantiation through the options';
            }
            var mergedModelViewOptions = $.extend({}, this.options.ModelViewOptions, { model: model, parentView: this });
            var modelView = new ModelView(mergedModelViewOptions);
            var $element = modelView.create();
            this.referenceModelView[model.cid] = {
                $html: $element,
                container: modelView
            };
            var $container = this.$el.find(this.options.listSelector);
            if ($container.length > 0) {
                $container.append($element);
            }
            else if (($container = this.$el.filter(this.options.listSelector)).length) {
                $container.append($element);
            }
            // TODO: use the container to manage subviews of a list
            //Container.add(this.options.listSelector, modelView);
            this.collectionModelViews[model.cid] = modelView;
            if (this.onModelAdded) {
                this.onModelAdded(modelView);
            }
        };
        View.prototype.removeModel = function (model) {
            var view = this.referenceModelView[model.cid];
            if (view === undefined) {
                return view;
            }
            if (view.container !== undefined) {
                // TODO: use the container to manage subviews of a list
                //Container.remove(this.options.listSelector, view.container);
                view.container.close();
            }
            if (view.$html !== undefined) {
                view.$html.remove();
            }
            delete this.referenceModelView[model.cid];
            delete this.collectionModelViews[model.cid];
            if (this.onModelRemoved) {
                this.onModelRemoved(view);
            }
            return view;
        };
        View.prototype.sortModel = function () {
            var _this = this;
            var $container = this.$el.find(this.options.listSelector);
            if ($container.length === 0) {
                $container = this.$el.filter(this.options.listSelector);
                if ($container.length === 0) {
                    return;
                }
            }
            _.each(this.collection.models, function (model) {
                var modelView = _this.collectionModelViews[model.cid];
                $container.append(modelView.$el);
            });
        };
        return View;
    })(Backbone.View);
    exports.View = View;
});
//# sourceMappingURL=view.js.map