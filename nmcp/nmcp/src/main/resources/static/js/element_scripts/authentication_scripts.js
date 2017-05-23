"use strict"


// Отобразить панель авторизации
function showAuthenticationPanel() {
	$(".page-layout")
		.empty()
		.append(`
			<div id="auth-content-block">
				<div class="row" id="auth-header">
					<div class="col-sm-offset-2 col-sm-8" id="auth-header-labelBlock"></div>
				</div>
				<hr class="hr-auth-header">
				<div class="row" id="auth-content">
					<div class="col-sm-offset-2 col-sm-4" id="auth-content-leftBlock"></div>
					<div class="col-sm-4" id="auth-content-rightBlock">
						<div class="auth-error-block"></div>
						<div class="row auth-buttons-block"></div>
					</div>
				</div>
			</div>
		`);

	createHeaderBlock1("auth-label", "auth-header-labelBlock", "Авторизация", "", "#2B313B", 49, 90);

	createHtmlBlock1("auth-content-userType", "auth-content-leftBlock", 100, "", 0);
	createSelectBlock1("auth-content-iput-type", "Тип пользователя", {
		parentId: "auth-content-userType",
		value: "Не выбрано",
		hint: "Выберите тип пользователя",
		listener: (e) => {
			allFieldsCheck();
			var val = $(e).val().split('-item_')[1];
			if (val === undefined) {
				setTextToHeaderBlock1("auth-label", "Авторизация", "");
			} else if (val == 1) {
				setTextToHeaderBlock1("auth-label", "Авторизация", "пациента");
			} else if (val == 2) {
				setTextToHeaderBlock1("auth-label", "Авторизация", "мед. работника");
			}
		},
		imType: "required",
		margin: 0
	}, ["Пациент", "Мед. работник"]);

	createHtmlBlock1("auth-content-userData", "auth-content-leftBlock", 100, "", 20);
	createInputTextBlock1("auth-content-iput-login", "Логин", {
		parentId: "auth-content-userData",
		value: "",
		hint: "Введите ваш логин, указанный при регистрации",
		listener: authenticationConfirm,
		imType: "required",
		inpType: "usual",
		keyLsn: () => allFieldsCheck()
	});
	createInputTextBlock1("auth-content-iput-password", "Пароль", {
		parentId: "auth-content-userData",
		value: "",
		hint: "Введите ваш пароль",
		listener: authenticationConfirm,
		imType: "required",
		inpType: "password",
		keyLsn: () => allFieldsCheck()
	});

	createButtonBlock1("auth-content-confirmButton", ".auth-buttons-block", " Войти", "lg", 
		authenticationConfirm, "info", "glyphicon glyphicon-ok", 25, "150");
	createButtonBlock1("auth-content-registrationButton", ".auth-buttons-block", " Зарегистрироваться", "md", 
		() => document.location = "registration.html", "default", "glyphicon glyphicon-user", 25, "");
}

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

function authenticationConfirm() {
	if (allFieldsCheck()) {
		showErrorMessage();

		var userType = getTextFromInputBlock1("auth-content-iput-type", ""),
		login = getTextFromInputBlock1("auth-content-iput-login", ""),
		password = getTextFromInputBlock1("auth-content-iput-password", "");

		var session = new Session();

		if (userType == 1) {

			session.authPatient(login, password)
				.before(() => {
					setTextToButtonBlock1("auth-content-confirmButton", " Подождите", "glyphicon glyphicon-asterisk icon-spin-slow");
					setDisabledButtonBlock1('auth-content-confirmButton', true);
					setDisabledButtonBlock1('auth-content-registrationButton', true);
				})
				.success(() => {
					if (session.isAuthorized){
						session.saveSessionToLocalStorage();
						window.location.href = "user.html"
					} else {
						showErrorMessage("Учетные данные пользователя введены не верно");
					}
				})
				.error(() => {
					showErrorMessage("Учетные данные пользователя введены не верно");
				})
				.after(() => {
					setTextToButtonBlock1("auth-content-confirmButton", " Войти", "glyphicon glyphicon-ok");
					setDisabledButtonBlock1('auth-content-confirmButton', false);
					setDisabledButtonBlock1('auth-content-registrationButton', false);
				})
				.send();

		} else if (userType == 2) {

			session.authDoctor(login, password)
				.before(() => {
					setTextToButtonBlock1("auth-content-confirmButton", " Подождите", "glyphicon glyphicon-asterisk icon-spin-slow");
					setDisabledButtonBlock1('auth-content-confirmButton', true);
					setDisabledButtonBlock1('auth-content-registrationButton', true);
				})
				.success(() => {
					if (session.isAuthorized){
						session.saveSessionToLocalStorage();
						window.location.href = "user.html"
					} else {
						showErrorMessage("Учетные данные пользователя введены не верно");
					}
				})
				.error(() => {
					showErrorMessage("Учетные данные пользователя введены не верно");
				})
				.after(() => {
					setTextToButtonBlock1("auth-content-confirmButton", " Войти", "glyphicon glyphicon-ok");
					setDisabledButtonBlock1('auth-content-confirmButton', false);
					setDisabledButtonBlock1('auth-content-registrationButton', false);
				})
				.send();
		}

	} else {
		showErrorMessage("Пожалуйста, заполните все требуемые поля");
	}
}

function allFieldsCheck() {
	if (getInputBlockState1("auth-content-iput-type") != 'danger' &&
		getInputBlockState1("auth-content-iput-login") != 'danger' &&
		getInputBlockState1("auth-content-iput-password") != 'danger') {

		setDisabledButtonBlock1('auth-content-confirmButton', false);
		return true;
	} else {
		setDisabledButtonBlock1('auth-content-confirmButton', true);
		return false;
	}
}

function setPatientAuth() {
	setTextToInputBlock1("auth-content-iput-type", 1);
}

function setDoctorAuth() {
	setTextToInputBlock1("auth-content-iput-type", 2);
}