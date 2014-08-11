/**
 * https://github.com/chrisweb
 * 
 * Copyright 2014 weber chris
 * Released under the MIT license
 * https://chris.lu
 */

/**
 * 
 * base model
 * 
 * @param {type} Backbone
 * @returns {unresolved}
 */
define([
    'backbone'
], function (Backbone) {
    
    'use strict';

    var Model = Backbone.Model.extend({
        
        initialize: function(options) {

            this.options = options || {};
            
            // if oninitialize exists
            if (this.onInitialize) {
                
                // execute it now
                this.onInitialize(options);
                
            }
            
        }
        
    });

    return Model;
    
});