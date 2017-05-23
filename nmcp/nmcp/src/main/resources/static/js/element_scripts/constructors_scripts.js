"use strict"

// http://bootstrap-3.ru/components.php - много поддерживаемых bootstrap'ом символов (Glyphicons)

/** 
 * Конструирование блока для ввода текста, на основе формы: 
 *   http://bootsnipp.com/snippets/featured/input-validation-colorful-input-groups
 *
 * Ширина поля ввода зависит от родительского элемента, поэтому лучше использовать 
 *    для них подобные классы: class="col-sm-offset-4 col-sm-4"
 *
 * blockId  	 - html-id блока (без #)
 * label    	 - отображаемое название поля ввода
 * data.parentId - id (#) или class (.) блока, в который будет вставлено данное поле
 * data.value    - начальное значение
 * data.valHint  - подсказка, отображаемая в поле ввода
 * data.hint     - отображаемое поле с подсказкой
 * data.regExpF  - предикат, проверяющий корректность данных
 * data.keyLsn   - функция-обработчик любого нажатия
 * data.listener - функция-обработчик подтверждения ввода
 * data.imType   - тип валидации:
 *						- required - строгая валидация введенного текста
 *						- optional - поле не обязательно должно быть заполнено (с изображением)
 *                  	- none     - optional без изображения
 * data.inpType  - тип поля ввода:
 *						- usual
 *						- email
 *						- phone
 * 						- text
 * 						- password
 *						- date
 *                      - file
 * data.checkF   - предикат, показывающий, что произошло изменение поля (для полей требующих это)
 * data.margin   - отступ от предыдущего элемента
 * data.attrs    - дополнительные атрибуты для поля ввода (пример: "disabled", "readonly")
 */
function createInputTextBlock1(blockId, label, data) {

	var nameValidate, inputType;
	switch (data.inpType) {
		case 'usual':
			nameValidate = "text";
			break;
		case 'text':
			nameValidate = "length";
			break;
		default:
			nameValidate = data.inpType;
	}

	switch (data.inpType) {
		case 'date':
			inputType = '"date"';
			break;
		case 'password':
			inputType = '"password"';
			break;
		case 'file':
			inputType = '"file" multiple';
			break;
		default:
			inputType = '"text"';
	}

	data.attrs = data.attrs || "";

	var inputParams = (data.inpType == 'text' ? '<textarea' : '<input') + ' type=' + inputType + 
				      ' class="form-control" name="' + nameValidate +
				      '" id="' + blockId + '-validate-' + nameValidate + '" ' + 
				      (data.valHint !== undefined ? ('placeholder="' + data.valHint + '" ') : '') + 
				      (data.value !== undefined ? ('value="' + data.value + '" ') : '') + ' ' + data.attrs + ' ' + 
				      (data.imType == "required" ? "required>" : ">") + 
				      (data.inpType == 'text' ? '</textarea>' : '');

	var spanParams;
	if (data.imType == "none") {
		spanParams = "";
	} else {
		spanParams = '<span class="input-group-addon ' + 
		             ((data.imType == "required" || data.checkF) ? "danger" : "info") + 
		             '"><span class="glyphicon glyphicon-' + 
		             ((data.imType == "required" || data.checkF) ? "remove" : "asterisk") + 
		             '"></span></span>';
	}

    data.hint = data.hint || "";

	$(((data.parentId[0] == '.' || data.parentId[0] == '#') ? '' : '#') + data.parentId)
		.append(
			'<div class="form-group" id="' + blockId + ((data.margin!==undefined) ? ('" style="margin-top: ' + data.margin +'px;">') : '">') +
        		'<label>' + label + '</label>' +
				'<div class="input-group" ' + ((data.imType=="none") ? 'style="width: 100%;">' : '>') + 
					inputParams + spanParams +
				'</div><div class="form-group-hint" ' + 'id="' + blockId + '-hint">' + data.hint + '</div></div>'
		);

	$(document).ready(function() {
		$("#" + blockId + " .input-group input, #" + blockId + " .input-group textarea").on('keyup change', function() {

			if (data.checkF) {

				var $group = $(this).closest('.input-group'),
					$addon = $group.find('.input-group-addon'),
					$icon = $addon.find('span'),
					state = false,
					change = data.checkF($(this).val());

				if (data.regExpF !== undefined) {
					state = data.regExpF($(this).val());
				} else {
					state = $(this).val() ? true : false;
				}

				if (state) {
					if (change) {
						$addon.removeClass('danger');
						$addon.removeClass('success');
						$addon.removeClass('info');
						$addon.addClass('changed');
						$icon.attr('class', 'glyphicon glyphicon-edit');
					} else {
						$addon.removeClass('danger');
						$addon.removeClass('changed');
						$addon.removeClass('info');
						$addon.addClass('success');
						$icon.attr('class', 'glyphicon glyphicon-check');
					}
				} else {
					if (data.imType != 'optional'){
						$addon.removeClass('success');
						$addon.removeClass('changed');
						$addon.removeClass('info');
						$addon.addClass('danger');
						$icon.attr('class', 'glyphicon glyphicon-remove');
					} else {
						$addon.removeClass('success');
						$addon.removeClass('changed');
						$addon.removeClass('danger');
						$addon.addClass('info');
						$icon.attr('class', 'glyphicon glyphicon-asterisk');
					}
				}

			} else if (data.imType == "required") {

				var $group = $(this).closest('.input-group'),
					$addon = $group.find('.input-group-addon'),
					$icon = $addon.find('span'),
					state = false;
			
				if (data.regExpF !== undefined) {
					state = data.regExpF($(this).val());
				} else {
					state = $(this).val() ? true : false;
				}
			
				if (state) {

					$addon.removeClass('danger');
					$addon.addClass('success');
					$icon.attr('class', 'glyphicon glyphicon-ok');
				} else {
					$addon.removeClass('success');
					$addon.addClass('danger');
					$icon.attr('class', 'glyphicon glyphicon-remove');
				}
			}

			if (data.keyLsn !== undefined) {
				data.keyLsn(this);
			}
		});

		$("#" + blockId + " .input-group input, #" + blockId + " .input-group textarea").trigger('change');

		$("#" + blockId).mouseenter(function() {$("#" + blockId + "-hint").css('opacity', '0.6')});

		$("#" + blockId).mouseleave(function() {$("#" + blockId + "-hint").css('opacity', '0')});

		$("#" + blockId + " .input-group input").keyup(function(event) {
			if(data.listener!==undefined && event.keyCode==13)
				data.listener(this);
		});


	});
}




