/*global define */
define(['layoutmanager', 'routes/hotels'], function (LayoutManager, Router, JST) {
    'use strict';
    var app = {
        Templates: {},
        layout: ( new Backbone.Layout({
            template: 'main',
        })),
        start: function () {
            App.layout.render();
            App.layout.$el.appendTo(".app-content");
            App.router = new Router();
            Backbone.history.start();
        }
    };

    Backbone.Layout.configure({
        prefix: "scripts/templates/",
        fetchTemplate: function(path) {
            path += '.ejs';
            if (app.Templates[path]) {
                return app.Templates[path];
            }
            $.ajax({
                url : path,
                async : false,
                dataType : 'text'
            }).then(function(contents) {
                app.Templates[path] = _.template(contents);
            });
            return app.Templates[path];
        }
    });

    window.App = app;
    return app;
});
