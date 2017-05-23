"use strict"

// Отобразить панель регистрации
function showRegistrationPanel() {
	$(".page-layout")
		.empty()
		.append(`
			<div id="auth-content-block">
				<div class="row" id="auth-header">
					<div class="col-sm-offset-2 col-sm-8" id="auth-header-labelBlock"></div>
				</div>
				<hr class="hr-auth-header">
				<div class="col-sm-offset-3 col-sm-6" id="auth-tabs"></div>
				
				<div class="row" id="auth-content">
				</div>
			</div>
		`);

	createHeaderBlock1("auth-label", "auth-header-labelBlock", "Регистрация", "", "#2B313B", 49, 90);

	createTabsBlock1("auth-header-tabs", "auth-tabs", {
		'Пациент': showRegistrationPatientForm, 
		'Мед работник': showRegistrationDoctorForm});

}

function setPatientAuth() {
	setCurrentTabToTabsBlock1("auth-header-tabs", "Пациент");
}

function setDoctorAuth() {
	setCurrentTabToTabsBlock1("auth-header-tabs", "Мед работник");
}

// Отображение формы для регистрации пациента
function showRegistrationPatientForm() {
	setTextToHeaderBlock1("auth-label", "Регистрация", "пациента");

	$('#auth-content')
		.empty()
		.append(`
			<div class="col-sm-offset-2 col-sm-4" id="auth-content-leftBlock"></div>
			<div class="col-sm-4" id="auth-content-rightBlock">
				<div class="auth-error-block"></div>
				<div class="auth-readInfo-block">
					Нажимая на кнопку "Зарегестрироваться" вы соглашаетесь с <a href="#">условиями использования сервиса</a> и <a href="#">политикой конфиденциальности</a>
				</div>
				<div class="row auth-buttons-block"></div>
			</div>
		`);

	createHtmlBlock1("auth-content-userData", "auth-content-leftBlock", 100, "", 30);
	createInputTextBlock1("auth-content-iput-login", "Логин", {
		parentId: "auth-content-userData",
		value: "",
		hint: "Введите логин (будет использоваться при входе)",
		listener: authenticationConfirm,
		imType: "required",
		inpType: "usual",
		keyLsn: () => allFieldsCheck()
	});
	createInputTextBlock1("auth-content-iput-email", "Электронная почта", {
		parentId: "auth-content-userData",
		value: "",
		hint: "Введите ваш e-mail",
		listener: authenticationConfirm,
		regExpF: (t) => /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/.test(t),
		imType: "required",
		inpType: "email",
		keyLsn: () => allFieldsCheck()
	});

	createHtmlBlock1("auth-content-userPasswords", "auth-content-leftBlock", 100, "", 30);
	createInputTextBlock1("auth-content-iput-password", "Пароль", {
		parentId: "auth-content-userPasswords",
		value: "",
		hint: "Введите пароль",
		regExpF: (t) => t.length >= 6,
		keyLsn: (t) => {
			allFieldsCheck();
			$("#auth-content-iput-checkPassword .input-group input").trigger('change');
			if ($(t).val().length > 0) {
				$("#auth-content-iput-checkPassword").css('opacity', 1);
				$("#auth-content-userPasswords").css('height', '200px')
			} else {
				$("#auth-content-iput-checkPassword").css('opacity', 0);
				$("#auth-content-userPasswords").css('height', '120px')
			}
		},
		imType: "required",
		inpType: "password",
		listener: () => authenticationConfirm()
	});
	createInputTextBlock1("auth-content-iput-checkPassword", "Повтоение пароля", {
		parentId: "auth-content-userPasswords",
		value: "",
		hint: "Подтвердите пароль",
		listener: authenticationConfirm,
		regExpF: (t) => t.length >= 6 && t == getTextFromInputBlock1("auth-content-iput-password", ""),
		imType: "required",
		inpType: "password",
		keyLsn: () => allFieldsCheck()
	});

	createButtonBlock1("auth-content-confirmButton", ".auth-buttons-block", " Зарегистрироваться", "lg", 
		authenticationConfirm, "info", "glyphicon glyphicon-user", 13, "250");

	// Убрать, если валидация через отдельное меню не надо
	$('.auth-buttons-block').append('<br>')
	createButtonBlock1("auth-content-verifButton", ".auth-buttons-block", "Верифицировать аккаунт", "sm", 
		showVerificationPanel, "default", "", 13);
}

