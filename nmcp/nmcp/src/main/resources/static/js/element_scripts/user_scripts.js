var menuItems = [];
document.currentLocation = 'user';
var onLoadingMenuItem = false;


// Отображает блок меню и блок контента
function showUserPanel() {
	$('div.page-layout')
		.empty()
		.append(`
			<div class="user-page-menu">
				<table class="user-page-tableMenu">

				</table>
			</div>
			<div class="user-page-content">

			</div>
		`);
}





// Отчищает поле меню и задает тип пользователя
function clearMenuItems(str, func = function() {}) {

	if (str == undefined){
		$(".user-page-tableMenu").empty();

	} else if (str == "") {
		$(".user-page-tableMenu").empty().append('<p><br><br></p>');
		
	} else {
		$(".user-page-tableMenu")
			.empty()
			.append(`
				<tr>
					<td>
						<p class="menu-header-text"><a>` + str + `</a><p>
							<hr class="menu-header-line">
					</td>
				</tr>
			`);

		$(".user-page-tableMenu tr td a").click(func);
	}
	

	menuItems = [];
}

// Добавить элемент к меню
function addMenuItem(str, itemId, func = function() {}) {
	$(".user-page-tableMenu")
		.append(`
			<tr>
				<td>
					<button class="menu-button" id="` + itemId + `">` + str + `</button>
				</td>
			</tr>
		`);
	$('#' + itemId).click(function() {
		if (!onLoadingMenuItem){
			clickOnMenuItem(itemId);
			func();
		}
	});

	menuItems.push(itemId);
}

// добавление одного пункта меню транзакций
function addChMenuItem(str, itemId, func = function() {}) {
	$(".user-page-content")
		.append(`
				<th>
					<button style="width: 320px; margin-left: 30px;" class="changes-menu-button" id="` + itemId + `""">` + str + `</button>
				</th>
		`);
	$('#' + itemId).click(function() {
		if (!onLoadingMenuItem){
			clickOnMenuItem(itemId);
			func();
		}
	});

	menuItems.push(itemId);
}

// Обработать нажатие на пункт в меню
function clickOnMenuItem(itemId) {
	menuItems.forEach((item) => {
		$('#' + item)
			.css('border-left', '')
			.css('background-color', '')
			.css('color', ''); 
	});

	$('#' + itemId)
		.css('border-left', '7px solid #1E90FF')
		.css('background-color', '#B6D7F6')
		.css('color', '#0B0F14');
}

// Выбрать пункт меню с данным id
function checkMenuItem(itemId) {
	$('#' + itemId).trigger('click');
}

// Определяет последовательность действий, после того, как меню загружено
function userPageEmptyContent(session) {
	$(document).ready(function() {
		checkMenuItem("button-PersonalData");
	});
}





// отчистить user-page-content
function clearContentBlock() {
	$(".user-page-content").empty();
}

// Обрабатывает процесс загрузки и отображения контента страницы
function userPageLoadHandler(session, query, f_condition, f_awaiting, f_correct, f_incorrect) {
	if (f_condition(session)) {
		f_correct();
	} else {
		query
			.before(() => {
				onLoadingMenuItem = true;
				f_awaiting();
			})
			.success(data => f_correct(data))
			.error(() => f_incorrect())
			.after(() => onLoadingMenuItem = false)
			.send();
	}
}


