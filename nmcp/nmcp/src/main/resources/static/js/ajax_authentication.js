"use strict";

// Создание дескриптора текущей сессии
function Session() {
    var __sessionInfo = {};

    __sessionInfo.client_id = 'web';
    __sessionInfo.client_secret = 'medcard';
    __sessionInfo.isAuthorized = false;
    __sessionInfo.expirationDate = new Date();
    __sessionInfo.userType = 'patient';
    //__sessionInfo. :
    //user info <- userData[]
    //user Tables <- userTables[]
    //user Transactions <- userTransactions[]
    //pacient info <- pacientData[]
    //pacient tables <- pacientTables[]



    // Получить подтверждение произошедшей авторизации
    this.isAuthorized = function() {
        return __sessionInfo.isAuthorized;
    }

    // Проверить токен на истечение срока годности
    this.isAvailable = function() {
        return __sessionInfo.expirationDate > (new Date);
    }

    // Проверить наличие данных о пользователе
    this.isUserDataAvailable = function() {
        return 'userData' in __sessionInfo;
    }

    // Проверить наличие личных данных о пользователе
    //   (отображаются в блоке "Личные данные")
    this.isUserPersonalDataAvailable = function() {
        return this.isUserDataAvailable();
    }

    this.isAdmin = function() {
        return __sessionInfo.userData.admin;
    }

    // Получить оставшееся время в секундах до истечения токена
    this.getExpirationDelta = function() {
        return __sessionInfo.expirationDate.getTime() - (new Date).getTime()
    }

    // Получить текущий токен
    this.getToken = function() {
        return __sessionInfo.access_token;
    }

    // Получить данные о пользователе
    // Перед получением необходимо выполнить session_object.processUserData().send();
    this.getUserData = function() {
        return __sessionInfo.userData;
    }

    //Pacient Data GET
    this.getPacientData = function(){
        return __sessionInfo.pacientData;
    }

    this.getPatientLogin = function() {
        return __sessionInfo.pacientData.login;
    }

    //USER TABLES GET
    this.getUserTables = function(){
        return __sessionInfo.userTables;
    }

    //USER TRANSACTIONS GET
    this.getUserTransactions = function(){
        return __sessionInfo.userTransactions;
    }

    //PACIENT TABLES GET
    this.getPacientTables = function(){
         return __sessionInfo.pacientTables;
    }

    //USER TRANSACTIONS GET
    this.getPacientTransactions = function(){
         return __sessionInfo.pacientTransactions;
    }
    // Получить личные данные о пользователе
    // Перед получением необходимо выполнить session_object.processUserPersonalData().send();
    this.getPersonalUserData = function() {
        return __sessionInfo.userData;
    }

    // Функция для дебага (!! Удалить потом !!)
    // P.S. хотя можно и не удалять, а назвать еще более ужаснее
    this.__getData__ = function() {
        return __sessionInfo;
    }




    // Выполнить передаваемую функцию, после того, как объект сессии завершит выполняемый запрос
    this.lock = function(func) {
        return $.when(__sessionInfo._deferred).always(func());
    }




    // Авторизация ПАЦИЕНТА через имя пользователя и пароль
    // Возвращает объект запроса
    this.authPatient = function(user, password) {
        return AJAXquery()
                .POST('oauth/token')
                .param("grant_type", "password")
                .param("username", user)
                .param("password", password)
                .param("client_id", __sessionInfo.client_id)
                .param("client_secret", __sessionInfo.client_secret)
                .success(jsondata => {
                    __sessionInfo.isAuthorized = true;
                    __sessionInfo.user = user;
                    __sessionInfo.userType = 'patient';
                    JSONSessionAuthParser(__sessionInfo, jsondata);
                })
                .error((jqXHR, textStatus, errorThrown) => {
                    __sessionInfo.isAuthorized = false;
                    __sessionInfo.status = textStatus;
                })
                .synchronize(__sessionInfo);
    }

    // Авторизация МЕД-РАБОТНИКА через имя пользователя и пароль
    // Возвращает объект запроса
    this.authDoctor = function(user, password) {
        return AJAXquery()
                .POST('oauth/token')
                .param("grant_type", "password")
                .param("username", user)
                .param("password", password)
                .param("client_id", __sessionInfo.client_id)
                .param("client_secret", __sessionInfo.client_secret)
                .success(jsondata => {
                    __sessionInfo.isAuthorized = true;
                    __sessionInfo.user = user;
                    __sessionInfo.userType = 'medical worker';
                    JSONSessionAuthParser(__sessionInfo, jsondata);
                })
                .error((jqXHR, textStatus, errorThrown) => {
                    __sessionInfo.isAuthorized = false;
                    __sessionInfo.status = textStatus;
                })
                .synchronize(__sessionInfo);
    }

    // Регистрация нового ПАЦИЕНТА
    // Возвращает объект запроса
    this.registrationPatient = function(user, password, email) {
        return AJAXquery()
                .POST('api/account/')
                .raw()
                .param("login", user)
                .param("pass", password)
                .param("email", email)
                .synchronize(__sessionInfo);
    }

    //SEND TRANSACTION METHOD
    //REQUIRE executors's token, pacient login, pacient table name
    this.sendTranscations = function(user,table,body) {
        //filling transaction params
        var paramarray = [];
        for (let attr in body){
            let tmp = {};
            let curObj = body[attr];
            tmp['atr_name'] = body[attr].atr_name;
            tmp['strValue'] = ('strValue' in body[attr]) ? body[attr].strValue : null;
            tmp['intValue'] = ('intValue' in body[attr]) ? body[attr].intValue: null;
            tmp['longValue'] = ('longValue' in body[attr]) ? body[attr].longValue: null;
            tmp['realValue'] =('realValue' in body[attr]) ? body[attr].realValue: null;
            tmp['dateValue'] = ('dateValue' in body[attr]) ? body[attr].dateValue: null;
            tmp['blobValue'] = ('blobValue' in body[attr]) ? body[attr].blobValue: null;
            paramarray.push(tmp);
        }
        return AJAXquery()
                .POST('api/account/transactions/push/body/'+String(user)+"/"+String(table))
                .urlParam("access_token", __sessionInfo.access_token)
                .predicate(() => __sessionInfo.isAuthorized)
                .predicate(() => __sessionInfo.access_token !== undefined)
                .raw()
                .param(paramarray)
                .synchronize(__sessionInfo);
    }

    //TRANSACTION CONFIRM METHOD
    //Requires token and map id: status
    this.confirmTransactions=function(body) {
            var paramarray = {};
            for (let attr in body){
                paramarray[body[attr].id] = body[attr].status;
            }
            return AJAXquery()
                    .POST('api/account/transactions/confirmation')
                    .urlParam("access_token", __sessionInfo.access_token)
                    .predicate(() => __sessionInfo.isAuthorized)
                    .predicate(() => __sessionInfo.access_token !== undefined)
                    .raw()
                    .param(paramarray)
                    .synchronize(__sessionInfo);
    }

    // Регистрация нового МЕД-РАБОТНИКА
    this.registrationDoctor = function(user, password, email, data) {
        return AJAXquery()
                .POST('api/account/admin/register')
                .raw()
                .param("login", user)
                .param("pass", password)
                .param("email", email)
                .synchronize(__sessionInfo);
    }

    // Подтверждение регистрации пациента
    this.validate = function(login, verificationCode) {
        return AJAXquery()
                .GET("api/account/verification/" + login + "/" + verificationCode)
                .synchronize(__sessionInfo);                
    }


    // Обновление токена по refresh_token
    // Необходимо, что бы у session был атрибут refresh_token
    // Возвращает объект запроса
    this.refresh = function() {
        return AJAXquery()
                .POST('oauth/token')
                .param("grant_type", "refresh_token")
                .param("refresh_token", __sessionInfo.refresh_token)
                .param("client_id", __sessionInfo.client_id)
                .param("client_secret", __sessionInfo.client_secret)
                .predicate(() => __sessionInfo.isAuthorized)
                .predicate(() => __sessionInfo.refresh_token !== undefined)
                .success(jsondata => {
                    __sessionInfo.isAuthorized = true;
                    JSONSessionAuthParser(__sessionInfo, jsondata);
                })
                .synchronize(__sessionInfo);
    }



    // Получить данные о пользователе
    // Необходимо, что бы у session были атрибуты user и access_token
    // Возвращает объект запроса (без поля пароль!)
    this.processPacientData = function(user) {
        return AJAXquery()
                .GET('api/account/' + user)
                .param("access_token", __sessionInfo.access_token)
                .predicate(() => __sessionInfo.isAuthorized)
                .predicate(() => __sessionInfo.access_token !== undefined)
                .success(jsondata => {
                    JSONSessionPacientDataParser(__sessionInfo, jsondata);
                })
                .synchronize(__sessionInfo);
    }

    this.getUserByDoc = function(doctype, number){
        return AJAXquery()
                .GET('api/account/find_user/' + String(doctype) + '/' + String(number))
                .urlParam("access_token", __sessionInfo.access_token)
                .predicate(() => __sessionInfo.isAuthorized)
                .predicate(() => __sessionInfo.access_token !== undefined)
                .success(jsondata => {
                            JSONSessionPacientDataParser(__sessionInfo, jsondata);
                })
                .synchronize(__sessionInfo);
    }

    this.getUserByPassport = function(number){
        return this.getUserByDoc('ser_num', number);
    }

    this.getUserByMail = function(email){
        return AJAXquery()
                .GET('api/account/find_user/mail/' + String(email.replace('.','+')))
                .urlParam("access_token", __sessionInfo.access_token)
                .predicate(() => __sessionInfo.isAuthorized)
                .predicate(() => __sessionInfo.access_token !== undefined)
                .success(jsondata => {
                            JSONSessionPacientDataParser(__sessionInfo, jsondata);
                })
                .synchronize(__sessionInfo);
    }



    this.processUserData = function() {
        return AJAXquery()
                .GET('api/account/')
                .param("access_token", __sessionInfo.access_token)
                .predicate(() => __sessionInfo.isAuthorized)
                .predicate(() => __sessionInfo.user !== undefined)
                .predicate(() => __sessionInfo.access_token !== undefined)
                .success(jsondata => {
                    JSONSessionUserDataParser(__sessionInfo, jsondata);
                })
                .synchronize(__sessionInfo);
    }

    // Получить параметры 1 таблицы для авторизованного пользователя
    // Необходимо, что бы у session был атрибут access_token
    // Возвращает массив параметров таблицы
    this.getTableContent = function(tableName) {
            return AJAXquery()
                    .GET('api/account/table/'+String(tableName))
                    .param("access_token", __sessionInfo.access_token)
                    .predicate(() => __sessionInfo.isAuthorized)
                    .predicate(() => __sessionInfo.access_token !== undefined)
                    .success(jsondata => {
                        JSONSessionUserTableParser(__sessionInfo, tableName, jsondata)
                        //JSONSessionUserDataParser(__sessionInfo, jsondata);
                    })
                    .synchronize(__sessionInfo);
    }

     this.getPacientTableContent = function(user,tableName) {
                 return AJAXquery()
                         .GET('api/account/'+String(user)+'/table/'+String(tableName))
                         .param("access_token", __sessionInfo.access_token)
                         .predicate(() => __sessionInfo.isAuthorized)
                         .predicate(() => __sessionInfo.access_token !== undefined)
                         .success(jsondata => {
                             JSONSessionPacientTableParser(__sessionInfo, tableName, jsondata)
                             //JSONSessionUserDataParser(__sessionInfo, jsondata);
                         })
                         .synchronize(__sessionInfo);
    }

    // Смена почты пользователя
    // Нужен access token и новый адрес почты
    // возвращает код операции
    this.changeEmail = function(newEmail){
            //newEmail = newEmail.replace(".","%2e");
            return AJAXquery()
                    //.POST('/api/account/change_email?'+"access_token", __sessionInfo.access_token)
                    .POST('/api/account/change_email/')
                    .raw()
                    .urlParam("access_token", __sessionInfo.access_token)
                    .param("email", String(newEmail))
                    .predicate(() => __sessionInfo.isAuthorized)
                    .predicate(() => __sessionInfo.access_token !== undefined)
                    .success(jsondata => {
                              __sessionInfo.email=newEmail;
                    })
                    .synchronize(__sessionInfo);
    }

    // Смена пароля пользователя
    // Нужен access token и новый пароль
    // возвращает код операции
    this.changePass = function(newPass){
                return AJAXquery()
                        //.POST('/api/account/change_pass?'+"access_token", __sessionInfo.access_token)
                        .POST('/api/account/change_password/')
                        .raw()
                        .urlParam("access_token", __sessionInfo.access_token)
                        .param("pass", String(newPass))
                        .predicate(() => __sessionInfo.isAuthorized)
                        .predicate(() => __sessionInfo.access_token !== undefined)
                        .success(jsondata => {
                                  __sessionInfo.pass=newPass;
                        })
                        .synchronize(__sessionInfo);
    }

    //Получение транзакций пользователя по статусу
    this.getTransactionsByStatus = function(status){
            return AJAXquery()
                    .GET('/api/account/transactions/'+String(status))
                    .param("access_token", __sessionInfo.access_token)
                    .predicate(() => __sessionInfo.isAuthorized)
                    .predicate(() => __sessionInfo.access_token !== undefined)
                    .success(jsondata => {
                       JSONSessionUserTransactionParser(__sessionInfo, jsondata)
                       //JSONSessionUserDataParser(__sessionInfo, jsondata);
                    })
                    .synchronize(__sessionInfo);
    }

    //Поулчение транзакций пациента(для доктора)
    this.getPacientTransactionsByStatus = function(user, name){
            return AJAXquery()
                    .GET('/api/account/transactions/'+String(user)+'/table/'+String(name))
                    .param("access_token", __sessionInfo.access_token)
                    .predicate(() => __sessionInfo.isAuthorized)
                    .predicate(() => __sessionInfo.access_token !== undefined)
                    .success(jsondata => {
                       JSONSessionPacientTransactionParser(__sessionInfo, jsondata)
                       //JSONSessionUserDataParser(__sessionInfo, jsondata);
                    })
                    .synchronize(__sessionInfo);
    }

    // Получить личные данные пользователе для блока "Личные данные"
    // Необходимо, что бы у session были атрибуты user и access_token
    // Возвращает объект запроса
    this.processUserPersonalData = function() {
        return this.processUserData();
    }

    // Выполнить запрос request, с дополнительной проверкой на время истечения сесссии
    // В случае, если сессия была обновлена - она сохранится в local storage
    // При обновлении сессии выполнится функция onRefresh
    // Если запрос не был выполнен - выполнится функция incorrect и 
    //      сессия будет удалена из local storage
    // Если запрос успешно выполнен - выполнится функция correct
    // Перед началом выполенния запроса будет выполнена функция awaiting
    // Сессия должна быть авторизованна
    // Возвращается объект запроса
    this.sendRequestWithRefresh = function(request, correct, incorrect, onRefresh, awaiting) {

        if (!correct)   correct   = function() {};
        if (!incorrect) incorrect = function() {};
        if (!onRefresh) onRefresh = function() {};
        if (!awaiting)  awaiting  = function() {};

        var session = this;

        let refreshRequest = session.refresh()
            .before(() => {
                onRefresh();
            })
            .error(() => {
                Session.removeSessionFromLocalStorage();
                incorrect();
            })
            .success(() => {
                session.saveSessionToLocalStorage();
                AJAXquery(request)
                    .success((data) => {
                        correct(data);
                    })
                    .error(() => {
                        Session.removeSessionFromLocalStorage();
                        incorrect();
                    })
                    .send();
            });

        if (session.isAvailable()) {
            return AJAXquery(request)
                    .before(() => {
                        awaiting();
                    })
                    .predicate(() => __sessionInfo.isAuthorized)
                    .error(() => {
                        refreshRequest.send();
                    })
                    .success((data) => {
                        correct(data);
                    })
        } else {
            return refreshRequest
                    .before(() => {
                        awaiting();
                    });
        }
    }

    // Отправляет последовательно массив запросов requestsArray
    // Перед выполнением для каждого запроса выполняется sendRequestWithRefresh 
    //      с параметрами (correct, incorrect, onRefresh, awaiting)
    // Сессия должна быть авторизованна
    // Возвращается объект запроса
    this.sendConsecutiveRequestsWithRefresh = function(requestsArray, correct, incorrect, onRefresh, awaiting) {

        if (requestsArray === undefined || requestsArray.length == 0) 
            return undefined;
        else if (requestsArray.length == 1) {
            return sendRequestWithRefresh(requestsArray[0], correct, incorrect, onRefresh, awaiting)
        }
        else {
            return sendRequestWithRefresh(requestsArray[0], function() {
                sendConsecutiveRequests(requestsArray.slice(1, requestsArray.length), correct, incorrect, onRefresh, undefined);
            }, incorrect, onRefresh, awaiting);
        }
    }

    // Отправляет последовательно массив запросов requestsArray
    // Сессия должна быть авторизованна
    // Возвращается объект запроса
    this.sendConsecutiveRequests = function(requestsArray, correct, incorrect, awaiting) {

        var session = this;

        if (requestsArray === undefined || requestsArray.length == 0) 
            return undefined;
        else if (requestsArray.length == 1) {
            return requestsArray[0]
                        .before(() => {if (awaiting) awaiting();})
                        .success(() => correct())
                        .error(() => incorrect());
        }
        else {
            return requestsArray[0]
                        .before(() => {if (awaiting) awaiting();})
                        .success(() => session.sendConsecutiveRequests(requestsArray.slice(1, requestsArray.length), correct, incorrect, undefined).send())
                        .error(() => incorrect());
        }
    }



    // Сохранить текущую сессия в локальное хранилище
    // Возвращает true, если сохранение было произведено, 
    // false - если локальное хранилище не поддерживается браузером
    this.saveSessionToLocalStorage = function() {
        if (!supportsHtml5Storage())
            return false;

        localStorage.setItem("user", __sessionInfo.user);

        localStorage.setItem("access_token", __sessionInfo.access_token);
        localStorage.setItem("token_type", __sessionInfo.token_type);
        localStorage.setItem("refresh_token", __sessionInfo.refresh_token);
        localStorage.setItem("expires_in", __sessionInfo.expires_in);
        localStorage.setItem("scope", __sessionInfo.scope);
        localStorage.setItem("userType", __sessionInfo.userType);

        localStorage.setItem("expirationDate", __sessionInfo.expirationDate.getTime());

        return true;
    }

    // Загрузить объект сессии из локального хранилища
    // Возвращает true, если загрузка была произведена успешно, 
    // и false в обратном случае (если localStorage не поддерживается или сессия не была сохранена)
    // Примечание: не гарантируется, что сессия будет актуальна
    this.getSessionFromLocalStorage = function() {
        var user;

        if (!supportsHtml5Storage() || !(user = localStorage.getItem("user"))) {
            return false;
        }
            
        __sessionInfo.isAuthorized = true;
        __sessionInfo.user = user;
        __sessionInfo.userType = localStorage.getItem("userType");

        JSONSessionAuthParser(__sessionInfo, {
            access_token: localStorage.getItem("access_token"),
            token_type: localStorage.getItem("token_type"),
            refresh_token: localStorage.getItem("refresh_token"),
            expires_in: parseInt(localStorage.getItem("expires_in")),
            scope: localStorage.getItem("scope"),

            expirationDate: parseInt(localStorage.getItem("expirationDate"))
        });

        return true;
    }
}