/** 
 * Конструирование select-блока, на основе формы: 
 *   http://bootsnipp.com/snippets/featured/input-validation-colorful-input-groups
 *
 * Ширина поля ввода зависит от родительского элемента, поэтому лучше использовать 
 *    для них подобные классы: class="col-sm-offset-4 col-sm-4"
 *
 * blockId  	 - html-id блока (без #)
 * label    	 - отображаемое название поля ввода
 * data.parentId - id (#) или class (.) блока, в который будет вставлено данное поле
 * data.value    - начальное значение
 * data.valHint  - подсказка, отображаемая в поле ввода
 * data.hint     - отображаемое поле с подсказкой
 * data.listener - функция-обработчик вызываемая после выбора
 * data.imType   - тип валидации:
 *						- required - строгая валидация введенного текста
 *						- optional - поле не обязательно должно быть выбрано (с изображением)
 *                  	- none     - optional без изображения
 * data.margin   - отступ от предыдущего элемента
 * options       - элементы для выбора (массив)
 * data.checkItem- пункт, который считается выбранным перед вводом (номер)
 */
function createSelectBlock1(blockId, label, data, options) {

	var inputParams = '<select' + 
				      ' class="form-control" name="validate-select"' + 
				      ' id="' + blockId + '-validate-select" ' + 
				      (data.valHint !== undefined ? ('placeholder="' + data.valHint + '" ') : '') + 
				      (data.imType == "required" ? "required>" : ">");

	var spanParams;
	if (data.imType == "none") {
		spanParams = "";
	} else {
		spanParams = '<span class="input-group-addon ' + 
		             ((data.imType == "required" || data.checkL) ? "danger" : "info") + 
		             '"><span class="glyphicon glyphicon-' + 
		             ((data.imType == "required" || data.checkL) ? "remove" : "asterisk") + 
		             '"></span></span>';
	}

	options.forEach((el, i, arr) => {
		arr[i] = '<option value="' + blockId + '-item_' + (i+1) + '">' + arr[i] + '</option>'
	});
	
	var selectOptions = '<option value="">' + (data.value || '') + '</option>' + 
						options.join(" ");

    data.hint = data.hint || "";

	$(((data.parentId[0] == '.' || data.parentId[0] == '#') ? '' : '#') + data.parentId)
		.append(
			'<div class="form-group" id="' + blockId + ((data.margin!==undefined) ? ('" style="margin-top: ' + data.margin +'px;">') : '">') +
        		'<label>' + label + '</label>' +
				'<div class="input-group" ' + ((data.imType=="none") ? 'style="width: 100%;">' : '>') + 
					inputParams + selectOptions + '</select>' + spanParams +
				'</div><div class="form-group-hint" ' + 'id="' + blockId + '-hint">' + data.hint + '</div></div>'
		);

	$(document).ready(function() {
		$("#" + blockId + " .input-group select").on('keyup change', function() {

			if (data.checkL) {

				var $group = $(this).closest('.input-group'),
					$addon = $group.find('.input-group-addon'),
					$icon = $addon.find('span'),
					state = $(this).val() ? true : false,
					change = blockId + "-item_" + data.checkL != ($(this).val());

				if (state) {
					if (change) {
						$addon.removeClass('danger');
						$addon.removeClass('success');
						$addon.removeClass('info');
						$addon.addClass('changed');
						$icon.attr('class', 'glyphicon glyphicon-edit');
					} else {
						$addon.removeClass('danger');
						$addon.removeClass('changed');
						$addon.removeClass('info');
						$addon.addClass('success');
						$icon.attr('class', 'glyphicon glyphicon-check');
					}
				} else {
					if (data.imType != 'optional'){
						$addon.removeClass('success');
						$addon.removeClass('changed');
						$addon.removeClass('info');
						$addon.addClass('danger');
						$icon.attr('class', 'glyphicon glyphicon-remove');
					} else {
						$addon.removeClass('success');
						$addon.removeClass('changed');
						$addon.removeClass('danger');
						$addon.addClass('info');
						$icon.attr('class', 'glyphicon glyphicon-asterisk');
					}
				}

			} else if (data.imType == "required") {

				var $group = $(this).closest('.input-group'),
					$addon = $group.find('.input-group-addon'),
					$icon = $addon.find('span'),
					state = $(this).val() ? true : false;
			
				if (state) {

					$addon.removeClass('danger');
					$addon.addClass('success');
					$icon.attr('class', 'glyphicon glyphicon-ok');
				} else {
					$addon.removeClass('success');
					$addon.addClass('danger');
					$icon.attr('class', 'glyphicon glyphicon-remove');
				}
			}

			if (data.listener !== undefined) {
				data.listener(this);
			}

		});

		$("#" + blockId).mouseenter(function() {$("#" + blockId + "-hint").css('opacity', '0.6')});

		$("#" + blockId).mouseleave(function() {$("#" + blockId + "-hint").css('opacity', '0')});

		if (data.checkL) {
			$("#" + blockId + " .input-group select option[value=" + blockId + "-item_" + data.checkL+"]").attr('selected', 'true');
		}

		$("#" + blockId + " .input-group select").trigger('change');
	});
}