// Отображает состояние профиля в блоке контента
function userPageShowProfile(session) {
	clearContentBlock();

	userPageLoadHandler(session, () => session.processUserPersonalData(),
		// condition
		function(s) {
			return s.isUserPersonalDataAvailable();
			//return true;
		},

		// awaiting
		function() {
			createLoadingBlock1("PersonalData-loader", '.user-page-content', 3, "Подождите. Выполняется обработка личных данных", 100, 50);
		},

		// correct
		function() {

			//var personalData = {login: "Логин",email: "email@mail.ru",type:'patient'};
		 	var personalData = session.getPersonalUserData();

		 	let user_type = session.getUserData().type == 'patient';



			var changePersonalData = function() {
				clearContentBlock();

				if (personalData.type == 'medical worker') {
					createHeaderBlock1("PersonalData-header", '.user-page-content', "Профиль", "Изменение / Мед. работник", "#2B313B", 37, 100, 10);
				} else if (personalData.type == 'patient') {
					createHeaderBlock1("PersonalData-header", '.user-page-content', "Личные данные", "Изменение / Пациент", "#2B313B", 37, 100, 10);
				}

				


				$('.user-page-content').append(`
	
					<div class="row PersonalPage-content">
						<div class="col-md-offset-1 col-md-3" style="max-width: 300px; min-width: 210px;" id="PersonalData-left-column"></div>
						<div class="col-md-5" id="PersonalData-right-column"></div>
					</div>
				`);

				createFormatedBlock1("PersonalData-userImage", "#PersonalData-left-column", "Изображение", "", 100, 25);
				$('#PersonalData-userImage').append(`
					<div id="PersonalData-userImage-image-inpuBlock"></div>
					<hr style="margin: 15px 0 10px 0; border-color: rgb(195,195,195);">
					<img src="images/default-user.png" id="PersonalData-userImage-image" alt="profile image">
					<hr style="margin: 15px 0 10px 0; border-color: rgb(195,195,195);">
				`)
				.css('text-align', 'center');
				createInputFileBlock1("PersonalData-userImage-fileUploader", '#PersonalData-userImage-image-inpuBlock', 'Изменить изображение', '', 'Выберите изображение', () => {}, 100, 20);
				createButtonBlock1("PersonalData-header-userImage-confirm", "#PersonalData-userImage", " Изменить", "md", 
					() => alert("Поддержка изображений отсутствует"), "default", "glyphicon glyphicon-pencil", 0, "");

				createFormatedBlock1("PersonalData-change-email", "#PersonalData-right-column", "Email", "", 100, 25);
				createInputTextBlock1("PersonalData-inputChanges-email", "Новый Email", {
					parentId: "#PersonalData-change-email",
					value: personalData.email,
					hint: "Введите новый почтовый адресс",
					imType: "required",
					inpType: "email",
					keyLsn: () => {
						if (getInputBlockState1("PersonalData-inputChanges-email") != 'changed') {
							setDisabledButtonBlock1("PersonalData-change-email-confirm", true);
						} else {
							setDisabledButtonBlock1("PersonalData-change-email-confirm", false);
						}
					},
					regExpF: (t) => /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/.test(t),
					checkF: (t) => t != personalData.email,
					margin: 25
				});
				createButtonBlock1("PersonalData-change-email-confirm", "#PersonalData-change-email", " Изменить Email", "md", 
					() => {
						if (getInputBlockState1("PersonalData-inputChanges-email") == 'danger') {
							setTextToInputBlock1("PersonalData-inputChanges-email", personalData.email)
						} else {
							session.changeEmail(getTextFromInputBlock1("PersonalData-inputChanges-email", personalData.email))
								.before(() => {
									setTextToButtonBlock1("PersonalData-change-email-confirm", "Подождите", "glyphicon glyphicon-asterisk icon-spin-slow");
									setDisabledButtonBlock1("PersonalData-change-email-confirm", true);
								})
								.success(() => {
									setTextToButtonBlock1("PersonalData-change-email-confirm", "Изменения внесены", "glyphicon glyphicon-ok");
									setFormatToButtonBlock1("PersonalData-change-email-confirm", "success", "md");
									setTimeout(() => document.location.reload(), 1500);
								})
								.error(() => {
									setTextToButtonBlock1("PersonalData-change-email-confirm", "Изменения не внесены", "glyphicon glyphicon-remove");
									setFormatToButtonBlock1("PersonalData-change-email-confirm", "danger", "md");
									setTimeout(() => document.location.reload(), 1500);
								}).send();
						}

					}, "default", "glyphicon glyphicon-pencil", 10, "");

				var checkPasswords = function() {
					if (getInputBlockState1("PersonalData-inputChanges-passwordOld") != 'danger' &&
						getInputBlockState1("PersonalData-inputChanges-passwordNew1") != 'danger' &&
						getInputBlockState1("PersonalData-inputChanges-passwordNew2") != 'danger') {

						setDisabledButtonBlock1("PersonalData-change-password-confirm", false);
					} else {
						setDisabledButtonBlock1("PersonalData-change-password-confirm", true);
					}
				}
				createFormatedBlock1("PersonalData-change-password", "#PersonalData-right-column", "Пароль", "", 100, 50);
				createInputTextBlock1("PersonalData-inputChanges-passwordOld", "Текущий пароль", {
					parentId: "#PersonalData-change-password",
					hint: "Введите ваш нынешний пароль",
					imType: "required",
					inpType: "password",
					regExpF: (t) => t.length >= 6,
					margin: 25,
					keyLsn: checkPasswords
				});
				createInputTextBlock1("PersonalData-inputChanges-passwordNew1", "Новый пароль", {
					parentId: "#PersonalData-change-password",
					value: "",
					hint: "Введите новый пароль",
					regExpF: (t) => t.length >= 6,
					keyLsn: checkPasswords,
					imType: "required",
					inpType: "password",
					margin: 15,
					checkF: (t) => true
				});
				createInputTextBlock1("PersonalData-inputChanges-passwordNew2", "Повторение пароля", {
					parentId: "#PersonalData-change-password",
					value: "",
					hint: "Подтвердите новый пароль",
					regExpF: (t) => t.length >= 6 && t == getTextFromInputBlock1("PersonalData-inputChanges-passwordNew1", ""),
					imType: "required",
					inpType: "password",
					keyLsn: checkPasswords,
					margin: 15,
					checkF: (t) => true
				});
				createButtonBlock1("PersonalData-change-password-confirm", "#PersonalData-change-password", " Изменить Пароль", "md", 
					() => {
						session.changePass(getTextFromInputBlock1("PersonalData-inputChanges-passwordNew1", ""))
							.before(() => {
								setTextToButtonBlock1("PersonalData-change-password-confirm", "Подождите", "glyphicon glyphicon-asterisk icon-spin-slow");
								setDisabledButtonBlock1("PersonalData-change-password-confirm", true);
							})
							.success(() => {
								setTextToButtonBlock1("PersonalData-change-password-confirm", "Изменения внесены", "glyphicon glyphicon-ok");
								setFormatToButtonBlock1("PersonalData-change-password-confirm", "success", "md");
								setTimeout(() => document.location.reload(), 1500);
							})
							.error(() => {
								setTextToButtonBlock1("PersonalData-change-password-confirm", "Изменения не внесены", "glyphicon glyphicon-remove");
								setFormatToButtonBlock1("PersonalData-change-password-confirm", "danger", "md");
								setTimeout(() => document.location.reload(), 1500);
							}).send();

					}, "default", "glyphicon glyphicon-pencil", 10, "");
			}



			doneLoadingBlock1("PersonalData-loader");

			if (personalData.type == 'medical worker') {
				createHeaderBlock1("PersonalData-header", '.user-page-content', "Профиль", "Просмотр" + "  / Мед. работник", "#2B313B", 37, 100, 10);
			} else if (personalData.type == 'patient') {
				createHeaderBlock1("PersonalData-header", '.user-page-content', "Личные данные", "Просмотр" + "  / Пациент", "#2B313B", 37, 100, 10);
			}

			$('.user-page-content').append(`
				<div class="row PersonalPage-headerButtons">
					<div class="col-md-offset-7 col-md-4" id="PersonalData-headerButtons-right-column"></div>
				</div>
			`);

			createButtonBlock1("PersonalData-header-ChangeButton", "PersonalData-headerButtons-right-column", " Изменить", "md", 
				changePersonalData, "default", "glyphicon glyphicon-pencil", 0, "");
			createButtonBlock1("PersonalData-header-CardButton", "PersonalData-headerButtons-right-column", (user_type) ? " Мед. карта" : " Личные данные", "lg", 
				(user_type) ? (() => checkMenuItem("button-Card")) : (() => checkMenuItem("button-PersDoctorData")), "info", "glyphicon glyphicon-th-list", 0, "");
			

			$('.user-page-content').append(`

				<div class="row PersonalPage-content">
					<div class="col-md-offset-1 col-md-3" style="max-width: 300px; min-width: 210px;" id="PersonalData-left-column">

					</div>
					<div class="col-md-5" id="PersonalData-right-column">
					</div>
				</div>
			`);

			$(document).ready(function() { 


				createFormatedBlock1("PersonalData-userImage", "#PersonalData-left-column", "Изображение", "", 100, 25);
				$('#PersonalData-userImage').append(`
					<img src="images/default-user.png" id="PersonalData-userImage-image" alt="profile image">
					<hr style="margin: 15px 0 10px 0; border-color: rgb(195,195,195);">
					<p style="font-size: 17px; width: inherit;">  </p>
				`)
				.css('text-align', 'center');

				createHtmlBlock1("PersonalData-userData", "#PersonalData-right-column", 100, "", 25);
				createInputTextBlock1("PersonalData-userData-login", "Логин", {
					parentId: "#PersonalData-userData",
					value: personalData.login,
					imType: "none",
					inpType: "usual",
					checkF: (t) => t != personalData.login,
					margin: 5,
					attrs: "readonly"
				});
				createInputTextBlock1("PersonalData-userData-email", "Email", {
					parentId: "#PersonalData-userData",
					value: personalData.email,
					imType: "none",
					inpType: "email",
					checkF: (t) => t != personalData.email,
					margin: 20,
					attrs: "readonly"
				});
			});
		},

		// incorrect
		function() {
			undoneLoadingBlock1("PersonalData-loader", "Не удалось получить пользовательские данные");
		});
}