// Отображение формы для регистрации мед. работника
function showRegistrationDoctorForm() {

	setTextToHeaderBlock1("auth-label", "Регистрация", "мед. работника");

	$('#auth-content')
		.empty()
		.append(`
			<div class="col-sm-offset-2 col-sm-4" id="auth-content-leftBlock"></div>
			<div class="col-sm-4" id="auth-content-rightBlock"></div>
		`);

	createHtmlBlock1("auth-content-userData", "auth-content-leftBlock", 100, "", 30);
	createInputTextBlock1("auth-content-iput-login", "Логин", {
		parentId: "auth-content-userData",
		value: "",
		hint: "Введите логин (будет использоваться при входе)",
		listener: authenticationConfirm,
		imType: "required",
		inpType: "usual",
		keyLsn: () => allFieldsCheck()
	});
	createInputTextBlock1("auth-content-iput-email", "Электронная почта", {
		parentId: "auth-content-userData",
		value: "",
		hint: "Введите ваш e-mail",
		listener: authenticationConfirm,
		regExpF: (t) => /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/.test(t),
		imType: "required",
		inpType: "email",
		keyLsn: () => allFieldsCheck()
	});
	createInputTextBlock1("auth-content-iput-phone", "Телефон", {
		parentId: "auth-content-userData",
		value: "",
		hint: "Введите ваш номер телефона",
		listener: authenticationConfirm,
		regExpF: (t) => /^[\+]{0,1}[0-9]{10,11}$/.test(t),
		imType: "required",
		inpType: "phone",
		keyLsn: () => allFieldsCheck()
	});

	createHtmlBlock1("auth-content-userDataFIO", "auth-content-leftBlock", 100, "", 30);
	createInputTextBlock1("auth-content-iput-FstName", "Фамилия", {
		parentId: "auth-content-userDataFIO",
		value: "",
		listener: authenticationConfirm,
		imType: "required",
		inpType: "usual",
		keyLsn: () => allFieldsCheck()
	});
	createInputTextBlock1("auth-content-iput-LstName", "Имя", {
		parentId: "auth-content-userDataFIO",
		value: "",
		listener: authenticationConfirm,
		imType: "required",
		inpType: "usual",
		keyLsn: () => allFieldsCheck()
	});
	createInputTextBlock1("auth-content-iput-MdlName", "Отчество", {
		parentId: "auth-content-userDataFIO",
		value: "",
		listener: authenticationConfirm,
		imType: "required",
		inpType: "usual",
		keyLsn: () => allFieldsCheck()
	});
	createInputTextBlock1("auth-content-iput-BrdthDate", "Дата рождения", {
		parentId: "auth-content-userDataFIO",
		value: "",
		listener: authenticationConfirm,
		imType: "required",
		inpType: "date",
		keyLsn: () => allFieldsCheck()
	});

	createHtmlBlock1("auth-content-userDataWork", "auth-content-leftBlock", 100, "", 30);
	createInputTextBlock1("auth-content-iput-WorkPlace", "Место работы", {
		parentId: "auth-content-userDataWork",
		value: "",
		hint: "Укажите место вашей работы",
		listener: authenticationConfirm,
		imType: "required",
		inpType: "usual",
		keyLsn: () => allFieldsCheck()
	});
	createInputTextBlock1("auth-content-iput-WorkPosition", "Должность", {
		parentId: "auth-content-userDataWork",
		value: "",
		hint: "Укажите занимаемую вами должность",
		listener: authenticationConfirm,
		imType: "required",
		inpType: "usual",
		keyLsn: () => allFieldsCheck()
	});

	createHtmlBlock1("auth-content-userPasswords", "auth-content-leftBlock", 100, "", 30);
	createInputTextBlock1("auth-content-iput-password", "Пароль", {
		parentId: "auth-content-userPasswords",
		value: "",
		hint: "Введите пароль",
		regExpF: (t) => t.length >= 6,
		keyLsn: (t) => {
			allFieldsCheck();
			$("#auth-content-iput-checkPassword .input-group input").trigger('change');
			if ($(t).val().length > 0) {
				$("#auth-content-iput-checkPassword").css('opacity', 1);
				$("#auth-content-userPasswords").css('height', '200px')
			} else {
				$("#auth-content-iput-checkPassword").css('opacity', 0);
				$("#auth-content-userPasswords").css('height', '120px')
			}
		},
		imType: "required",
		inpType: "password",
		listener: () => authenticationConfirm()
	});
	createInputTextBlock1("auth-content-iput-checkPassword", "Повтоение пароля", {
		parentId: "auth-content-userPasswords",
		value: "",
		hint: "Подтвердите пароль",
		listener: authenticationConfirm,
		regExpF: (t) => t.length >= 6 && t == getTextFromInputBlock1("auth-content-iput-password", ""),
		imType: "required",
		inpType: "password",
		keyLsn: () => allFieldsCheck()
	});

	createFormatedBlock1("auth-content-usersFiles", "auth-content-rightBlock", "Файлы:", "", 100, 30);
	createInputFileBlock1("auth-content-usersFiles-photo", "auth-content-usersFiles", 
		"Ваша фотография", "Файл png/jpg/bmp", "Добавьте фотографию с разборчивым изображением вашего лица", ()=>allFieldsCheck(), 100, 35);
	createInputFileBlock1("auth-content-usersFiles-passport", "auth-content-usersFiles", 
		"Фото паспорта", "Файл png/jpg/bmp", "Добавьте фотографию пасспотра в раскрытом виде на 2-3 странице", ()=>allFieldsCheck(), 100, 35);
	createInputFileBlock1("auth-content-usersFiles-sertif", "auth-content-usersFiles", 
		"Фото сертивиката", "Файл png/jpg/bmp", "Добавьте фотографию документа, подтверждающего ваш текущий статус, как мед работника, имеющего доступ к медкартам пациентов", ()=>allFieldsCheck(), 100, 35);

	createHtmlBlock1("auth-content-userTextData", "auth-content-rightBlock", 100, "", 30);
	createInputTextBlock1("auth-content-iput-textData", "Дополнительная информация", {
		parentId: "auth-content-userTextData",
		value: "",
		hint: "Добавьте информацию о вас, если такая есть",
		listener: authenticationConfirm,
		imType: "optional",
		inpType: "text",
		keyLsn: () => allFieldsCheck()
	});

	$('#auth-content #auth-content-rightBlock').append(`
		<div style="height: 110px;"></div>
		<div class="auth-error-block"></div>
		<div class="auth-readInfo-block">
			Нажимая на кнопку "Зарегестрироваться" вы соглашаетесь с <a href="#">условиями использования сервиса</a> и <a href="#">политикой конфиденциальности</a>
		</div>
		<div class="row auth-buttons-block"></div>
	`);

	createButtonBlock1("auth-content-confirmButton", ".auth-buttons-block", " Зарегистрироваться", "lg", 
		() => authenticationConfirm(), "info", "glyphicon glyphicon-user", 13, "250");

	$('.auth-buttons-block').append('<br>')
	createButtonBlock1("auth-content-verifButton", ".auth-buttons-block", "Верифицировать аккаунт", "sm", 
		showVerificationPanel, "default", "", 13);

}