/**
 * Вернуть текущее состояние блока, построенного через createInputTextBlock1 или createSelectBlock1
 * blockId       - id блока
 */
function getInputBlockState1(blockId) {
	var inputBlock = "#" + blockId + " div.input-group span";

	var inputBlockClass = $(inputBlock).attr('class');
	if (inputBlockClass)
		return inputBlockClass.split(' ')[1];

	return 'empty';
}

/** 
 * Вернуть значение из блока, построенного через createInputTextBlock1 или createSelectBlock1
 *
 * blockId       - id блока
 * optional      - значение, которое вернется в случае, если проверка на корректность не была пройдена
 *                    если ничего не введенно - возвращается ""
 */
function getTextFromInputBlock1(blockId, optional = null) {
	if (getInputBlockState1(blockId) == 'danger')
		return optional;

	var inputBlock = "#" + blockId + " div.input-group";

	var text = $(inputBlock + " input").val() || $(inputBlock + " textarea").val();
	if (text) return text;

	var item =  $(inputBlock + " select").val();
	if (item) return item.split('-item_')[1];

	return "";
}

/** Задать новое значение для поля , построенного через createInputTextBlock1 или createSelectBlock1
 * blockId       - id блока
 * val           - новое значение (для select - индекс item'а для нового значения)
 */
function setTextToInputBlock1(blockId, val) {
	var inputBlock = "#" + blockId + " div.input-group";

	$(inputBlock + " input").val(val);
	$(inputBlock + " textarea").val(val);
	if (val == 0 || val == "")
		$(inputBlock + " select").val("");
	else
		$(inputBlock + " select").val(blockId + "-item_" + val);

	$("#" + blockId + " .input-group input, #" + blockId + " .input-group textarea").trigger('change');
	$("#" + blockId + " .input-group select").trigger('change');
}


///////////////////////////////////////////////////////////////////////////////


/** 
 * Конструирование radio-button блока, на основе формы: 
 *   http://bootsnipp.com/snippets/BqxP9
 *
 * Ширина блока зависит от родительского элемента, поэтому лучше использовать 
 *    для них подобные классы: class="col-sm-offset-4 col-sm-4"
 *
 * blockId  	 - html-id блока (без #)
 * parentId      - id (#) или class (.) блока, в который будет вставлено данное поле
 * options       - элементы для выбора, с функциями, выполняемыми при выборе: {fstItem: func1, sndItem: func2, ...}
 * margin        - отступ от предыдущего элемента
 */
function createTabsBlock1(blockId, parentId, options, margin = 0) {

	var labels = [];
	for (var option in options) {
		labels.push(
            '<label data-toggle="tab" class="btn next font-small semiBold label-tabBlock" id="' + blockId + '-' + option.replace(" ", "") + '-item" style="font-size:12px; border-radius:0;">' +
                option + 
            '</label>'
		);
	}

	$(((parentId[0] == '.' || parentId[0] == '#') ? '' : '#') + parentId)
		.append(`
        	<div class=" well well-sm  bg-white borderZero"  uib-dropdown
        	` + ' id="' + blockId + '" style="margin-top: ' + margin +'px; margin-bottom: 0px;">' + `
        	    <div class="btn-group btn-group-justified font-small dropdown" data-toggle="buttons">
        	    	` + labels.join("") + `
        	    </div>
        	</div>
		`);

	for (let option in options) {
		$("#" + blockId + '-' + option.replace(" ", "") + "-item").click(function() {
			
			options[option].apply();

			for (var notSelectedOption in options) {
				$("#" + blockId + '-' + notSelectedOption.replace(" ", "") + "-item").removeClass("select-tab");
			}

			$(this).addClass("select-tab");
		});
	}
}

/**
 * Получить текущий выбранный tab в элементе, сконструированном через createTabsBlock1
 * blockId       - id блока
 */
function getCurrentTabFromTabsBlock1(blockId) {
	var tabBlock = '#' + blockId + ' div.btn-group';

	var selectedTab = $(tabBlock).children('.select-tab').attr('id');

	if (selectedTab)
		return selectedTab.split(blockId + '-')[1].split('-')[0];
	else
		return null;
	
}

/**
 * Выбрать tab с определенным названием в элементе, сконструированном через createTabsBlock1
 * blockId       - id блока
 * tab           - название выбираемого tab'a
 */
function setCurrentTabToTabsBlock1(blockId, tab) {
	var tabBlock = '#' + blockId + '-' + tab.replace(" ", "") + '-item';
 	return $(tabBlock).trigger('click');
}


///////////////////////////////////////////////////////////////////////////////


/** 
 * Конструирование блока
 *
 * blockId  	 - html-id блока (без #)
 * parentId      - id (#) или class (.) блока, в который будет вставлено данное поле
 * width		 - ширина блока в процентах
 * html          - внутренности блока
 * margin        - отступ от предыдущего элемента
 */