// Представление медкарты
var medCardLables = {
	'Персональные данные' : {
		'Личные данные' : 'medCard',
		'Адрес' : 'address'
	},
	'Медицинские данные' : {},
	'Метрики' : {},
	'Владелец карты' : {
		'Владелец документа' : 'cardOwner'
	},
	'Представители' : {
		'Представители' : 'representative'
	}
};
// Конструирует медкарту с табами для пациента
function userPageConstructMedCardPatient(session) {
	
	$('.user-page-content')
		.append(`
			<div id="user-page-medCard">
				<div id="user-page-medCard-tabsBlock"></div>
				<div id="user-page-medCard-tablesBlock"></div>
			</div>
		`);

	var tabs = {};
	for (let attr in medCardLables) {
		tabs[attr] = function() {

			let tab = medCardLables[attr];

			let tablesReq = [];
			for (let tableName in tab){
				tablesReq.push(tab[tableName]);
			}

			if (tablesReq.length == 0)
				return undefined;

			let requests = tablesReq.map(el => session.getTableContent(el));
			session.sendConsecutiveRequests(requests, 
				function() {
					doneLoadingBlock1("user-page-medCard-loader", "", 0);

					let tablesHeight = 0;

					let tablesParam = session.getUserTables();

					let parseRowName = (str) => str;

					for (let curTable in tab) {

						let tableName = curTable;
						let rows_ = tablesParam[tab[curTable]] // Вся отдельо взятая таблица  
						let rows = []; 							
						for (let i in rows_) {
							rows.push(rows_[i]);
						}
						rows.sort((a,b) => a.atr_name > b.atr_name);
						//rows.reverse();
						let rowsParam = {};

						let htmlTableElementRows = "";

						for (let row in rows) {
							currentRow = rows[row];

							let pushParam = "";
							for (let valueType in currentRow) {
								if (currentRow[valueType] && currentRow[valueType] !== null && currentRow[valueType] != "" && currentRow[valueType] != "null" && valueType != "atr_name" && valueType != "ru_name")
									pushParam += currentRow[valueType];
							}

							rowName = ('ru_name' in currentRow && currentRow['ru_name'] != null) ? parseRowName(currentRow['ru_name']) : currentRow['atr_name'];
							pushParam = (pushParam == "") ? "-- не заполнено --" : pushParam;

							htmlTableElementRows += `
            					<tr ` + 'id="MedRow' + tab[curTable] + '-' + currentRow['atr_name'].replace(" ", "_") + '"' + `>
            					    <td class="fstColumn">` + rowName + `</td>
            					    <td class="sndColumn">` + pushParam + `</td>
            					</tr>
							`;
						}

						$('#user-page-medCard-tablesBlock')
							.append(`
								<div class="row col-md-9 col-md-offset-1 custyle" style="margin-top: 20px;" ` + ' id="MedTable-' + tab[curTable] + '" ' + `>
									<label>` + curTable + `</label>
									<table class="table table-striped custab MedTable" style="margin-top: 7px;">
										<thead>
    									    <tr>
    									        <th>Поле</th>
    									        <th>Значение</th>
    									    </tr>
    									</thead>
    									` + htmlTableElementRows + `
    								</table>
    							</div>
							`);

						tablesHeight += parseInt($('#MedTable-' + tab[curTable]).css('height')) + parseInt($('#MedTable-' + tab[curTable]).css('margin-top'));
					}

					$('#user-page-medCard-tablesBlock').css('height', tablesHeight + 'px');
    					
				},
				function() {
					undoneLoadingBlock1("user-page-medCard-loader", "Не удалось получить данные мед. карты");
				},
				function() {
					$('#user-page-medCard-tablesBlock').empty();

					createLoadingBlock1("user-page-medCard-loader", 'user-page-medCard-tablesBlock', 3, "Подождите. Выполняется получение данных", 100, 50);
				}
			).send();
		};
		
	}

	createTabsBlock1("user-page-medCard-tabs", "user-page-medCard-tabsBlock", tabs, 30);
}
// Конструирует медкарту с табами для доктора, параметр user - искомый пользователь
function userPageConstructMedCardDoctor(session, user) {
	
	$('.SearchPatients-content')
		.append(`
			<div id="user-page-medCard">
				<div id="user-page-medCard-tabsBlock"></div>
				<div id="user-page-medCard-tablesBlock"></div>
			</div>
		`);

	var tabs = {};
	for (let attr in medCardLables) {
		tabs[attr] = function() {

			let tab = medCardLables[attr];

			let tablesReq = [];
			for (let tableName in tab){
				tablesReq.push(tab[tableName]);
			}

			if (tablesReq.length == 0)
				return undefined;

			let requests = tablesReq.map(el => session.getPacientTableContent(user, el));
			session.sendConsecutiveRequests(requests, 
				function() {
					doneLoadingBlock1("user-page-medCard-loader", "", 0);

					let tablesHeight = 0;

					let tablesParam = session.getPacientTables();

					let parseRowName = (str) => str;

					for (let curTable in tab) {

						let tableName = curTable;
						let rows_ = tablesParam[tab[curTable]] // Вся отдельо взятая таблица  
						let rows = []; 							
						for (let i in rows_) {
							rows.push(rows_[i]);
						}
						rows.sort((a,b) => a.atr_name > b.atr_name);
						//rows.reverse();
						let rowsParam = {};

						let htmlTableElementRows = "";

						for (let row in rows) {
							currentRow = rows[row];

							let pushParam = "";
							for (let valueType in currentRow) {
								if (currentRow[valueType] && currentRow[valueType] !== null && currentRow[valueType] != "" && currentRow[valueType] != "null" && valueType != "atr_name" && valueType != "ru_name")
									pushParam += currentRow[valueType];
							}

							rowName = ('ru_name' in currentRow && currentRow['ru_name'] != null) ? parseRowName(currentRow['ru_name']) : currentRow['atr_name'];
							pushParam = (pushParam == "") ? "-- не заполнено --" : pushParam;

							htmlTableElementRows += `
            					<tr ` + 'id="MedRow' + tab[curTable] + '-' + currentRow['atr_name'].replace(" ", "_") + '"' + `>
            					    <td class="fstColumn">` + rowName + `</td>
            					    <td class="sndColumn">` + pushParam + `</td>
            					    <td class="text-center thdColumn" style="width: 250px;"><a class="btn btn-info btn-sm editField"` + 'href="javascript:usrPgBtnMdCard(' + "'" + tab[curTable] + "', '" + currentRow['atr_name'].replace(" ", "_") + "')\"" + `>
            					    	<span class="glyphicon glyphicon-edit"></span> Изменить
            					    </a></td>
            					</tr>
							`;
						}

						$('#user-page-medCard-tablesBlock')
							.append(`
								<div class="row col-md-9 col-md-offset-1 custyle" style="margin-top: 20px;" ` + ' id="MedTable-' + tab[curTable] + '" ' + `>
									<label>` + curTable + `</label>
									<table class="table table-striped custab MedTable" style="margin-top: 7px;">
										<thead>
    									    <tr>
    									        <th>Поле</th>
    									        <th style="min-width: 300px;">Значение</th>
    									        <th class="text-center" style="width: 250px;">Действие</th>
    									    </tr>
    									</thead>
    									` + htmlTableElementRows + `
    								</table>
    							</div>
							`);

						tablesHeight += parseInt($('#MedTable-' + tab[curTable]).css('height')) + parseInt($('#MedTable-' + tab[curTable]).css('margin-top'));
					}

					$('#user-page-medCard-tablesBlock').css('height', tablesHeight + 'px');

					$(document).ready(() => $('html, body').animate({ scrollTop: $(".SearchPatients-inpuBlock").offset().top }, 600));
    					
				},
				function() {
					undoneLoadingBlock1("user-page-medCard-loader", "Не удалось получить данные мед. карты");
				},
				function() {
					$('#user-page-medCard-tablesBlock').empty();

					createLoadingBlock1("user-page-medCard-loader", 'user-page-medCard-tablesBlock', 3, "Подождите. Выполняется получение данных", 100, 50);
				}
			).send();
		};
		
	}

	createTabsBlock1("user-page-medCard-tabs", "user-page-medCard-tabsBlock", tabs, 30);
}
function usrPgBtnMdCard(table, rowName) {

	let fieldValue = $('#MedRow' + table + '-' + rowName + ' .sndColumn').text();

	$('#MedRow' + table + '-' + rowName + ' .sndColumn').empty();
	createInputTextBlock1('MedRow' + table + '-' + rowName + '-input', /*rowName + ":"*/ "", {
		parentId: '#MedRow' + table + '-' + rowName + ' .sndColumn',
		value: fieldValue == "-- не заполнено --" ? "" : fieldValue,
		hint: "",
		imType: "none",
		inpType: "usual",
		keyLsn: (t) => {
			let tVal = $(t).val();
			let tType = "";
			let tId = 'MedRow' + table + '-' + rowName + '-input';
			if (tVal.length > 0) {
				if (String(parseInt(tVal)) == tVal) {
					if (parseInt(tVal) <= 2147483647) {
						tType = 'Число (int)';
					} else if (parseInt(tVal) <= 9223372036854775807) {
						tType = 'Число (long)';
					} else {
						tType = 'Числовая строка';
					}
				} else if (String(parseFloat(tVal)) == tVal) {
					tType = 'Действительное число';
				} else {
					tType = 'Строка';
				}
			}
			$('#' + tId + '-hint').text(tType);
		}
	});

	$('#user-page-medCard-tablesBlock').css('height', (parseInt($('#user-page-medCard-tablesBlock').css('height')) + 50) + 'px');

	$('#MedRow' + table + '-' + rowName + ' .thdColumn')
		.empty()
		.append(`
			<a class="btn btn-success btn-sm saveField"><span class="glyphicon glyphicon-ok"></span> Сохранить</a>
			<a class="btn btn-danger btn-sm cancelField"><span class="glyphicon glyphicon-remove"></span> Отмена</a>
		`);

	$(document).ready(() => {
		$('#MedRow' + table + '-' + rowName + ' .thdColumn .cancelField').click(() => {
			$('#MedRow' + table + '-' + rowName + ' .thdColumn')
				.empty()
				.append(`
					<a class="btn btn-info btn-sm editField"` + 'href="javascript:usrPgBtnMdCard(' + "'" + table + "', '" + rowName + "')\"" + `>
         				<span class="glyphicon glyphicon-edit"></span> Изменить
         			</a>
				`);

			$('#MedRow' + table + '-' + rowName + ' .sndColumn').text(fieldValue);

			$('#user-page-medCard-tablesBlock').css('height', (parseInt($('#user-page-medCard-tablesBlock').css('height')) - 50) + 'px');
		});
		$('#MedRow' + table + '-' + rowName + ' .thdColumn .saveField').click(() => { 
			let pLogin = currentSession.getPatientLogin();
			let newVal = getTextFromInputBlock1('MedRow' + table + '-' + rowName + '-input', "");

			// Определение типа введенного значения
			let typeNewVal;
			if (String(parseInt(newVal)) == newVal) {
				if (parseInt(newVal) <= 2147483647) {
					typeNewVal = 'intValue';
				} else if (parseInt(newVal) <= 9223372036854775807) {
					typeNewVal = 'longValue';
				} else {
					typeNewVal = 'strValue';
				}
			} else if (String(parseFloat(newVal)) == newVal) {
				typeNewVal = 'realValue';
			} else {
				typeNewVal = 'strValue';
			}

			let bodyQ = {
				'atr_name' : rowName
				//'strValue': newVal
			};
			bodyQ[typeNewVal] = newVal;

			currentSession.sendTranscations(pLogin, table, [bodyQ])
				.before(() => {
					$('#MedRow' + table + '-' + rowName + ' .thdColumn')
						.empty()
						.append(`
         					<span class="glyphicon glyphicon-asterisk icon-spin-slow"></span> Подождите
						`);
					$('#MedRow' + table + '-' + rowName + ' .sndColumn').empty().append(`
						<span class="glyphicon glyphicon-asterisk icon-spin-slow"></span> ` + newVal);
					$('#user-page-medCard-tablesBlock').css('height', (parseInt($('#user-page-medCard-tablesBlock').css('height')) - 50) + 'px');
				})
				.success(() => {
					$('#MedRow' + table + '-' + rowName + ' .thdColumn')
						.empty()
						.append(`
         					<span class="glyphicon glyphicon-ok"></span> Отправлено
						`);
					$('#MedRow' + table + '-' + rowName + ' .sndColumn').text(newVal);
				})
				.error(() => {
					$('#MedRow' + table + '-' + rowName + ' .thdColumn')
						.empty()
						.append(`
         					<span class="glyphicon glyphicon-remove"></span> Ошибка
						`);
					$('#MedRow' + table + '-' + rowName + ' .sndColumn').text(fieldValue);
				})
				.send();
		});
	});
}