// Ообразить PopUp окно для верификации пользователя
function showVerificationPanel() {

	createPopUpWindow1("auth-confirm-popUp", '<div id="auth-confirm-popUp-content"></div>', 500);

	var validateFunc = function() {

		var login = getTextFromInputBlock1("auth-confirm-popUp-content-validation-login", ""),
		password = getTextFromInputBlock1("auth-confirm-popUp-content-validation-password", ""),
		validationCode = getTextFromInputBlock1("auth-confirm-popUp-content-validation-input", "");

		$("#auth-confirm-popUp-content").empty();

		var session = new Session();

		session.validate(login, validationCode)
			.before(()=> {
				createLoadingBlock1("auth-confirm-popUp-loadingBlock3", "auth-confirm-popUp-content", 2, "Выполняется верификация", 100, 200);
			})
			.error(() =>{
				doneLoadingBlock1("auth-confirm-popUp-loadingBlock3", "", 0);
				createLoadingBlock1("auth-confirm-popUp-loadingBlock4", "auth-confirm-popUp-content", 1, "", 100, 100);
				undoneLoadingBlock1("auth-confirm-popUp-loadingBlock4", 
					"Возникла ошибка при подтверждении регистрации. Проверьте верификационный ключ",
					4000, () => {deletePopUpWindow1("auth-confirm-popUp")});
			})
			.success(() => {
				doneLoadingBlock1("auth-confirm-popUp-loadingBlock3", "", 0);

				session.authPatient(login, password)
					.before(() => {
						createLoadingBlock1("auth-confirm-popUp-loadingBlock5", "auth-confirm-popUp-content", 2, "Выполняется авторизация", 100, 200);
					})
					.error(() => {
						doneLoadingBlock1("auth-confirm-popUp-loadingBlock5", "", 0);
						createLoadingBlock1("auth-confirm-popUp-loadingBlock6", "auth-confirm-popUp-content", 1, "", 100, 100);
						undoneLoadingBlock1("auth-confirm-popUp-loadingBlock6", 
							"Возникла ошибка при авторизации",
							4000, () => {deletePopUpWindow1("auth-confirm-popUp")});
					})
					.success(() => {
						doneLoadingBlock1("auth-confirm-popUp-loadingBlock5", "", 0);
						createLoadingBlock1("auth-confirm-popUp-loadingBlock6", "auth-confirm-popUp-content", 1, "", 100, 100);
						doneLoadingBlock1("auth-confirm-popUp-loadingBlock6", 
							"Авторизация выполнена успешно",
							2000, () => {
								session.saveSessionToLocalStorage();
								window.location.href = "user.html";
							});
					})
					.send();
			})
			.send();
	}

	$("#auth-confirm-popUp-content").append(`
		<h4>` + "Верификация аккаунта:" + `</h4>
	`);

	createInputTextBlock1("auth-confirm-popUp-content-validation-login", "Логин", {
		parentId: "auth-confirm-popUp-content",
		hint: "Введите логин",
		imType: "none",
		inpType: "usual",
		margin: 20
	});
	createInputTextBlock1("auth-confirm-popUp-content-validation-password", "Пароль", {
		parentId: "auth-confirm-popUp-content",
		hint: "Введите пароль",
		imType: "none",
		inpType: "password",
		margin: 0
	});
	createInputTextBlock1("auth-confirm-popUp-content-validation-input", "Ключ валидации", {
		parentId: "auth-confirm-popUp-content",
		hint: "Введите ключ для подтверждения регистрации",
		imType: "none",
		inpType: "usual",
		margin: 0
	});
	createButtonBlock1("auth-confirm-popUp-content-validation-confirm", "auth-confirm-popUp-content", "Подтвердить", "md", 
		() => {validateFunc()}, "info", "", 6)
	createButtonBlock1("auth-confirm-popUp-content-validation-cancel", "auth-confirm-popUp-content", "Отмена", "sm", 
		()=>deletePopUpWindow1("auth-confirm-popUp"), "default", "", 6);

	showPopUpWindow1("auth-confirm-popUp");
}