function createHtmlBlock1(blockId, parentId, width = 100, html = "", margin = 0) {

	$(((parentId[0] == '.' || parentId[0] == '#') ? '' : '#') + parentId)
		.append('<div class="content-emptyBlock" id=' + blockId + '></div>');

	$('#' + blockId)
		.css('width', width + '%')
		.css('margin-top', margin)
		.append(html);
}

/**
 * Конструирование блока для вывода текста с заголовком
 *
 * blockId  	 - html-id блока (без #)
 * parentId      - id (#) или class (.) блока, в который будет вставлено данное поле
 * width		 - ширина блока в процентах
 * label         - заголовок
 * text          - текст в блоке (html)
 * margin        - отступ от предыдущего элемента
 */
function createFormatedBlock1(blockId, parentId, label="", text="", width = 100, margin = 0) {

	var innerHtml = `
		<h4>` + label + `</h4>
		<hr style="margin: 0 0 10px 0; border-color: rgb(195,195,195);">
		<div style="padding-left: 30px;">` + text + `</div>
	`;

	return createHtmlBlock1(blockId, parentId, width, innerHtml, margin);
}

/**
 * Конструирование блока для вывода параграфов текста с заголовком, на основе формы:
 *    http://bootsnipp.com/snippets/featured/left-sideways-panel-header
 *
 * blockId  	 - html-id блока (без #)
 * parentId      - id (#) или class (.) блока, в который будет вставлено данное поле
 * width		 - ширина блока в процентах
 * label         - заголовок
 * type          - тип отображаемого блока
 *					panel-default
 *					panel-primary
 *					panel-success
 *					panel-info
 *					panel-warning
 *					panel-danger
 * text          - массив параграфов в тексте, или html-кода
 * margin        - отступ от предыдущего элемента
 */
function createParagraphPanelBlock1(blockId, parentId, label, text, type = "panel-default", width = 100, margin = 0) {

	var content = text.map(el => '<p>' + el + '</p>').join("");

	var width_style = "";
	if (width && width != 100 && width != "") {
		width_style = 'width: ' + width + '%;';
	}

	var margin_style = "";
	if (margin && margin != 0) {
		margin_style = 'margin-top: ' + margin + 'px;'
	}

	var blockStyle = "";
	if (width_style != "" || margin_style != "") {
		blockStyle = 'style="' + width_style + margin_style + '"'
	}

	$(((parentId[0] == '.' || parentId[0] == '#') ? '' : '#') + parentId)
		.append(`
			<div class=` + '"panel ' + type + '" id="' + blockId + '" ' + blockStyle + `>
			  <div class="panel-leftheading">
			      <h3 class="panel-lefttitle">` + label + `</h3>
			  </div>
			  <div class="panel-rightbody">
			  	` + content + `
			  </div>
			    <div class="clearfix">
			    </div>
			</div>
		`);
}


///////////////////////////////////////////////////////////////////////////////


/**
 * Конструирование блока для поиска, на основе формы:
 *   http://bootsnipp.com/snippets/featured/search-panel-with-filters
 *
 * Ширина поля ввода зависит от родительского элемента, поэтому лучше использовать 
 *    для них подобные классы: class="col-sm-offset-4 col-sm-4"
 *
 * blockId  	 - html-id блока (без #)
 * parentId      - id (#) или class (.) блока, в который будет вставлено данное поле
 * label         - классификация пунктов меню
 * options       - список переключаемых свойств для поиска
 * func          - функция, обрабатывающая поисковой запрос, принимает выбранное свойство и строку поиска
 * valHint       - подсказка, отображаемая в поле ввода
 * margin        - отступ от предыдущего элемента
 */
function createSearchSelectBlock1(blockId, parentId, label, options, func, valHint = "", margin = 0) {

	options.forEach((el, i, arr) => {
		arr[i] = '<li><a href=#' + el.replace(" ", "_") + '>' + el + '</a></li>'
	});

	$(((parentId[0] == '.' || parentId[0] == '#') ? '' : '#') + parentId)
		.append(`
			<div class="input-group" ` + 'id="' + blockId + '" style="margin-top: ' + margin +'px;">' + `
                <div class="input-group-btn search-panel">
                    <button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown">` +
                    	'<span id="' + blockId + '-search_concept">' + label + `</span> <span class="caret"></span>
                    </button>
                    <ul class="dropdown-menu" role="menu" ` + 'id="' + blockId + '-dropdown-menu">' + 
                        options.join("") + `
                    </ul>
                </div>
                <input type="hidden" name="search_param" value="all" id="search_param">         
                <input type="text" class="form-control" name="x"` + (valHint!="" ? ' placeholder="' + valHint + '">' : ' >') + `
                <span class="input-group-btn">
                    <button class="btn btn-default" type="button"><span class="glyphicon glyphicon-search"></span></button>
                </span>
            </div>
		`);

	$(document).ready(function(e){
	    $('#' + blockId + '-dropdown-menu').find('a').click(function(e) {
			e.preventDefault();
			var concept = $(this).text();
			$('#' + blockId + '-search_concept').text(concept);
		});

		$('#' + blockId + ' span.input-group-btn button').click(function(e) {
			func($('#' + blockId + '-search_concept').text(), 
				 $('#' + blockId + ' .form-control').val());
		});

		$('#' + blockId + ' .form-control').keyup(function(event) {
			if(event.keyCode==13)
				func($('#' + blockId + '-search_concept').text(), 
					 $('#' + blockId + ' .form-control').val());
		});
	});
}


