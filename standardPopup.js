/*created by - Shivam Gupta 09/12/2016*/
$(document).keydown(function(e) {
	$btnCancel.trigger('click');
});
var ErrorPopup = function(config){
	var title = config.title || 'Error',
		imgClassName = 'errorPopupIcon';
		
		generatePopup(title , imgClassName , config);
}
var InfoPopup = function(config){
	var title = config.title || 'Info',
		imgClassName = 'warningPopupIcon';
		
		generatePopup(title , imgClassName , config);
}
var ConfirmPopup = function(config){
	var title = config.title || 'Confirm',
		imgClassName = 'confirmPopupIcon';
		
		generatePopup(title , imgClassName , config);
}
function generatePopup(title, imgClassName, config){
	
	var	popupId = config.popupId || "popupId-"+getRandomInt(1 , 10000) ,
		msg = config.msg,
		modalOnClose = config.modalOnClose || '',
		modalOnOpen = config.modalOnOpen || '',
		popupOnOk = config.popupOnOk || '',
		popupOnCancel = config.popupOnCancel || '',
		OK = (config.OK == true),
		CANCEL = (config.CANCEL == true),
		OKVal = null, CANCELVal = null,
		dataTemplate;
		
		var init = function(){
			generateTemplate();
			cacheDom();
			bindEvents();
			render();
		};
		var cacheDom = function(){
			
			$footer = $dataTemplate.find('.popup-footer-btn');
			if(OK){
				OKVal = config.OKVal || 'OK';
				$btnOk = $('<input type="button" value="'+OKVal+'"/>');
			}
			if(CANCEL){
				CANCELVal = config.CANCELVal || 'CANCEL';	
				$btnCancel = $('<input type="button" value="'+CANCELVal+'"/>');
			}
		};
		var generateTemplate = function(){
			$dataTemplate = $(' <div class="flex-container-popup"> \
									<div class="flex-item-popup-icon"><span class="'+imgClassName+'"></span></div> \
									<div class="flex-item-popup-text"><span>'+msg+'</span></div> \
									<div class="popup-footer-btn"></div> \
								</div>');
		};
		
		var bindEvents = function(){
			$btnOk.on('click', handlePopupOnOk);
			$btnCancel.on('click', handlePopupOnCancel);
		};
			
		var render = function(){
			if(OK) $footer.append($btnOk);
			if(CANCEL) $footer.append($btnCancel);

			
			var newPopup = ModalPopup({
				width : 600,
				height : 178,
				title : title,
				popupId : popupId,
				dataTemplate : $dataTemplate,
				modalOnClose : modalOnClose,
				modalOnOpen : modalOnOpen,
				onConfig : true,
				resizable : false 
			}).show();
			$close = $('#'+popupId).find(".modal-close-btn");

			if(imgClassName == 'confirmPopupIcon')
				$close.hide();
		}


		function handlePopupOnOk(e){
			popupOnOk();
			destroy();
			$close.trigger('click');
			
			
		}
		function handlePopupOnCancel(e){
			popupOnCancel();
			destroy();
			$close.trigger('click');
			
		}
		function getRandomInt(min, max) {
		  min = Math.ceil(min);
		  max = Math.floor(max);
		  return Math.floor(Math.random() * (max - min)) + min;
		}
		function destroy(){
			$btnOk.off();
			$btnCancel.off();
		}
		init();
}