// Отображение PopUp окна, для подтверждения регистрации доктора
function showConfirmDoctorRegistration() {

	createPopUpWindow1("auth-confirm-popUp", `
		<div id="auth-confirm-popUp-content">
		</div>`, 500);

	var login = getTextFromInputBlock1("auth-content-iput-login", ""),
	password = getTextFromInputBlock1("auth-content-iput-password", ""),
	email = getTextFromInputBlock1("auth-content-iput-email", ""),
	regData = {
		phone: getTextFromInputBlock1("auth-content-iput-phone", ""),
		lastName: getTextFromInputBlock1("auth-content-iput-LstName", ""),
		firstName: getTextFromInputBlock1("auth-content-iput-FstName", ""),
		MiddleName: getTextFromInputBlock1("auth-content-iput-MdlName", ""),
		birthDate: getTextFromInputBlock1("auth-content-iput-BrdthDate", ""),
		workPlace: getTextFromInputBlock1("auth-content-iput-WorkPlace", ""),
		workPosition: getTextFromInputBlock1("auth-content-iput-WorkPosition", ""),
		advInfo: getTextFromInputBlock1("auth-content-iput-textData", "")
	};

	createLoadingBlock1("auth-confirm-popUp-loadingBlock1", "auth-confirm-popUp-content", 2, "Выполняется регистрация", 100, 200);

	var session = new Session();
	session.registrationDoctor(login, password, email, regData)
		.before(() => {
			showPopUpWindow1("auth-confirm-popUp");
		})
		.success(() => {
			doneLoadingBlock1("auth-confirm-popUp-loadingBlock1", "", 0);
			createLoadingBlock1("auth-confirm-popUp-loadingBlock2", "auth-confirm-popUp-content", 1, "", 100, 100);
			doneLoadingBlock1("auth-confirm-popUp-loadingBlock2", 
				"Ваши данные были отправлены на проверку. В ближайшее время вам придет письмо с дальнейшими указаниями",
				 7000, () => {deletePopUpWindow1("auth-confirm-popUp")});
		})
		.error(() => {
			doneLoadingBlock1("auth-confirm-popUp-loadingBlock1", "", 0);
			createLoadingBlock1("auth-confirm-popUp-loadingBlock2", "auth-confirm-popUp-content", 1, "", 100, 100);
			undoneLoadingBlock1("auth-confirm-popUp-loadingBlock2", 
				"Возникла ошибка при регистрации. Проверьте регистрационные данные, и повторите попытку",
				 4000, () => {deletePopUpWindow1("auth-confirm-popUp")});
		})
		.send();
}