/**
 * Конструирование блока для поиска, на основе формы:
 *   http://bootsnipp.com/snippets/featured/search-panel-with-filters
 *
 * Ширина поля ввода зависит от родительского элемента, поэтому лучше использовать 
 *    для них подобные классы: class="col-sm-offset-4 col-sm-4"
 *
 * blockId  	 - html-id блока (без #)
 * parentId      - id (#) или class (.) блока, в который будет вставлено данное поле
 * func          - функция, обрабатывающая поисковой запрос, принимает строку поиска
 * valHint       - подсказка, отображаемая в поле ввода
 * margin        - отступ от предыдущего элемента
 */
function createSearchBlock1(blockId, parentId, func, valHint = "", margin = 0) {

	$(((parentId[0] == '.' || parentId[0] == '#') ? '' : '#') + parentId)
		.append(`
			<div class="input-group" ` + 'id="' + blockId + '" style="margin-top: ' + margin +'px;">' + `
                <input type="hidden" name="search_param" value="all" id="search_param">         
                <input type="text" class="form-control" name="x"` + (valHint!="" ? ' placeholder="' + valHint + '">' : ' >') + `
                <span class="input-group-btn">
                    <button class="btn btn-default" type="button"><span class="glyphicon glyphicon-search"></span></button>
                </span>
            </div>
		`);

	$(document).ready(function(e){

		$('#' + blockId + ' span.input-group-btn button').click(function(e) {
			func($('#' + blockId + ' .form-control').val());
		});

		$('#' + blockId + ' .form-control').keyup(function(event) {
			if(event.keyCode==13)
				func($(this).val());
		});
	});
}

/**
 * Вернуть значение из блока поиска, сконструированном через createSearchSelectBlock1 или createSearchBlock1
 * blockId       - id блока
 */
function getTextFromSearchBlock1(blockId) {
	var inputBlock = '#' + blockId + ' input.form-control';
 	return $(inputBlock).val();
}

/**
 * Задать значение для блока поиска, сконструированном через createSearchSelectBlock1 или createSearchBlock1
 * blockId       - id блока
 * val           - новое значение
 */
function setTextToSearchBlock1(blockId, val) {
	var inputBlock = '#' + blockId + ' input.form-control';
 	return $(inputBlock).val(val);
}

/**
 * Вернуть значение выбранного таба для поиска, сконструированном через createSearchSelectBlock1
 * blockId       - id блока
 */
function getCurrentTabFromSearchBlock1(blockId) {
	var tabBlock = '#' + blockId + '-search_concept';
 	return $(tabBlock).text();
}

/**
 * Вернуть значение таба для поиска, сконструированном через createSearchSelectBlock1
 * blockId       - id блока
 * tab           - название выбираемого tab'a
 */
function setCurrentTabToSearchBlock1(blockId, tab) {
	var tabBlock = '#' + blockId + '-search_concept';
 	return $(tabBlock).text(tab);
}


///////////////////////////////////////////////////////////////////////////////


/**
 * Конструрование кнопки на основе формы:
 *   http://bootsnipp.com/snippets/featured/loading-button
 *
 * blockId  	 - html-id блока (без #)
 * parentId      - id (#) или class (.) блока, в который будет вставлено данное поле
 * text          - отображаемый на кнопке текст
 * size          - размер кнопки (sm,md,lg)
 * func          - функция, обрабатывающая нажатие
 * color         - тип кнопки, от которого зависит цвет
 *					default
 *					primary
 *					danger
 *					info
 *					warning
 *					success
 * image         - отображаемая перед текстом анимация/изображение
 *					('<i class="image"></i>')
 *					пример: "glyphicon glyphicon-repeat" (гуглить glyphicon),
 *						а анимацию через css легко сделать
 *    				"" - без изображения
 * margin        - отступ от предыдущего элемента
 * width         - ширина кнопки (по умолчанию зависит от size)
 */
function createButtonBlock1(blockId, parentId, text, size, func, color = "default", image = "", margin = 0, width = "") {

	var i_fa_spin = "";
	if (image && image != "")
		i_fa_spin = '<i class="' + image + '"></i>';

	var width_style = "";
	if (width && width != "") {
		width_style = 'width: ' + width + 'px;';
	}

	var margin_style = "";
	if (margin && margin != 0) {
		margin_style = 'margin-top: ' + margin + 'px;';
	}

	var blockStyle = "";
	if (width_style != "" || margin_style != "") {
		blockStyle = 'style="' + width_style + margin_style + '"';
	}

	$(((parentId[0] == '.' || parentId[0] == '#') ? '' : '#') + parentId)
		.append(
			'<button id="' + blockId + '" class="btn btn-' + color + ' btn-' + size + '" ' + blockStyle + '>' + 
				i_fa_spin + text + '</button>'
		);

	$(document).ready(function(e){

		$('#' + blockId).click(function(e) {
			func($(this).text());
		});
	});
}

/**
 * Изменить текст кнопки и анимацию
 * 
 * blockId  	 - html-id блока (без #)
 * text          - новый текст кнопки
 * image         - если не undefined задает новый тип анимации/изображения
 *    				fa-circle-o-notch
 *    				fa-refresh
 *    				fa-spinner
 *    				""                - отчистить поле анимации/изображения
 */
function setTextToButtonBlock1(blockId, text, image = undefined) {

	if (image) {
		if (image == "") {
			$('#' + blockId).text(text);
		} else {
			$('#' + blockId).empty().append('<i class="' + image + '"></i>').append(text);
		}
	} else {
		image = $('#' + blockId).find('i').attr('class');
		if (image && image != ""){
			$('#' + blockId).empty().append('<i class="' + image + '"></i>').append(text);
		} else {
			$('#' + blockId).text(text);
		}
	}
}