// Отображение блока медкарта для Пациента
function userPageShowMedCard(session) {

	clearContentBlock();
	createHeaderBlock1("Card-header", '.user-page-content', "Мед. карта", "Только просмотр", "#2B313B", 37, 100, 10);
	userPageConstructMedCardPatient(session);

}

// Отображение блока поиска пациента для Доктора
function userPageShowSearchPatients(session) {

	clearContentBlock();

	createHeaderBlock1("SearchPatients-header", '.user-page-content', "Поиск пациента", " Просмотр / Изменение", "#2B313B", 37, 100, 10);

	$('.user-page-content').append(`
		<div class="SearchPatients-inpuBlock col-md-offset-1 col-md-9"></div>
		<div class="SearchPatients-content" style="margin-top: 110px;"></div>
	`);

	createSearchSelectBlock1("SearchPatients-input", '.SearchPatients-inpuBlock', "Тип поиска", ["По логину", "По почте", "По паспорту"], (opt, str) => {

			let patientSearchQuery;

			if (opt == "По логину") {
				patientSearchQuery = session.processPacientData(str);
			} else if (opt == "По почте") {
				patientSearchQuery = session.getUserByMail(str);
			} else if (opt == "По паспорту") {
				patientSearchQuery = session.getUserByPassport(str);
			} else {
				alert("Выберите тип поиска ");
				return;
			}

			patientSearchQuery
				.before(() => {
					$('.SearchPatients-content').empty();
					createLoadingBlock1("SearchPatients-content-loader", '.SearchPatients-content', 3, "Подождите. Выполняется поиск пациента", 100, 10);
				})
				.success(() => {
					let logStr = session.getPatientLogin();

					if (logStr === undefined){
						undoneLoadingBlock1("SearchPatients-content-loader", "Пациент не найден", 2000);
						return;
					}

					doneLoadingBlock1("SearchPatients-content-loader", "", 0);
					createHeaderBlock1("SearchPatients-user-header", '.SearchPatients-content', logStr, "", "#5C6470", 30, 100, 0, true);
					userPageConstructMedCardDoctor(session, logStr);
				})
				.error(() => {
					undoneLoadingBlock1("SearchPatients-content-loader", "Пациент не найден", 2000);
				})
				.send();

		}, "", 22);

	setCurrentTabToSearchBlock1("SearchPatients-input", "По логину");
}