// Удаление данных о сессии из локального хранилища
// Возвращает true, если удаление произошло успешно,
// и false - если локальное хранилище не поддерживается браузером
Session.removeSessionFromLocalStorage = function() {
    if (!supportsHtml5Storage())
        return false;

    localStorage.removeItem("user");
    localStorage.removeItem("userType");

    localStorage.removeItem("access_token");
    localStorage.removeItem("token_type");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("expires_in");
    localStorage.removeItem("scope");

    localStorage.removeItem("expirationDate");

    return true;
}

// Проверяет, находится ли сессия в локальном хранилище
Session.isSessionInLocalStorage = function() {
    
    if (!supportsHtml5Storage() || !localStorage.getItem("user")) {
        return false;
    }

    return true;
}


/*
Определяет начало сессии исходя из следующего порядка действий:
   1. Производится загрузка сессии из локального хранилища (в потоке выполнения) 
       и ВЫПОЛНЯЕТСЯ ф-ия awaiting
     2. Если получилось - Проверяется срок истечения токена
       3. Если токен актуален - выполняется попытка взятия основных данных о пользователе
         4. При успешном завершении процедуры - выполняется функция correct
         5. Если возникла ошибка - выполняется пункт 6
       6. Если время токена истекло - выполняется обновление токена по refresh_token
         7. При успешном завершении запроса - происходит получение основных данных о пользователе
           8. При успехе - выполняется функция correct
           9. Если же данные о пользователе не были получены - выполняется incorrect
               и будет произведено удаление данных о текущей сессии из local storage
         10. Если обновление токена не удалось - выполнится функция incorrect
              и будет произведено удаление данных о текущей сессии из local storage
     11. Если загрузка сессии не получилась - выполняется функция incorrect
Возвращает объект сессии
(функция awaiting будет всегда выполнена, 
   перед выполненением incorrect текущая сессия будет удалена из локального хранилища)
*/
Session.startSession = function(correct, incorrect, awaiting) {
    var session = new Session();

    let checkAdmin = function() {
        if (session.getUserData().type == 'medical worker') {
            if (session.isAdmin()) {
                correct();
            } else {
                Session.removeSessionFromLocalStorage();
                incorrect();
            }
        } else {
            correct();
        }
    };

    if (awaiting !== undefined)
        awaiting();

    if (session.getSessionFromLocalStorage()){

        var refreshQuery = session.refresh()
            .error(() => {
                Session.removeSessionFromLocalStorage();
                incorrect();
            })
            .success(() => {
                session.processUserData()
                        .error(() => {
                            Session.removeSessionFromLocalStorage();
                            incorrect();
                        })
                        .success(() => {
                            session.saveSessionToLocalStorage();
                            checkAdmin();
                        })
                        .send();
            });


        if (session.isAvailable()) {
            session.processUserData()
                .error(() => refreshQuery.send())
                .success(checkAdmin)
                .send();
        } else {
            refreshQuery.send();
        }

    }
    else {
        incorrect();
    }

    return session;
}





