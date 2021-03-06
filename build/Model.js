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
})(["require", "exports"], function (require, exports) {
    var Model = (function (_super) {
        __extends(Model, _super);
        function Model() {
            _super.apply(this, arguments);
        }
        Model.prototype.initialize = function (attributes, options) {
            var defaultOptions = {
                virtualAttributes: []
            };
            this.options = $.extend(defaultOptions, options || {});
            // on projection two way, get model of the action to avoid stackoverflow
            this.lastModelTriggered = null;
            // if onInitializeStart exists
            if (this.onInitializeStart) {
                // execute it now
                this.onInitializeStart();
            }
            // if onInitialize exists
            if (this.onInitialize) {
                // execute it now
                this.onInitialize();
            }
        };
        Model.prototype.get = function (attribute) {
            if (typeof this[attribute] === 'function') {
                return this[attribute]();
            }
            else {
                return Backbone.Model.prototype.get.call(this, attribute);
            }
        };
        Model.prototype.toJSON = function () {
            var _this = this;
            var attributes = Backbone.Model.prototype.toJSON.call(this);
            if (_.has(this.options, 'virtualAttributes')) {
                _.each(this.options.virtualAttributes, function (virtualAttribute) {
                    if (_.has(virtualAttribute, 'key')) {
                        var virtualAttributeKey = virtualAttribute.key;
                        if (_.isFunction(_this[virtualAttributeKey])) {
                            attributes[virtualAttributeKey] = _this[virtualAttributeKey].call(_this);
                        }
                        else {
                            throw 'virtual attribute function missing';
                        }
                    }
                    else {
                        throw 'virtual attribute "key" missing';
                    }
                });
            }
            return attributes;
        };
        /**
            * Get a projection of the model. The model return will be sync with this current model.
            * @param keepAlive If true, when this model will be destroy, the projection will not be destroyed.
            * @param twoWay If true, this model will be sync with its own attribute. So if a projection change one of these attributes, this model will be affected.
            **/
        Model.prototype.getModelProjection = function (keepAlive, twoWay) {
            var _this = this;
            var model = new Model(this.attributes);
            model.id = model.cid; //we do that to avoid same model with same id of the model (as long as Collection doesn't accept two model with same id)
            this.listenTo(this, 'change', function () {
                // No trigger on the model of the action in two way
                if (_this.lastModelTriggered === model) {
                    return;
                }
                model.set(_this.changed);
            });
            if (twoWay === true) {
                this.listenTo(model, 'change', function () {
                    var newValue = {};
                    _.each(model.changed, (function (value, key) {
                        if (key in this.attributes) {
                            newValue[key] = value;
                        }
                    }).bind(_this));
                    _this.lastModelTriggered = model;
                    _this.set(newValue);
                    _this.lastModelTriggered = null;
                });
            }
            if (keepAlive !== true) {
                this.listenTo(this, 'destroy', function () {
                    model.destroy();
                });
            }
            if (this.modelSource === null) {
                model.modelSource = this;
            }
            else {
                model.modelSource = this.modelSource;
            }
            return model;
        };
        return Model;
    })(Backbone.Model);
    exports.Model = Model;
    ;
});
//# sourceMappingURL=model.js.map