function userPageCreateTransactionBlock(session, trId, attr, ru_name, message, status, onAcc) {

	let flagConfirmTr = false;

	let confirmTr = function(stat) {
		return session.confirmTransactions([{
				'id': trId,
				'status': stat
			}])
			.before(() => {
				flagConfirmTr = true;
				$('#transaction-block-' + trId + ' .tr-item-blockBorder')
					.css('height', '54px')
					.empty()
					.append(`
						<p style="font-size: 17px;">
							<span class="glyphicon glyphicon-asterisk icon-spin-slow"></span>
							 Подождите
						</p>
					`);
			})
			.success(() => {
				if (stat == 'current')
					$('.tr-item-withIdTr-' + attr).css('min-height', '54px').empty().append(`
							<p style="font-size: 17px;">
								<span class="glyphicon glyphicon-trash"></span>
								 Вы выбрали другое изменение на данное поле
							</p>
					`);
				$('#transaction-block-' + trId + ' .tr-item-blockBorder')
					.css('height', '54px')
					.empty()
					.append(`
						<p style="font-size: 17px;">
							<span class="glyphicon glyphicon-ok"></span>
							 Изменение ` + ((stat=='decline') ? 'отклонено' : 'подтверждено') + `
						</p>
					`);
			})
			.error(() => {
				$('#transaction-block-' + trId + ' .tr-item-blockBorder')
					.css('height', '54px')
					.empty()
					.append(`
						<p style="font-size: 17px;">
							<span class="glyphicon glyphicon-remove"></span>
							 Ошибка изменения статуса транзакции
						</p>
					`);
			})
			.send();
	};

	$(".Changes-content").append(`
	    <div class="transaction-block" ` + 'id="transaction-block-' + trId + '" ' + `style="width: 100%; margin-top: 15px;">
	        <li class="list-group-item">
	        	<div class="list-group-item-textBlock">
	        		<small>Id: ` + trId + `</small> <br>
	        		<p><b>` + ru_name + `</b></p>
	        		<div ` +  'class="tr-item-blockBorder tr-item-withIdTr-' + attr + '" ' + `></div>
	        		<p style="margin-left: 25px;">` + ((message && message != "") ? message : '-- не заполнено --') + `</p>
	        	</div>

	        </li>
	    </div>
	`);

	if (onAcc) {
		$(document).ready(function () {

			$('#transaction-block-' + trId + ' .tr-item-blockBorder').css('height', '54px');
			setTimeout(() => {
				if (parseInt($('#transaction-block-' + trId + ' .tr-item-blockBorder').css('height')) == 54) {
					$("#Changes-okes-" + trId).css('opacity', '1');
					$("#Changes-nope-" + trId).css('opacity', '1');
				}
			}, 800);

			setTimeout(() => {
				$('#transaction-block-' + trId).hover(() => {
					$('#transaction-block-' + trId + ' .tr-item-blockBorder').css('height', '54px');
					setTimeout(() => {
						if (parseInt($('#transaction-block-' + trId + ' .tr-item-blockBorder').css('height')) == 54) {
							$("#Changes-okes-" + trId).css('opacity', '1');
							$("#Changes-nope-" + trId).css('opacity', '1');
						}
					}, 800);
				}, () => {
					if (!flagConfirmTr) {
						$('#transaction-block-' + trId + ' .tr-item-blockBorder').css('height', '0');
						$("#Changes-okes-" + trId).css('opacity', '0');
						$("#Changes-nope-" + trId).css('opacity', '0');
					}
	
				});
			}, 1000);

		});

		createButtonBlock1("Changes-okes-" + trId, '#transaction-block-' + trId + ' .tr-item-blockBorder', " Подтвердить", "md", 
			() => confirmTr('current'), "info", "glyphicon glyphicon-ok", 4, "128");
		createButtonBlock1("Changes-nope-" + trId, '#transaction-block-' + trId + ' .tr-item-blockBorder', " Отклонить", "md", 
			() => confirmTr('decline'), "default", "glyphicon glyphicon-remove", 4, "128");
		createHeaderBlock1()
		/*$('#transaction-block-' + trId).append(`
	        <span class="show-menu">
	            <span class="glyphicon glyphicon-chevron-right"></span>
	        </span>
	        <ul class="list-group-submenu">
	            <li class="list-group-submenu-item success"` + ' id="transaction-cancel-' + trId + '"' + `><span class="glyphicon glyphicon-remove"></span></li>
	            <li class="list-group-submenu-item danger"` + ' id="transaction-ok-' + trId + '"' + `><span class="glyphicon glyphicon-ok"></span></li>
	        </ul>

		`);*/
	}
	
	/*$(document).ready(function () {
	    $('.list-group-item > .show-menu').on('click', function(event) {
	    event.preventDefault();
	    $(this).closest('li').toggleClass('open');
	    });
	        $('#transaction-ok-' + data.id).click(() => {});
	        $('#transaction-cancel-' + data.id).click(() => {});
	});*/

	//$(".Changes-content").append(`<p>` + trId + '(' + status + ')' + ' : ' + attr + ' -> ' + '"' + message + '"' + `</p>`);
}

