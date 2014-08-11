/**
 * https://github.com/chrisweb
 * 
 * Copyright 2014 weber chris
 * Released under the MIT license
 * https://chris.lu
 */

/**
 * 
 * router
 * 
 * @param {type} Backbone
 * @param {type} Routes
 * @param {type} eventsManager
 * @returns {_L16.Anonym$8}
 */
define([
    'backbone',
    'routes',
    'ribs.eventsManager'
], function (Backbone, Routes, eventsManager) {
    
    'use strict';
    
    var router;
    
    var initialize = function initializeFunction() {
        
        var Router = Backbone.Router.extend({

            initialize: function() {

            },
            routes: Routes,
            
            // this can be removed as soon as the backbone update got released
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
                    if (router.execute(callback, args, name) !== false) {
                        router.trigger.apply(router, ['route:' + name].concat(args));
                        router.trigger('route', name, args);
                        Backbone.history.trigger('route', router, name, args);
                    }
                });
                return this;
            },
            execute: function routerExecute(callback, args, name) {

                // pre-route event
                eventsManager.trigger('router:preRoute', { 'arguments': args, 'name': name });
                
                if (!user.isLogged() && (args.length !== 1 && args[0] !== null)) {
                    
                    this.navigate('desktop', { trigger: true });
                    
                    return false;
                    
                }
                
                if (callback) {
                    
                    callback.apply(this, args);
                    
                }

                // post route event
                eventsManager.trigger('router:postRoute', { 'arguments': args, 'name': name });
                
            }

        });
        
        return Router;
        
    };
    
    var getRrouter = function instantiateFuntion() {

        if (router === undefined) {
            
            var Router = initialize();
            
            router = new Router();
            
        }
        
        return router;
        
    };

    return {
        start: getRrouter
    };
    
});