/**
 * https://github.com/chrisweb
 * 
 * Copyright 2014 weber chris
 * Released under the MIT license
 * https://chris.lu
 */

/**
 * 
 * ribs router
 * 
 * @param {type} Backbone
 * @param {type} EventsManager
 * @param {type} Ribs
 * 
 * @returns {_L16.Anonym$8}
 */
define([
    'backbone',
    'ribs.eventsManager',
    'ribs'
    
], function (Backbone, EventsManager, Ribs) {
    
    'use strict';
    
    Ribs.Router = Backbone.Router.extend({

        initialize: function() {

        },
        routes: {},

        route: function(route, name, callback) {
            
            if (!_.isRegExp(route)) route = this._routeToRegExp(route);
            
            if (_.isFunction(name)) {
                
                callback = name;
                name = '';
                
            }
            
            if (!callback) callback = this[name];
            
            var router = this;
            
            Backbone.history.route(route, function(fragment) {
                
                var args = router._extractParameters(route, fragment);
                
                // we use a callback function to allow async calls, the
                // original backbone code uses an if (see below)
                router.execute(callback, args, name, function(executeRoute) {
                    
                    if (executeRoute) {
                    
                        router.trigger.apply(router, ['route:' + name].concat(args));
                        router.trigger('route', name, args);
                        Backbone.history.trigger('route', router, name, args);
                        
                    }
                    
                });
                
                /*
                if (router.execute(callback, args, name) !== false) {
                
                    router.trigger.apply(router, ['route:' + name].concat(args));
                    router.trigger('route', name, args);
                    Backbone.history.trigger('route', router, name, args);
                
                }
                */
                
            });
            
            return this;
            
        },
        execute: function routerExecute(callback, routeArguments, routeName, internalCallback) {
            
            // pre-route event
            EventsManager.trigger(EventsManager.constants.ROUTER_PREROUTE, { 'routeArguments': routeArguments, 'routeName': routeName });
            
            if (callback) callback.apply(this, routeArguments);
            
            // post route event
            EventsManager.trigger(EventsManager.constants.ROUTER_POSTROUTE, { 'routeArguments': routeArguments, 'routeName': routeName });
            
            if (internalCallback !== undefined) {
                
                // can return true or false, if false is returned the current
                // route will get aborted
                internalCallback(true);
                
            } else {
                
                // can return true or false, if false is returned the current
                // route will get aborted
                return true;
                
            }
        },
        getCurrentRoute: function() {
            
            return Backbone.history.fragment;
            
        }

    });

    return Ribs.Router;
    
});