/**
 * Изменить тип(цвет) и размер кнопки 
 * 
 * blockId  	 - html-id блока (без #)
 * color         - новый тип/цвет кнопки
 * size          - новый размер кнопки
 */
function setFormatToButtonBlock1(blockId, color, size) {
	$('#' + blockId).attr('class', 'btn btn-' + color + ' btn-' + size);
}

/** 
 * Заблокировать/разблокировать кнопку
 *
 * blockId  	 - html-id кнопки (без #)
 * disabled      - если true - кнопка блокируется,
 *                 если false - происходит разблокируется
 */
function setDisabledButtonBlock1(blockId, disabled) {
	$('#' + blockId).attr('disabled', disabled);
}

///////////////////////////////////////////////////////////////////////////////


/**
 * Создание блока с анимацией загрузки
 *
 * blockId  	 - html-id блока (без #)
 * parentId      - id (#) или class (.) блока, в который будет вставлено данное поле
 * type          - анимация (1,2,3,4)
 */
function createLoadCSSAnimationBlock1(blockId, parentId, type) {

	var innerAnimationBlock;
	switch (type) {
		case 1:
			innerAnimationBlock = `
				<div id="CSSAnimation-circularG">
					<div id="CSSAnimation-circularG_1" class="CSSAnimation-circularG"></div>
					<div id="CSSAnimation-circularG_2" class="CSSAnimation-circularG"></div>
					<div id="CSSAnimation-circularG_3" class="CSSAnimation-circularG"></div>
					<div id="CSSAnimation-circularG_4" class="CSSAnimation-circularG"></div>
					<div id="CSSAnimation-circularG_5" class="CSSAnimation-circularG"></div>
					<div id="CSSAnimation-circularG_6" class="CSSAnimation-circularG"></div>
					<div id="CSSAnimation-circularG_7" class="CSSAnimation-circularG"></div>
					<div id="CSSAnimation-circularG_8" class="CSSAnimation-circularG"></div>
				</div>
			`;
			break;
		case 2:
			innerAnimationBlock = `
				<div class="CSSAnimation2-cssload-container">
					<div class="CSSAnimation2-cssload-thing"></div>
					<div class="CSSAnimation2-cssload-thing"></div>
					<div class="CSSAnimation2-cssload-thing"></div>
					<div class="CSSAnimation2-cssload-thing"></div>
					<div class="CSSAnimation2-cssload-thing"></div>
					<div class="CSSAnimation2-cssload-thing"></div>
					<div class="CSSAnimation2-cssload-thing"></div>
					<div class="CSSAnimation2-cssload-thing"></div>
					<div class="CSSAnimation2-cssload-thing"></div>
					<div class="CSSAnimation2-cssload-thing"></div>
					<div class="CSSAnimation2-cssload-thing"></div>
					<div class="CSSAnimation2-cssload-thing"></div>
				</div>
			`;
			break;
		case 3:
			innerAnimationBlock = `
				<div class="CSSAnimation3-cssload-container">
					<div class="CSSAnimation3-cssload-zenith"></div>
				</div>
			`;
			break;
		case 4:
			innerAnimationBlock = `
				<div class="CSSAnimation4-wrapper">
					<div class="CSSAnimation4-cssload-loader"></div>
				</div>
			`;
			break;
	}


	$(((parentId[0] == '.' || parentId[0] == '#') ? '' : '#') + parentId)
		.append('<div id="' + blockId + '">' + innerAnimationBlock + '</div>');
}

/**
 * Конструирование блока загрузки с анимацией
 *
 * blockId  	 - html-id блока (без #)
 * parentId      - id (#) или class (.) блока, в который будет вставлено данное поле
 * type          - анимация (1,3,4)
 * text          - отображаемый текст
 * width         - ширина блока в процентах
 * margin        - отступ от предыдущего элемента
 */
function createLoadingBlock1(blockId, parentId, type=3, text="", width=100, margin=0) {

	var width_style = "";
	if (width && width != "" && width < 100) {
		width_style = 'width: ' + width + '%;';
	}

	var margin_style = "";
	if (margin && margin != 0) {
		margin_style = 'margin-top: ' + margin + 'px;';
	}

	var blockStyle = "";
	if (blockStyle != "" || width_style != "" || margin_style != "") {
		blockStyle = 'style="' + blockStyle + width_style + margin_style + '"';
	}

	$(((parentId[0] == '.' || parentId[0] == '#') ? '' : '#') + parentId)
		.append(`
			<div class="loading-animation-block"` + ' id="' + blockId + '" ' + blockStyle + `>
				<div class="loading-animation">
				</div>
				<p>` + text + `</p>
			</div>
		`);

	createLoadCSSAnimationBlock1(blockId + "-loading-animation", blockId + ' .loading-animation', type);
}

/**
 * Сообщение об удачной загрузке в блоке построенном через createLoadingBlock1
 *
 * blockId  	 - html-id блока (без #)
 * text          - новый отображаемый текст
 * timeOut       - время, через которое блок исчезнет
 * func          - функция, выполняемая после исчезновения блока
 */
function doneLoadingBlock1(blockId, text="", timeOut=undefined, func=function() {}) {
	$('#' + blockId + ' .loading-animation')
		.empty()
		//.css('opacity', 0)
		.append('<span class="glyphicon glyphicon-ok"></span>');

	$('#' + blockId + ' p').text(text);

	/*$(document).ready(function() {
		$('#' + blockId + ' .loading-animation').css('opacity', 1);
	});*/

	if (timeOut !== undefined)
		setTimeout(function() {
			$('#' + blockId).remove();
			func();
		}, timeOut);
}

