$(document).keyup(function(e) {
    var itemId = '';
    var popups = $('.modal-outer');
    if (popups.length > 0) {
        // retrieving id and data-zindex for all pop ups 
        var data = popups.map(function(index, value) {
            var id = $(value).attr("id");
            var zindex = $(value).attr("data-zindex");
            var obj = {};
            obj[zindex] = id;
            return obj;
        });

        // sorting in descending order
        data.sort(function(a, b) {
            var aVal = +Object.keys(a)[0];
            var bVal = +Object.keys(b)[0];
            return bVal - aVal;
        });
        for (var key in data[0]) {
            if (data[0].hasOwnProperty(key)) {
                itemId = data[0][key];
            }
        }
        if (e.keyCode == 27) {
            document.getElementById(itemId).querySelector('.modal-close-btn').click();
        }
    }
});

ModalPopup = function(config) {
    var modalPopup = {
        scope: config,
        _init: function() {

            this._initialize();
            if (this._validateInitialize()) {
                this._generateTemplate();
                this._bind();
                this._render();
                this._handleKeyUp();
                return Object.freeze({
                    show: this.show.bind(this),
                    close: this.close.bind(this),
                    _id: this.itemId
                });
            } else {
                return false;
            }
        },
        _initialize: function() {
            var me = this.scope;

            //caching variables

            this.width = me.width || 800,
            this.height = me.height || 600,
            this.title = me.title || '',
            this.itemId = me.popupId || "modal-Id-" + getRandomInt(1, 10000),
            this.modalCloseCallback = me.modalOnClose || '',
            this.modalOpenCallback = me.modalOnOpen || '',
            this.$userTemplate = me.dataTemplate || null,
            this.onConfig = (me.onConfig == false) ? false : true,
            this.resizable = (me.resizable == false) ? false : true,
            this.footerVisible =  (me.footerVisible == false) ? false : true,
            this.$template = '',
            this.modalBody = '',
            this.modalCloseNode = '';

        },
        _validateInitialize: function() {
            if (document.body.querySelector('#' + this.itemId)) {
                console.log('Duplicate Id ' + this.itemId);
                return false;
            }
            return true;
        },
        _generateTemplate: function() {

            this.$template = $('<div id="' + this.itemId + '" class="modal-outer"> \
                <section class="modal-inner"> \
                    <header class="modal-header"> \
                        <span class="modal-title">' + this.title + '</span>  \
                        <a  class= "modal-close-btn"></a> \
                    </header> \
                    <section class="modal-body"></section> \
                    "'+(this.footerVisible ?  '<footer class="modal-footer"></footer>':'')+'" \
                    </section> \
            </div>');


            this.modalCloseNode = this.$template[0].querySelector('.modal-close-btn');
            this.modalBody = this.$template[0].querySelector('.modal-body');
            this.$template.attr("data-zindex", 1000 + $(".modal-outer").length);
            if(this.$userTemplate)
                $(this.modalBody).append(this.$userTemplate);
        },
        _bind: function() {
            this.modalCloseNode.addEventListener('click', this._handleModalCloseBtnClick.bind(this));
        },
        _render: function() {
            if (!this.onConfig) {
                $('body').append(this.$template);
                this._handleModalOpenCallback();
            }
        },
        _handleModalOpenCallback: function() {
            if (this.modalOpenCallback != '')
                this.modalOpenCallback();
        },
        _handleModalCloseBtnClick: function(e) {
            if (this.modalCloseCallback != '')
                this.modalCloseCallback();
            this._destroy();
        },
        _handleKeyUp: function(e) {

        },
        show: function() {
            if ($('#' + this.itemId).length <= 0) {
                $('body').append(this.$template);
                this._handleModalOpenCallback();
            }
        },
        close: function() {
            if (document.getElementById(this.itemId)) {
                this.modalCloseNode.click();
            }
        },
        _destroy: function() {

            $(this.$template).off();
            $(this.$template).remove();

        }
    };

    function getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min) + min);
    }
    return modalPopup._init();

}
