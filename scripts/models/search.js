/*global define*/

define([
    'underscore',
    'backbone',
    'collections/results',
    'models/result',
    'models/api-call',
], function (_, Backbone, Results, Result, ApiCall) {
    'use strict';
    var today = new Date();

    var SearchModel = Backbone.Model.extend({
        defaults: {
            checkIn: today,
            checkOut: new Date(today.getTime() + (24 * 60 * 60 * 1000)),
            adults: 2,
            children: 0,
            rooms: 1
        },
        initialize: function () {
            this.results = new Results();
            this.pinnedResults = {};
        },
        formatDate: function (date) {
            return ( date.getMonth() ) + 1 + '/' + date.getDate() + '/' + date.getFullYear();
        },
        url: 'http://dev.enode.ro/api/hotels?',
        fetch: function () {
            var attr = this.attributes;
            // http://dev.enode.ro/api/hotels?destinationId=003B6BAD-728C-4067-AB5A-B93C0EE6D0EA&from=12%2F20%2F2013&to=12%2F23%2F2013&room1=1,8,2,3
            var url = this.url;
            url += 'destinationId='+attr.destinationId;
            url += '&from='+this.formatDate(attr.checkIn);
            url += '&to='+this.formatDate(attr.checkOut);
            url += '&room'+attr.rooms;
            url += '='+attr.adults;
            return new ApiCall(url).status.done(this._parse.bind(this));
        },
        _parse: function (data) {
            var results, hotels;
            result = data.HotelListResponse;
            hotels = result.HotelList.HotelSummary;
            for (var i = 0, l = hotels.length; i < l; i ++) {
                this.results.add(hotels[i]);
            }
        }
    },{
        options: {
            'wifi': 'wifi-option',
            'parking': 'parking-option',
            'airport-shuttle': 'airport-shuttle-option',
            'fitness-center': 'fitness-center-option',
            'spa': 'spa-option',
            'family': 'family-option',
            'business': 'business-option',
            'romance': 'romance-option',
            'budget': 'budget-option',
            'tripadvisor': 'check-tripadvisor',
            'distance': 'check-distance',
            'price': 'check-price',
            'stars': 'check-stars'
        }
    });

    return SearchModel;
});
