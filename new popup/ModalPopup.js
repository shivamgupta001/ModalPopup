$(document).keyup(function(e) {
    var itemId = '';
    var popups = $('.tf-modal-outer');
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
            document.getElementById(itemId).querySelector('.tf-modal-close-btn').click();
        }
    }
});

ModalPopup = function(config) {

    var modalpopup = {

        scope: config,
        _init: function() {

            this._initialize();

            if (this._validateInitialize()) {

                this._generateTemplate();
                this._cacheDom();
                this._applyProperty();
                this._bindEvents();
                this._attachProperties();
                this._render();
                this._handleKeyUp();

                return Object.freeze(this.outerComp);
            } else {
                return false;
            }
        },
        _initialize: function() {

            var me = this.scope;

                 //config
                this.dynamicId = me.popupId || "tf-modal-" + getRandomInt(1, 10000),
                this.onConfig = (me.onConfig == null || me.onConfig == false) ? false : true,
                this.resizable = (me.resizable == false) ? false : true,
                this.footerVisible = (me.footerVisible == false) ? false : true,

                // style
                this.width = me.width || 800,
                this.height = me.height || 600,

                // header text
                this.title = me.title || '',

                // callback
                this.modalCloseCallback = me.modalOnClose || '',
                this.modalOpenCallback = me.modalOnOpen || '',

                // user Template
                this.dataTemplate = me.dataTemplate || null
                

        },
        _validateInitialize: function() {
            if (document.getElementById(this.dynamicId)) {
                console.log('Duplicate Id ' + this.dynamicId);
                return false;
            }
            return true;
        },
        _generateTemplate: function() {

            var el = [
                '<div id="'+this.dynamicId+'" class="tf-modal-outer">',
                    '<section class="tf-modal-inner">',
                        // header    
                        '<header class="tf-modal-header">',
                            '<span class="tf-modal-title">' + this.title + '</span>',
                            '<a  class= "tf-modal-close-btn"></a>',
                        '</header>',
                        //body
                        '<section class="tf-modal-body"></section>',
                        //footer
                        '<footer class="tf-modal-footer ' + (this.footerVisible ? '' : 'tf-display--none' ) + '"></footer>',
                    '</section>',
                '</div>'
            ].join('\n');

            this.childTemplate = $(el)[0];
        },
        _cacheDom: function() {
            
            // cache Dom
            this.outerComp = this.childTemplate;
            this.modalCloseNode = this.childTemplate.querySelector('.tf-modal-close-btn');
            this.modalBody = this.childTemplate.querySelector('.tf-modal-body');

        },
        _applyProperty : function(){

            // data-zindex makes sure hierarchical modal popup closes in order of opening
            var currentPopupCount = document.getElementsByClassName('.tf-modal-outer').length;
            this.outerComp.setAttribute('data-zindex', (1000 + currentPopupCount));

            // add data template if provided
            if(this.dataTemplate){
                this.modalBody.appendChild(this.dataTemplate);  
            }else{
                var tpl = document.querySelector('template[data-template-id="'+this.dynamicId+'"]')
                if(tpl){
                    var clone = document.importNode(tpl.content, true);
                    this.modalBody.appendChild(clone);    
                }
                
            } 
        },
        _bindEvents: function() {

            var me = this.scope;
            this._handleModalCloseBtnClick = this._handleModalCloseBtnClick.bind(this);
            this.modalCloseNode.addEventListener('click', this._handleModalCloseBtnClick);
        },
        _attachProperties : function(){

            var me = this.scope;

            // add Properties 
            me.outerComp = this.outerComp;

            // add Methods
            me.outerComp.show = this.show.bind(this);
            me.outerComp.close = this.close.bind(this);

        },
        _render: function() {

            if(!this.onConfig) {
                
                document.body.appendChild(this.outerComp);
                this._handleModalOpenCallback();
            }
        },
        _handleModalOpenCallback: function() {
            
            var me = this.scope;

            if(this.modalOpenCallback != '') this.modalOpenCallback.call(me);
        },
        _handleModalCloseBtnClick: function(e) {
            
            var me = this.scope;

            if (this.modalCloseCallback != '')  this.modalCloseCallback.call(me);
            this._destroy();
        },
        _handleKeyUp: function(e) {


        },
        show: function() {
            
            if(!document.getElementById(this.dynamicId)){

                var me = this.scope;

                document.body.appendChild(this.outerComp);
                this._handleModalOpenCallback.call(this);
            }
        },
        close: function() {
            
            if(document.getElementById(this.dynamicId)) {
                this.modalCloseNode.click();
            }
        },
        _destroy: function() {

            var oldChild = document.body.removeChild(document.getElementById(this.dynamicId));
            oldChild.removeEventListener('click', this._handleModalCloseBtnClick);
        }
    };

    function getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min) + min);
    }
    return modalpopup._init();

}
