"use strict"

// Отобразить хедер
function showHeaderPanel() {
	$('.page-header')
		.empty()
		.append(`
			<hr id="header-overhead-line">
			<div class="header-content">
				<a href="home.html" title="Перейти на главную страницу">
					<img src="images/nmcp_logo.png" id="header-logo" alt="NMCP">
				</a>
				<div class="header-profile">
				</div>
			</div>
			<hr id="header-bottom-line">
		`);
}

// Показать панель пользователя
function showUserHeaderPanel(userData) {
	var userType = "";
	var email = userData.email;
	var userNameStr = userData.login;

	if (userData.type == 'patient') {
		userType = 'Пользователь (пациент)'
	} else if (userData.type == 'medical worker') {
		userType = 'Медицинский работник'
	}

	var dropDownMenu = ` 
        <ul class="dropdown-menu header-dropdown-menu">

            <li id="header-menu-item-profile"><a>Профиль<span class="glyphicon glyphicon-user pull-right"></span></a></li>
            <li class="divider"></li>

            ` + ((userData.type == 'patient') ? `

            <li id="header-menu-item-medCard"><a>Мед карта<span class="glyphicon glyphicon-list-alt pull-right"></span></a></li>
            <li class="divider"></li> ` : `

            <li id="header-menu-item-search"><a>Поиск пациентов<span class="glyphicon glyphicon-search pull-right"></span></a></li>
            <li class="divider"></li> `) + `

            <li id="header-menu-item-logout"><a>Выход<span class="glyphicon glyphicon-log-out pull-right"></span></a></li>
        </ul>
	`;


	$('.header-profile')
		.empty()
		.append(`
			<div class="profile-panel dropdown header-dropdown">
				<div id="profile-panel-image" class="dropdown-toggle" data-toggle="dropdown">
					<img src="images/default-user.png" id="profile-panel-image" alt="profile">
				` + dropDownMenu + `
				</div>
				<p class="profile-panel-text" id="profile-panel-name">` + userNameStr + `</p>
				<p class="profile-panel-text" id="profile-panel-describe">` + userType +`</p>
				<!--img src="images/arrow-profile-list.png" id="profile-panel-arrow"-->
			</div>
		`);

	var headerController = false;

	$('.profile-panel').click(function() {
		if (!headerController){
			$(".header-dropdown-menu").show();

			setTimeout(function() {
	    		headerController = true;
	    	}, 250);
		}
	});   

	$(document).click(function() {
		if (headerController) {
			$(".header-dropdown-menu").hide();
			headerController = false;
		}
	});


	$('#header-menu-item-profile').click(function() {
		if (document.currentLocation && document.currentLocation == 'user') {
			checkMenuItem('button-PersonalData');
		} else {
			document.location = "user.html?item=profile";
		}
	});

	$('#header-menu-item-medCard').click(function() {
		if (document.currentLocation && document.currentLocation == 'user') {
			checkMenuItem('button-Card');
		} else {
			document.location = "user.html?item=medCard";
		}
	});

	$('#header-menu-item-search').click(function() {
		if (document.currentLocation && document.currentLocation == 'user') {
			checkMenuItem('button-SearchPatients');
		} else {
			document.location = "user.html?item=patient_search";
		}
	});

	$('#header-menu-item-logout').click(function() {
		Session.removeSessionFromLocalStorage();
		document.location = "home.html";
	});
}

// Показать панель для регистрации и авторизации
function showAuthenticationHeaderPanel() {
	$('.header-profile')
		.empty()
		.append(`
			<div id="authorization-panel">
				<a class="header-login-button" href="authentication.html" id="authorization">Вход</a>
				<a class="header-login-button" href="registration.html" id="registration">Регистрация</a>
			</div>
		`);
}