/**
 * Изменение текста в блоке построенном через createLoadingBlock1
 *
 * blockId  	 - html-id блока (без #)
 * text          - новый отображаемый текст
 */
function setTextToLoadingBlock1(blockId, text="") {
	$('#' + blockId + ' p').text(text);
}

/**
 * Сообщение о неудачной загрузке в блоке построенном через createLoadingBlock1
 *
 * blockId  	 - html-id блока (без #)
 * text          - новый отображаемый текст
 * timeOut       - время, через которое блок исчезнет
 * func          - функция, выполняемая после исчезновения блока
 */
function undoneLoadingBlock1(blockId, text="", timeOut=0, func=function() {}) {
	$('#' + blockId + ' .loading-animation')
		.empty()
		.append('<span class="glyphicon glyphicon-remove"></span>');

	$('#' + blockId + ' p').text(text);

	if (timeOut)
		setTimeout(function() {
			$('#' + blockId).remove();
			func();
		}, timeOut);
}


///////////////////////////////////////////////////////////////////////////////


/**
 * Конструктор панели для выбора изображений с предпросмотром, на основе формы:
 *    http://bootsnipp.com/snippets/featured/input-file-popover-preview-image
 *
 * blockId  	 - html-id блока (без #)
 * parentId      - id (#) или class (.) блока, в который будет вставлено данное поле
 * label         - отображаемое название блока
 * valHint       - подсказка, отображаемая в поле ввода
 * hint          - отображаемое поле с подсказкой
 * listener      - функция-обработчки ввода (принимает объект файла)
 * width         - ширина поля в процентах
 * margin        - отступ от предыдущего элемента
 */
function createInputFileBlock1(blockId, parentId, label, valHint, hint, listener, width=100, margin=0) {

	var width_style = "";
	if (width && width != "" && width != 100) {
		width_style = 'width: ' + width + '%;';
	}

	var margin_style = "";
	if (margin && margin != 0) {
		margin_style = 'margin-top: ' + margin + 'px;';
	}

	var blockStyle = "padding-bottom: 15px;";
	if (blockStyle != "" || width_style != "" || margin_style != "") {
		blockStyle = 'style="' + blockStyle + width_style + margin_style + '"';
	}

	$(((parentId[0] == '.' || parentId[0] == '#') ? '' : '#') + parentId)
		.append(`
			    <div ` + blockStyle + ' id="' + blockId + '">' + 
			    	'<label>' + label + '</label>' + `
			        <!-- image-preview-filename input [CUT FROM HERE]-->
			        <div class="input-group image-preview">
			            <input type="text" class="form-control image-preview-filename" disabled="disabled" ` + 'placeholder="' + valHint + '">' + `
			            <span class="input-group-btn fileInput-block">
			                <!-- image-preview-clear button -->
			                <button type="button" class="btn btn-default image-preview-clear" style="display:none;">
			                    <span class="glyphicon glyphicon-remove"></span> <!--Отчистить-->
			                </button>
			                <!-- image-preview-input -->
			                <div class="btn btn-default image-preview-input">
			                    <span class="glyphicon glyphicon-folder-open"></span>
			                    <span class="image-preview-input-title"><!--Выбрать файл--></span>
			                    <input type="file" accept="image/png, image/jpeg, image/gif" name="input-file-preview"/>
			                </div>
			            </span>
			        </div><!-- /input-group image-preview [TO HERE]--> 
			        <div class="form-group-hint" ` + ' id="' + blockId + '-hint">' + hint + `</div>
			    </div>
		`);

	$(document).on('click', '#' + blockId + '-close-preview', function(){ 
	    $('#' + blockId + ' .image-preview').popover('hide');

	    $('#' + blockId + ' .image-preview').hover(
	        function () {
	           $('#' + blockId + ' .image-preview').popover('show');
	        }, 
	         function () {
	           $('#' + blockId + ' .image-preview').popover('hide');
	        }
	    );   

	});

	$("#" + blockId).mouseenter(function() {$("#" + blockId + "-hint").css('opacity', '0.6')});

	$("#" + blockId).mouseleave(function() {$("#" + blockId + "-hint").css('opacity', '0')});

	$(function() {

	    var closebtn = $('<button/>', {
	        type:"button",
	        text: 'x',
	        id: blockId + '-close-preview',
	        style: 'font-size: initial;',
	    });
	    closebtn.attr("class","close pull-right");

	    $('#' + blockId + ' .image-preview').popover({
	        trigger:'manual',
	        html:true,
	        title: "<strong>Просмотр: </strong>"+$(closebtn)[0].outerHTML,
	        content: "Изображение не выбрано",
	        placement:'bottom'
	    });

	    var htmlPath = '#' + blockId + ' .image-preview .fileInput-block';

	    $(htmlPath + ' .image-preview-clear').click(function(){
	        $('#' + blockId + ' .image-preview').attr("data-content","").popover('hide');
	        $('#' + blockId + ' .image-preview' + ' .image-preview-filename').val("");
	        $(htmlPath + ' .image-preview-clear').hide();
	        $(htmlPath + ' .image-preview-input input:file').val("");
	        $(htmlPath + " .image-preview-input .image-preview-input-title").text(/*Выбрать файл*/""); 
	    }); 

	    $(htmlPath + ' .image-preview-input input:file').change(function (){     
	        var img = $('<img/>', {
	            id: 'dynamic',
	            width:250,
	            height:200
	        });      
	        var file = this.files[0];
	        var reader = new FileReader();

	        reader.onload = function (e) {
	            $(htmlPath + " .image-preview-input .image-preview-input-title").text(/*Изменить*/"");
	            $(htmlPath + ' .image-preview-clear').show();
	            $('#' + blockId + ' .image-preview' + ' .image-preview-filename').val(file.name);            
	            img.attr('src', e.target.result);
	            $('#' + blockId + ' .image-preview').attr("data-content",$(img)[0].outerHTML).popover("show");

	            setTimeout(function() {
	    			$('#' + blockId + '-close-preview').trigger('click');
	    		}, 1500);

	    		if (listener)
	    			listener(file);
	        }        
	        reader.readAsDataURL(file);
	    });  


	});

}