// Отображение PopUp окна, для ожидания и верификации регистрации пациента
function showConfirmPatientRegistration() {

	createPopUpWindow1("auth-confirm-popUp", '<div id="auth-confirm-popUp-content"></div>', 500);

	var login = getTextFromInputBlock1("auth-content-iput-login", ""),
	password = getTextFromInputBlock1("auth-content-iput-password", ""),
	email = getTextFromInputBlock1("auth-content-iput-email", "");


	createLoadingBlock1("auth-confirm-popUp-loadingBlock1", "auth-confirm-popUp-content", 2, "Выполняется регистрация", 100, 200);
	
	var session = new Session();
	session.registrationPatient(login, password, email)
		.before(() => showPopUpWindow1("auth-confirm-popUp"))
		.error(() => {
			doneLoadingBlock1("auth-confirm-popUp-loadingBlock1", "", 0);
			createLoadingBlock1("auth-confirm-popUp-loadingBlock2", "auth-confirm-popUp-content", 1, "", 100, 100);
			undoneLoadingBlock1("auth-confirm-popUp-loadingBlock2", 
				"Возникла ошибка при регистрации. Проверьте регистрационные данные, и повторите попытку",
				 4000, () => {deletePopUpWindow1("auth-confirm-popUp")});
		})
		.success((jsondata) => {

			doneLoadingBlock1("auth-confirm-popUp-loadingBlock1", "", 0);

			var validateFunc = function(validationCode) {

				$("#auth-confirm-popUp-content").empty();

				session.validate(login, validationCode)
					.before(()=> {
						createLoadingBlock1("auth-confirm-popUp-loadingBlock3", "auth-confirm-popUp-content", 2, "Выполняется верификация", 100, 200);
					})
					.error(() =>{
						doneLoadingBlock1("auth-confirm-popUp-loadingBlock3", "", 0);
						createLoadingBlock1("auth-confirm-popUp-loadingBlock4", "auth-confirm-popUp-content", 1, "", 100, 100);
						undoneLoadingBlock1("auth-confirm-popUp-loadingBlock4", 
							"Возникла ошибка при подтверждении регистрации. Проверьте верификационный ключ",
							4000, () => {showValidationWindow()});
					})
					.success(() => {
						doneLoadingBlock1("auth-confirm-popUp-loadingBlock3", "", 0);

						session.authPatient(login, password)
							.before(() => {
								createLoadingBlock1("auth-confirm-popUp-loadingBlock5", "auth-confirm-popUp-content", 2, "Выполняется авторизация", 100, 200);
							})
							.error(() => {
								doneLoadingBlock1("auth-confirm-popUp-loadingBlock5", "", 0);
								createLoadingBlock1("auth-confirm-popUp-loadingBlock6", "auth-confirm-popUp-content", 1, "", 100, 100);
								undoneLoadingBlock1("auth-confirm-popUp-loadingBlock6", 
									"Возникла ошибка при авторизации",
									4000, () => {showValidationWindow()});
							})
							.success(() => {
								doneLoadingBlock1("auth-confirm-popUp-loadingBlock5", "", 0);
								createLoadingBlock1("auth-confirm-popUp-loadingBlock6", "auth-confirm-popUp-content", 1, "", 100, 100);
								doneLoadingBlock1("auth-confirm-popUp-loadingBlock6", 
									"Авторизация выполнена успешно",
									2000, () => {
										session.saveSessionToLocalStorage();
										window.location.href = "user.html";
									});
							})
							.send();
					})
					.send();
			}

			var showValidationWindow = function() {
				var validate = jsondata.valdateStr;
				createInputTextBlock1("auth-confirm-popUp-content-validation-input", "Введите ключ для подтверждения регистрации", {
					parentId: "auth-confirm-popUp-content",
					value: validate,
					hint: "Ключ был выслан вам, на указанный email. Введите его или перейдите по ссылке в письме, для верификации аккаунта",
					imType: "none",
					inpType: "usual",
					margin: 25
				});
				createButtonBlock1("auth-confirm-popUp-content-validation-confirm", "auth-confirm-popUp-content", "Подтвердить", "md", 
					() => {validateFunc(getTextFromInputBlock1("auth-confirm-popUp-content-validation-input", ""))}, "info", "", 6)
				createButtonBlock1("auth-confirm-popUp-content-validation-cancel", "auth-confirm-popUp-content", "Отмена", "sm", 
					()=>deletePopUpWindow1("auth-confirm-popUp"), "default", "", 6);
			}

			// Если не нужно выводить input - можно вызвать сразу функцию validateFunc(validate)
			//validateFunc(jsondata.valdateStr);
			//validateFunc();
			showValidationWindow();
		})
		.send();
}

