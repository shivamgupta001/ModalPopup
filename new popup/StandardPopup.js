/*created by - Shivam Gupta 09/12/2016*/

 
ErrorPopup = function(config) {
    var title = config.title || 'Error',
        imgClassName = 'errorPopupIcon';

    generatePopup(title, imgClassName, config);
};
InfoPopup = function(config) {
    var title = config.title || 'Info',
        imgClassName = 'warningPopupIcon';

    generatePopup(title, imgClassName, config);
}
ConfirmPopup = function(config) {
    var title = config.title || 'Confirm',
        imgClassName = 'confirmPopupIcon';

    generatePopup(title, imgClassName, config);
}
SuccessPopup = function(config) {
    var title = config.title || 'Success',
        imgClassName = 'successPopupIcon';

    generatePopup(title, imgClassName, config);
}

function generatePopup(title, imgClassName, config) {

    var popupId = config.popupId || "popupId-" + getRandomInt(1, 10000),
        msg = config.msg,
        modalOnClose = config.modalOnClose || '',
        modalOnOpen = config.modalOnOpen || '',
        popupOnOk = config.popupOnOk || '',
        popupOnCancel = config.popupOnCancel || '',
        OK = (config.OK == false) ? false : true,
        CANCEL = (config.CANCEL == false) ? false : true,
        OKVal = null,
        CANCELVal = null,
        dataTemplate, cacheVar = {};

    var init = function() {
        generateTemplate();
        cacheDom();
        bindEvents();
        render();
    };
    var cacheDom = function() {

        cacheVar.$footer = cacheVar.$dataTemplate.find('.popup-footer-btn');
        if (OK) {
            OKVal = config.OKVal || 'OK';
            cacheVar.$btnOk = $('<input type="button" value="' + OKVal + '" ModalPopupOKBtn="true" autofocus/>');
        }
        if (CANCEL) {
            CANCELVal = config.CANCELVal || 'CANCEL';
            cacheVar.$btnCancel = $('<input type="button" value="' + CANCELVal + '" ModalPopupCancelBtn="true"/>');
        }
    };
    var generateTemplate = function() {
        cacheVar.$dataTemplate = $(' <div class="modal-popup"> \
                    <div class="modal-popup-icon"><span class="' + imgClassName + '"></span></div> \
                    <div class="modal-popup-text"><span>' + msg + '</span></div> \
                </div>');
    };

    var bindEvents = function() {
        if (OK) {
            cacheVar.$btnOk.on({
                'click': handlePopupOnOk,
                'blur': handleOkBlur
            });
        }
        if (CANCEL) {
            cacheVar.$btnCancel.on({
                'click': handlePopupOnCancel,
                'blur': handleCancelBlur
            });
        }
    };

    var render = function() {
        if (OK) cacheVar.$footer.append(cacheVar.$btnOk);
        if (CANCEL) cacheVar.$footer.append(cacheVar.$btnCancel);


        var newPopup = ModalPopup({
            width: 600,
            height: 178,
            title: title,
            popupId: popupId,
            dataTemplate: cacheVar.$dataTemplate,
            modalOnClose: modalOnClose,
            modalOnOpen: modalOnOpen,
            onConfig: true,
            resizable: false,
            footerVisible : false
        }).show();
        cacheVar.$close = $('#' + popupId).find(".modal-close-btn");

        if (imgClassName == 'confirmPopupIcon') cacheVar.$close.hide();
        if (OK && CANCEL) handleCancelBlur();
    }

    function handleOkBlur() {
        if (OK && CANCEL) {
            // For IE
            cacheVar.$btnCancel.focus();
            //For Chrome & Moz
            cacheVar.$btnCancel.attr('tabindex', 10000);
            cacheVar.$btnOk.attr('tabindex', 10001);
        }
    }

    function handleCancelBlur() {
        if (OK && CANCEL) {
            //For IE
            cacheVar.$btnOk.focus();
            //For Chrome & Moz
            cacheVar.$btnCancel.attr('tabindex', 10001);
            cacheVar.$btnOk.attr('tabindex', 10000);
        }
    }

    function handlePopupOnOk(e) {
        if (popupOnOk != '')
            popupOnOk();
        destroy();
        cacheVar.$close.trigger('click');
    }

    function handlePopupOnCancel(e) {
        if (popupOnCancel != '')
            popupOnCancel();
        destroy();
        cacheVar.$close.trigger('click');

    }

    function getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min)) + min;
    }

    function destroy() {
        if (OK) cacheVar.$btnOk.off();
        if (CANCEL) cacheVar.$btnCancel.off();
    }
    init();
}
