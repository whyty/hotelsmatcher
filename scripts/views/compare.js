/*global define*/

define([
    'jquery',
    'underscore',
    'backbone',
    'layoutmanager'
], function ($, _, Backbone, Layout) {
    'use strict';

    var CompareView = Backbone.View.extend({
        manage: true,
        tagName: 'main',
        className: 'main wrapper clearfix',
        template: 'compare'
    });

    return CompareView;
});
