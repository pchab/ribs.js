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
    var EventsManager = (function (_super) {
        __extends(EventsManager, _super);
        function EventsManager() {
            _super.apply(this, arguments);
            this.constants = {
                // router
                'ROUTER_PREROUTE': 'router:preRoute',
                'ROUTER_POSTROUTE': 'router:postRoute'
            };
        }
        return EventsManager;
    })(Backbone.Events);
    return new EventsManager();
});
//# sourceMappingURL=eventsManager.js.map