function userPageShowTransactionPanel(session) {

	clearContentBlock();

	createHeaderBlock1("Changes-header", '.user-page-content', "Изменения мед. карты", " Просмотр / Изменение", "#2B313B", 37, 100, 10);

	$('.user-page-content').append(`
		<div class="Changes-tabBlock" style="padding-left: 12%; padding-right: 12%"></div>
		<div class="Changes-contentBlock"></div>
	`);

	let transMapper = function(trStr, onAcc = undefined) {
		
		return () => {
			session.getTransactionsByStatus(trStr)
				.before(() => {
					$('.Changes-contentBlock').empty().append(`
						<div class="Changes-content-loadBlock" style="margin-top: 40px;"></div>
						<div class="Changes-content" style="padding-left: 20%; padding-right: 20%"></div>
					`)
					createLoadingBlock1("Changes-content-loader-" + trStr, '.Changes-content-loadBlock', 3, "Подождите. Выполняется получение транзакций", 100, 10);
				})
				.success((transactions) => {
					if (transactions.length == 0)
						doneLoadingBlock1("Changes-content-loader-" + trStr, "Активные транзакции отсутствуют");
					else {
						doneLoadingBlock1("Changes-content-loader-" + trStr, "", 0);

						transactions = transactions.sort((a,b) => a.atr_name > b.atr_name);

						for (let index in transactions) {
							curTr = transactions[index];

							let paramTr = "";
							for (let valueType in curTr) {
								if (curTr[valueType] && curTr[valueType] !== null && curTr[valueType] != "" && curTr[valueType] != "null" && valueType != "atr_name" && valueType != "transactionId" && valueType != "status" && valueType != "ru_name")
									paramTr += curTr[valueType];
							}

							userPageCreateTransactionBlock(session, curTr.transactionId, curTr.atr_name, curTr.ru_name, paramTr, curTr.status, onAcc);
						}
					}
				})
				.error(() => {
					undoneLoadingBlock1("Changes-content-loader-" + trStr, "Сбой получения транзакций");
				})
				.send();
		};
	};
	createTabsBlock1("Changes-tabs", ".Changes-tabBlock", {
			'Ожидающие': transMapper('wait', 'yes'),
			'Отклоненные': transMapper('decline'),
			'Старые' : transMapper('old')
			//,'Текущие' : transMapper('current')
		}, 30);

}