// Парсит json после авторизации
function JSONSessionAuthParser(sessionObject, jsondata) {
    sessionObject.status = "authorized";

    sessionObject.access_token = jsondata.access_token;
    sessionObject.token_type = jsondata.token_type;
    sessionObject.refresh_token = jsondata.refresh_token;
    sessionObject.expires_in = jsondata.expires_in;
    sessionObject.scope = jsondata.scope;

    sessionObject.expirationDate = new Date();

    if ('expirationDate' in jsondata){
        sessionObject.expirationDate.setTime(jsondata.expirationDate);
    }
    else {
        // время истечения токена устанавливается на минуту раньше
        sessionObject.expirationDate.setTime(sessionObject.expirationDate.getTime() + 
            sessionObject.expires_in * 1000 - 60000);
    }
}

// Парсит json, после выполнения полкчения данных о своем пользователе по access_token
function JSONSessionUserDataParser(sessionObject, jsondata) {
    sessionObject.userData = {};
    sessionObject.userData.type = sessionObject.userType;
    //sessionObject.userData.type = 'medical worker';

    for (var attr in jsondata) {
        sessionObject.userData[attr] = jsondata[attr];
    }
}

// Парсит json, после выполнения полкчения данных о конкретном пользователе по access_token
function JSONSessionPacientDataParser(sessionObject, jsondata) {
    sessionObject.pacientData = {};
    //sessionObject.userData.type = 'medical worker';

    for (var attr in jsondata) {
        sessionObject.pacientData[attr] = jsondata[attr];
    }
}

