/*global define */
define([
    'underscore',
    'backbone',
], function (_, Backbone) {
    'use strict';

    var $html;

    function getRandomInt (min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function clearElementsForClasses (classes) {
        var i, l, v;
        for (i = 0, l = classes.length; i < l; i ++) {
            v = classes[i];
            $('.compare-table').find('.'+v).removeAttr('style');
        }
    }

    function showElementsForClasses (classes) {
        var i, l, v;
        for (i = 0, l = classes.length; i < l; i ++) {
            v = classes[i];
            $('.compare-table').find('.'+v).show();
        }
    }

    var bgs = [
        'cb-back',
        'sm-back',
        'pf-back',
        'cs-back'
    ];
    var _facilities = [
        'wifi',
        'parking',
        'airport-shuttle',
        'fitness-center',
        'spa'
    ];

    var _themes = [
        'business',
        'romance',
        'family',
        'budget'
    ];

    var tmp = bgs[getRandomInt(0,3)];
    $('body').addClass(tmp);

    var DropdownController = {
        _class: '.trips.dropdown .element',
        _handleClick: function (e) {
            var that = e.data.that,
            $this = $(e.target);
            if($this.closest('.element').length === 0){
                that.hide();
            }
        },
        _set: function (value, dataset) {
            var val = value.split('<')[0];
            var res = this.$el.find('.top .value'),
            data = res.data();
            data.display = val;
            data.value = dataset.value;

            res.html(val).trigger('change');
            this.$el.find('input.input').val(val);
            this.trigger('set',data);
        },
        _bindOptions: function () {
            var that = this;
            this.$el.on('keyup','input.input', function (){
                var hint = $(this).closest('.element').find('.hint')[0];
                if (this.value !== '') {
                    hint.className = "hint value";
                    hint.innerHTML = this.value;
                } else {
                    hint.className = "empty hint value";
                    hint.innerHTML = 'eg. City Name, Hotel Name, Region Name, etc.';
                }
            });
            this.$el.on('click','.action', function (e) {
                var val;
                // @NOTE assignment
                if ( ( val = $(e.currentTarget).find('.value')[0] ) ) {
                    that._set(val.innerHTML, val.dataset['id']);
                } else {
                    that._set(e.currentTarget.innerHTML, e.currentTarget.dataset);
                }
                that.hide();
                e.stopPropagation();
            });
        },
        handle: function () {
            var that = this;
            $html = $('html');
            $html.on('click', this._class, function () {
                var temp;
                that.hide();
                if (that.el !== this) {
                    that.show(this);
                    // @NOTE assignment
                    if ( ( temp = $(this).find('input') ) ) {
                        temp.focus();
                    }
                }
            });
        },
        show: function (el) {
            this.el = el;
            this.$el = $(el);
            this.$el.addClass('active');
            this._bindOptions();
            $html.off('click', this._handleClick).on('click',{that: this}, this._handleClick);
        },
        hide: function () {
            if (this.$el) {
                this.$el.removeClass('active');
                this.$el.off();
                this.$el = null;
                this.el = null;
                $html.off('click', this._handleClick);
            }
        }
    };

    _.extend(DropdownController,Backbone.Events);

    window.DropdownController = DropdownController;

    var bookDetails = $('.book.details.floating');

    if (bookDetails.length) {

        var $compareTable = $('.compare-table');

        $('.compare-table .headers.column').on('click','.checkbox', function() {
            var $this = $(this),
            name = $this[0].className.split(" ")[0];

            _selectedClasses[name] = $this.hasClass('checked');

            $this.toggleClass('hidden').toggleClass('checked');
            $('.compare-table .info.column').find('.'+name+' .checkbox').parent().toggleClass('hidden');
        });

        $compareTable.on('mouseenter', '.info.column.fixed .header', function(){
            var $this = $(this),
            $el = $this.closest('.info.column');

            //@NOTE assignment
            if($el.parent().hasClass('pinned-container')){
                $el = $el.position().left + $el.parent().position().left;
            } else {
                $el = $this.parent().position().left;
            }

            bookDetails.removeClass('hidden');

            bookDetails.css({
                left: $el - 16
            });

            bookDetails.off().on('mouseleave', function() {
                bookDetails.addClass('hidden');
                bookDetails.removeAttr('style');
            });
        });

        $compareTable.on('click', '.headers.column .see-all button', function(){
            var $this = $(this),
            classes = $this.hasClass('facilities') ? _facilities : _themes;

            if ($this.hasClass('active')) {
                $this.removeClass('active');
                clearElementsForClasses(classes);
                this.innerHTML = "&gt; see all themes";
            } else {
                $this.addClass('active');
                showElementsForClasses(classes);
                this.innerHTML = "&gt; only selected";
            }
        });

        $compareTable.on('click', '.info.column.fixed .pin', function(){
            var $this = $(this),
            column = $this.closest('.column'),
            pinned = $('.pinned-container');

            if ( column.hasClass('pinned') ) {
                $('.compare-table').append(column);
            } else {
                $('.pinned-container').append(column);
            }

            if ( pinned.children().length === 0 ) {
                pinned.addClass('hidden');
            } else {
                pinned.removeClass('hidden');
            }

            column.toggleClass('pinned');
        });
    }

    if($('body').hasClass('single')){
        $('button.view-all').on('click', function () {
            var $this = $(this);

            if( $this.hasClass('active') ){
                $this.removeClass('active');
                $this[0].innerHTML = '2  more &gt;';
            } else{
                $this[0].innerHTML = '&lt; hide  2';
                $this.addClass('active');
            }

            $this.parent().find('.extra').toggleClass('hidden');
        });
    }
});