// Отображение блока начальной загрузки сессии
function userPageAwaiting(session) {
	$('div.page-layout')
		.empty()
		.append(`
			<div class="awaiting-block">
				<div class="awaiting-animation-block">
				</div>

				<hr>

				<p>
					Пожалуйста подождите<br>
					Выполняется вход в аккаунт и получение пользовательских данных
				</p>
			</div>
		`);

	createLoadCSSAnimationBlock1("awaiting-animation", ".awaiting-animation-block", 2);
}






// Конструирование пунктов меню для пользователей типа "пациент"
function createMenuItemsForPatient(session) {
	// clearMenuItems(session.getUserData().login);
	//clearMenuItems("Пациент");
	clearMenuItems();
	//clearMenuItems("");

	addMenuItem("Профиль", "button-PersonalData", () => userPageShowProfile(session));
	addMenuItem("Мед. Карта", "button-Card", () => userPageShowMedCard(session));
	addMenuItem("Изменения мед. карты", "button-Changes", () => userPageShowTransactionPanel(session));
	addMenuItem("Выход из профиля", "button-Logout", () => {
		Session.removeSessionFromLocalStorage();
		window.location.href = "home.html";
	});
	userPageEmptyContent(session);
}

// Конструирование пунктов меню для пользователей типа "медицинский работник"
function createMenuItemsForDoctor(session) {
	//clearMenuItems("Д-р" + session.getUserData().login, "user.html");
	clearMenuItems();

	addMenuItem("Профиль", "button-PersonalData", () => userPageShowProfile(session));
	addMenuItem("Личные данные", "button-PersDoctorData");
	addMenuItem("Поиск пациента", "button-SearchPatients", () => userPageShowSearchPatients(session));
	addMenuItem("Выход из профиля", "button-Logout", () => {
		Session.removeSessionFromLocalStorage();
		window.location.href = "home.html";
	});
	userPageEmptyContent(session);
}

