/*global define*/

define([
    'jquery',
    'underscore',
    'backbone',
    'layoutmanager',
    'views/result'
], function ($, _, Backbone, Layout, ResultView) {
    'use strict';

    var PIN = 1,
        UNPIN = -1;

    var ResultsView = Backbone.View.extend({
        manage: true,
        className: 'compare-table',
        template: 'results',
        page: 0,
        initialize: function (options) {
            this.counts = options.counts;
        },
        _insertViews: function (collection, where, forceRender) {
            var i, l = collection.length, v, view;

            for (i = 0; i < l; i ++) {
                v = collection[i];
                view = new ResultView({
                    model: v
                });

                if (where) {
                    this.insertView(where, view);
                } else {
                    this.insertView(view);
                }

                if (forceRender) {
                    view.render();
                }

                this.listenTo(view, 'result:pin', this._handlePin);
                this.listenTo(view, 'result:unpin', this._handleUnpin);
            }
        },
        _addPinnedResults: function () {
            this._insertViews(this.model.pinnedResults, '.pinned-container');
        },
        _addPagedUnpinnedResults: function (forceRender) {
            var arr = this.model.getUnpinned(
                    this.counts.countUnpinnedPerPage,
                    this.counts.page);

            this._insertViews(arr,undefined,forceRender);
        },
        beforeRender: function () {
            this._addPinnedResults();
            this._addPagedUnpinnedResults();
        },
        afterRender: function () {
            this._cachedDOMPinned = this.$el.find('.pinned-container');
            if (this.counts.countPinned) {
                this._cachedDOMPinned.removeClass('hidden');
            }
        },
        connectPaginationView: function (paginationView) {
            this.listenTo(paginationView, 'change', this._handlePaginationChange);
            paginationView.listenTo(this, 'result:pin', paginationView._handlePinnedAction);
        },
        _handlePaginationChange: function (newPage) {
            var views = this.getViews();
            var i = 1;
            while(i <= this.counts.countUnpinnedPerPage){
                views._wrapped[6 - i].remove();
                i++;
            }
            this._addPagedUnpinnedResults(true);
            if( window.scrollY > 373 ) {
                window.scrollTo(0,373);
            }
        },
        _handlePin: function (view) {
            var element = view.$el;
            var hotel = view.model;

            element.removeClass('unpinned');
            element.addClass('pinned');
            element.remove();
            this._cachedDOMPinned.append(element);

            this.model.pin(view.model);

            view.delegateEvents();

            if (this.counts.countPinned === 0) {
                this._cachedDOMPinned.removeClass('hidden');
            }

            this._updateCountsFor(PIN);

            this.trigger('result:pin');
        },
        _updateCountsFor: function (action) {
            this.counts.countPinned += action;
            this.counts.countUnpinnedPerPage -= action;
            this.counts.countPages = Math.ceil( ( this.counts.results - this.counts.countPinned ) / ( 6 - this.counts.countPinned ) );
        },
        _handleUnpin: function (view) {
            var element = view.$el;

            element.remove();
            element.removeClass('pinned');
            element.addClass('unpinned');
            this.$el.append(element);

            view.delegateEvents();

            var hotel = view.model;
            this.model.unpin(hotel);
            this.model.results.remove(hotel);

            var pos = this.countResultsPerPage * this.page + this.countUnpinnedPerPage;
            this.model.results.add(hotel, {at: pos});

            this._updateCountsFor(UNPIN);

            if (this.counts.countPinned === 0) {
                this._cachedDOMPinned.addClass('hidden');
            }
            this.trigger('result:pin');
        }
    });

    return ResultsView;
});