/**
 * Вернуть объект типа файл из блока, построенного через createInputFileBlock1
 *    В случае, если изображение не выбранно вернется undefined
 *
 * blockId  	 - html-id блока (без #)
 */
function getImageFileFromFileBlock1(blockId) {

	var htmlPath = '#' + blockId + ' .image-preview .fileInput-block';
	return $(htmlPath + ' .image-preview-input input:file')[0].files[0];

}


///////////////////////////////////////////////////////////////////////////////


/**
 * Конструирование блока с заголовком
 *
 * blockId  	 - html-id блока (без #)
 * parentId      - id (#) или class (.) блока, в который будет вставлено данное поле
 * text          - текст, отображаемый в заголовке
 * smallText     - текст, идущий после заголовка, написанный меньшим шрифтом
 * color         - цвет текста
 * size          - размер шрифта
 * width         - ширина поля в процентах
 * margin        - отступ от предыдущего элемента
 * centered      - если поле определено - текст центрируется относительно родительского блока
 */
function createHeaderBlock1(blockId, parentId, text, smallText, color = "#2B313B", size = 49, width = 100, margin = 0, centered = undefined) {

	var width_style = "";
	if (width && width != "" && width < 100) {
		width_style = 'width: ' + width + '%;';
	}

	var margin_style = "";
	if (margin && margin != 0) {
		margin_style = 'margin-top: ' + margin + 'px;';
	}

	var blockStyle = "";
	if (blockStyle != "" || width_style != "" || margin_style != "") {
		blockStyle = 'style="' + blockStyle + width_style + margin_style + '"';
	}


	$(((parentId[0] == '.' || parentId[0] == '#') ? '' : '#') + parentId)
		.append(`
			<div class="header-text-block"` + ' id="' + blockId + '" ' + blockStyle + `>
				<p class="header-text">` + text + 
					`<small>` + smallText + ` </small>
				</p>
			</div>
		`);

	$('#' + blockId + ' p.header-text')
		.css('font-size', size + 'px')
		.css('color', color);

	if (centered)
		$('#' + blockId)
			.css('text-align', 'center');

	$('#' + blockId + ' p.header-text small')
		.css('font-size', (size / 1.8) + 'px');
}

/**
 * Изменение заголовка в блоке построенном через createHeaderBlock1
 *
 * blockId  	 - html-id блока (без #)
 * text          - текст, отображаемый в заголовке
 * smallText     - текст, идущий после заголовка, написанный меньшим шрифтом
 */
function setTextToHeaderBlock1(blockId, text, smallText) {

	var size = $('#' + blockId + ' p.header-text small').css('font-size');

	$('#' + blockId + ' p.header-text')
		.empty()
		.append(text)
		.append('<small>' + smallText + '</small>');

	$('#' + blockId + ' p.header-text small')
		.css('font-size', size);

}


///////////////////////////////////////////////////////////////////////////////


/**
 * Конструирование popup-окна, появляющегося поверх всего контента на странице
 *    После сконструрования блок не будет активен. Для его отображения нужно вызвать функцияю showPopUpWindow1
 *
 * blockId  	 - html-id блока (без #)
 * content       - html-контент
 * width         - ширина блока в пикселях
 */
function createPopUpWindow1(blockId, content, width = 100) {

	$('.wrapper')
		.after('<div class="popup-block" id="' + blockId + '"><div class="popup-block-content">' + content + '</div></div>');

	$('#' + blockId).hide();
	$('#' + blockId).css('opacity', 0);
	$('#' + blockId + ' .popup-block-content').css('width', width + "px");
}

/**
 * Спрятать PopUp блок
 *
 * blockId  	 - html-id блока (без #)
 */
function hidePopUpWindow1(blockId) {
	$('#' + blockId).css('opacity', 0);

	setTimeout(function() {
		$('#' + blockId).hide();
	}, 600);
}

/**
 * Отобразить PopUp блок
 *
 * blockId  	 - html-id блока (без #)
 */
function showPopUpWindow1(blockId) {
	$('#' + blockId).show();
	$('#' + blockId).css('opacity', 1);
}

/**
 * Изменить контент PopUp блока
 *
 * blockId  	 - html-id блока (без #)
 * content       - html-контент
 */
function setContentToPopUpWindow1(blockId, content) {
	$('#' + blockId + ' .popup-block-content')
		.empty()
		.append(content);
}

/**
 * Получить jquery элемент PopUp блока
 *
 * blockId  	 - html-id блока (без #)
 */
function getPopupContentId(blockId) {
	return $('#' + blockId + ' .popup-block-content');
}

/**
 * Удалить PopUp блок
 *
 * blockId  	 - html-id блока (без #)
 */
function deletePopUpWindow1(blockId) {
	if ($('#' + blockId).css('opacity') > 0.01) {
		$('#' + blockId).css('opacity', 0);

		setTimeout(function() {
			$('#' + blockId).remove();
		}, 600);
	} else {
		$('#' + blockId).remove();
	}
}

