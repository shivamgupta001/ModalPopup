// created by - shivam gupta 8/24/2016	
		$(document).keyup(function(e) {
			var itemId= '';
			var popups = $('.openModal-outer');
			if(popups.length > 0){
				// retrieving id and data-zindex for all pop ups 
				var data = popups.map(function(index , value){
					var id = $(value).attr("id");
					var zindex = $(value).attr("data-zindex");
					var obj = {};
					obj[zindex] = id;
					return obj;
				});
				
				// sorting in descending order
				data.sort(function(a,b){
					var aVal = +Object.keys(a)[0];
					var bVal = +Object.keys(b)[0];
					return  bVal - aVal;
				});
				for (var key in data[0]) {
				  if (data[0].hasOwnProperty(key)) {
					 itemId = data[0][key];
				  }
				} 
				
				if (e.keyCode == 27) {
					$('#'+itemId).find(".modal-close-btn").trigger('click');
				}
			}
		});
		var ModalPopup = function (config) {
			var obj = {},
				width = config.width || 800,
				height = config.height || 600,
				title = config.title || '',
				itemId = config.popupId || '',
				modalCloseCallback = config.modalOnClose || '',
				modalOpenCallback = config.modalOnOpen || '',
				$userTemplate = config.dataTemplate || '',
				onConfig = (config.onConfig == false) ? false : true,
				resizable = (config.resizable == false) ? false : true,
				template, modalInner, modalCloseNode;
			
			
			obj.show = function () {

				// appending content to body
				if ($('#' + itemId).length == 0) {
					$('body').append($template);
					if (modalOpenCallback != '') {
						modalOpenCallback($userTemplate);
					}
					return true;
				}
				return false;
			}

			obj.close = function () {
				var modalPopup = $("#" + itemId);
				if (modalPopup.length > 0) {
					$(modalPopup).find(".modal-close-btn").trigger('click');
					return true;
				}
				return false;
			}
			
			var destroy = function(){
				var modalPopup = $("#" + itemId);
				if (modalPopup.length > 0) {
					$(modalPopup).off();
					$(modalPopup).remove();
				} 
				
			}

			if (itemId == '') {
				console.log('%c"popupId" is mandatory field', 'color:red');
				return;
			} else {
				if ($('#'+itemId).length == 0) {
					if ($userTemplate == '') {
						$userTemplate = $('div[data-template-id="' + itemId + '"]').children().clone();
					}
					var init = function(){
						generateTemplate();
						cacheDom();
						bindEvents();
						render();
					}
					var generateTemplate = function(){
						$template = $('<div id="' + itemId + '" class="openModal-outer"> \
										<div class="openModal-inner"> \
											<div class="modalPopupHeader"> \
												<span class="modalPopupTitle">'+ title + '</span> \
												<a  class= "modal-close-btn"></a> \
											</div> \
											<div> \
												<div class="modal-data-div"></div> \
											</div> \
										</div> \
									</div>');
					};
					
					var cacheDom = function(){
						$modalInner = $template.find('.openModal-inner');	
						$modalCloseNode = $modalInner.find(".modal-close-btn");
					}
					var bindEvents = function(){
						if (modalCloseCallback != '') {
							$modalCloseNode.on('modalClose', modalCloseCallback);
						}
						if (modalOpenCallback != '') {
							$template.on('modalOpen', modalOpenCallback);
						}
						$modalCloseNode.on('click', handleModalClose);	
					}

					var render = function(){
						$modalInner.css("min-width", width);
						$modalInner.css("min-height", height);
						$modalInner.find('.modalPopupHeader').css("min-width", width);
						if(resizable)
							$modalInner.css("resize", "both");
						$modalInner.find('.modal-data-div').append($userTemplate);

						// differentiate between different popups for ESC key press
						$template.attr("data-zindex", 1000 + $(".openModal-outer").length);	
						
					}
					

					var handleModalClose = function(e){
						
						if (modalCloseCallback != '') {
							$(this).trigger('modalClose');
						}
						destroy();
					}
					init();	
					if (onConfig) {
						obj.show();
					}
					return obj;
				} else {
					console.log("%c'popupId' Already exist", "color:red");
					return;
				}
			}


		}