//Клон метода JSONSessionUserDataParser(sessionObject, jsondata), переносит инфу в отдельное поле userTransactions
function JSONSessionUserTransactionParser(sessionObject, jsondata) {
    sessionObject.userTransactions = {};

    for (var cursor in jsondata) {
        sessionObject.userTransactions[cursor] = jsondata[cursor];
    }
}

function JSONSessionPacientTransactionParser(sessionObject, jsondata) {
    sessionObject.pacientTransactions = {};

    for (var cursor in jsondata) {
        sessionObject.pacientTransactions[cursor] = jsondata[cursor];
    }
}

//Клон метода JSONSessionUserDataParser(sessionObject, jsondata), переносит инфу в отдельное поле userTables
function JSONSessionUserTableParser(sessionObject, tableName, jsondata) {

    if (!('userTables' in sessionObject))
        sessionObject.userTables = {};
    
    sessionObject.userTables[tableName] = {};

    for (var cursor in jsondata) {
        sessionObject.userTables[tableName][cursor] = jsondata[cursor];
    }
}

function JSONSessionPacientTableParser(sessionObject, tableName, jsondata) {

    if (!('pacientTables' in sessionObject))
        sessionObject.pacientTables = {};
    
    sessionObject.pacientTables[tableName] = {};

    for (var cursor in jsondata) {
        sessionObject.pacientTables[tableName][cursor] = jsondata[cursor];
    }
}


// Проверка на поддержку браузером HTML5-хранилища
function supportsHtml5Storage() {
    try {
        return 'localStorage' in window && window['localStorage'] !== null;
    } catch (e) {
        return false;
    }
}

// Вывод массива параметров в get-запросе
function getParam() {
    var param = new Array();   

    var get = location.search;

    if(get != '') {   
        var tmp = (get.substr(1)).split('&');
        for(var i=0; i < tmp.length; i++) {   
            var tmp2 = tmp[i].split('=');
            param[tmp2[0]] = tmp2[1]; 
        }
    }
    return param;
}