/*global define*/
define([
    'underscore',
    'backbone',
    'layoutmanager',
    'models/api-call'
], function (_, Backbone, Layout, ApiCall) {
    'use strict';

    var ResultModel = Backbone.Model.extend({
        _baseURL: "http://dev.enode.ro/api/hotel-detail?hotelId=",
        _parseHelper: $('<textarea/>'),
        manage: true,
        template: 'results',
        initialize: function () {
            this.pinned = false;
            this.loaded = false;
        },
        _extractImage: function (image) {
            return {
                thumbnailUrl: image.thumbnailUrl,
                url: image.url
            };
        },
        _extractRoom: function (room) {
            return {
                name: room.description,
                description: room.descriptionLong
            };
        },
        _extractFacilities: function (facility) {
            return facility.amenity;
        },
        _parse: function (data) {
            var res = data.HotelInformationResponse;
            var desc = this._parseHelper.html(res.HotelDetails.propertyDescription).text().replace(/<br \/>/g,'');
            console.log(desc);

            this.attributes.description = desc;

            this.attributes.city = res.HotelSummary.city;
            this.attributes.address = res.HotelSummary.address1;

            this.attributes.images = _.map(res.HotelImages.HotelImage, this._extractImage);
            this.attributes.rooms = _.map(res.RoomTypes.RoomType, this._extractRoom);

            if (res.PropertyAmenities) {
                this.attributes.facilities = _.map(res.PropertyAmenities.PropertyAmenity, this._extractFacilities);
            }

        },
        fetch: function () {
            var url = this._baseURL + this.attributes.id;
            if (!this.loaded) {
                this.loaded = true;
            }
            return new ApiCall(url).status.done(this._parse.bind(this));
        }
    });

    return ResultModel;
});