//Создание меню с типами транзакций
function createChangesMenuItems(session){
    clearContentBlock();
    addChMenuItem("Неподтвержденные", "button-wait", () => showTransactionsByStatus(session, "wait"));
    addChMenuItem("Отклоненные", "button-decline",  () => showTransactionsByStatus(session, "decline"));
    addChMenuItem("Старые", "button-old",  () => showTransactionsByStatus(session, "old"));
    }

function showTransactionsByStatus(session, status){
    session.getTransactionsByStatus(status)
    .success((atr) => createTransactionBlock(atr))
    .send();
}

function createTransactionBlock(data){

$(".user-page-content").append(`
    <div class="col-md-offset-4 col-md-4" style="margin-top: 20px;">
        <li class="list-group-item open">
        ` + "lorem" + `
            <span class="show-menu">
                <span class="glyphicon glyphicon-chevron-right"></span>
            </span>
            <ul class="list-group-submenu">
                <li class="list-group-submenu-item success"` + ' id="transaction-cancel-' + data.id + '"' + `><span class="glyphicon glyphicon-remove"></span></li>
                <li class="list-group-submenu-item danger"` + ' id="transaction-ok-' + data.id + '"' + `><span class="glyphicon glyphicon-ok"></span></li>
            </ul>
        </li>
    </div>
    `);

$(document).ready(function () {
    $('.list-group-item > .show-menu').on('click', function(event) {
    event.preventDefault();
    $(this).closest('li').toggleClass('open');
    });
        $('#transaction-ok-' + data.id).click(() => {});
        $('#transaction-cancel-' + data.id).click(() => {});
    });
}