// Подтверждение регистрации по заполненным полям
function authenticationConfirm() {

	var currentTab = getCurrentTabFromTabsBlock1("auth-header-tabs");

	if (allFieldsCheck()) {
		showErrorMessage();

		if (currentTab == "Пациент") {
			showConfirmPatientRegistration();

		} else if (currentTab == "Медработник") {
			showConfirmDoctorRegistration();
		}
	} else {
		showErrorMessage("Пожалуйста, заполните все требуемые поля");
	}
}

// Проверка всех полей на корректность заполнения
function allFieldsCheck() {

	var currentTab = getCurrentTabFromTabsBlock1("auth-header-tabs");

	if (currentTab == "Медработник") {
		if (getInputBlockState1("auth-content-iput-email") != 'danger' &&
			getInputBlockState1("auth-content-iput-login") != 'danger' &&
			getInputBlockState1("auth-content-iput-phone") != 'danger' &&
			getInputBlockState1("auth-content-iput-LstName") != 'danger' &&
			getInputBlockState1("auth-content-iput-FstName") != 'danger' &&
			getInputBlockState1("auth-content-iput-MdlName") != 'danger' &&
			getInputBlockState1("auth-content-iput-BrdthDate") != 'danger' &&
			getInputBlockState1("auth-content-iput-textData") != 'danger' &&
			getInputBlockState1("auth-content-iput-WorkPosition") != 'danger' &&
			getInputBlockState1("auth-content-iput-WorkPlace") != 'danger' &&
			getImageFileFromFileBlock1("auth-content-usersFiles-sertif") != undefined &&
			getImageFileFromFileBlock1("auth-content-usersFiles-passport") != undefined  &&
			getImageFileFromFileBlock1("auth-content-usersFiles-photo") != undefined  &&
			getInputBlockState1("auth-content-iput-checkPassword") != 'danger' &&
			getInputBlockState1("auth-content-iput-password") != 'danger') {
	
			setDisabledButtonBlock1('auth-content-confirmButton', false);
			return true;
		} else {
			setDisabledButtonBlock1('auth-content-confirmButton', true);
			return false;
		}
	} else if (currentTab == "Пациент") {
		if (getInputBlockState1("auth-content-iput-email") != 'danger' &&
			getInputBlockState1("auth-content-iput-login") != 'danger' &&
			getInputBlockState1("auth-content-iput-checkPassword") != 'danger' &&
			getInputBlockState1("auth-content-iput-password") != 'danger') {
	
			setDisabledButtonBlock1('auth-content-confirmButton', false);
			return true;
		} else {
			setDisabledButtonBlock1('auth-content-confirmButton', true);
			return false;
		}
	}
}

// Отображение сообщения с ошибкой
function showErrorMessage(str) {
	$('.auth-error-block').empty();
	if (str && str != "")
		$('.auth-error-block')
			.append(`
				<div class="auth-error-message-block">
					` + str + `
				</div>
			`);
}