/*
	Описание ajax запросов в конвейрном стиле с помощью jquery.

	AJAXquery(q)	-	Начало запроса (строит новый объект типа CascadeHTTPQuery) 
							(если в параметр функции ничего не было передано)
						Опционально: Для клонирования запроса - его нужно передать в качестве параметра

		.POST("url")  -	Строит POST-запрос по указанному url 
						(так же возможно написание GET, PUT, DELETE запросов)

		.param("param", "val")  -	Добавляет параметры к запросу (идут после '?')
		.param("param=val")
		.param({param: "val"})

		.raw()                  -   Преоразует тип содержимого запроса в json
		.raw({param: "val"})        (Может содержать параметры, как в .param)

		.urlParam("prm", "v")   -   Добавляет параметры к запросу, которые всегда будут представлены в форме ("?prm=v")
		                            	Даже для raw запросов
		                            (Может содержать все виды параметров, как в .param)

		.async(isAsync) -	Позволяет выполнять синхронные запросы, если isAsync=false
							(по умолчанию выполнение запросов происходит асинхронно)

		.synchronize(o) -	Механизм синхронизации асинхронных запросов по монитору o
							(Запрос происходит только тогда, когда все мониторы освобождены)
							Если передать в функцию false - массив мониторов обнулится

		.success(func)  -	Добавляет к запросу функцию, которая будет выполнена при успешном завершении
							Функций может быть больше одной, при этом они будут выполняться в последовательном порядке
								указания их в запросе (так же как и для методов error, after, predicate)
							Функция должна принимать один аргумент - выходные данные (json response)
		.success(f,p)   -	Опционально в метод можно передать предикат от выходных данных

		.error(func)    -	Так же как и success принимает функцию, выполяющуюся при неудачном завершении
							Функция должна принимать три аргумента - объект типа jqXHR (*), 
								строка сообщения об ошибке, опциональный объект исключения errorThrown

		.after(func)    -	Добавляет функцию, которая выполнится в любом случае после завершения запроса
							Функция должна принимать два аргумента - jqXHR (*), строка статуса завершения запроса

		.before(func)   -	Добавляет функцию, которая выполнится перед выполнением запроса
							В отличии от функций в success, error, after, predicate -
								ф-ии в before выполняются в обратном порядке
							Функция должна принимать два аргумента - jqXHR (*), объект настроек

		.predicate(p)   -	Добавляет стадию предпроверки к запросу, происходящую перед отправкой запроса,
								а так же перед функциями before.
							Функция ничего не должна принимать, и возвращать логическое значение
		.predicate(p,f) -	Опционально в метод можно передать функцию, которая выполнится, если предикат вернет false,
								и если предыдущие предикаты вернули true

		.send()  -	Терминальная операция, отправляет построенный запрос

		( .getPromise() )  -	Терминальная операция, возвращает объект типа Promise (**)


	(*)  jqXHR - объект надмножества встроенного в браузер объекта типа XMLHttpRequest
	(**) Promise - прдоставление дополнительных возможностей организации асинхронного кода в js
*/

"use strict";

function CascadeHTTPQuery() {
	this.type = 'GET';
	this.dataType = 'json';
	this.url = "";
	this.asyncQuery = true;
	this.functionAfter = [];
	this.functionBefore = [];
	this.functionSuccess = [];
	this.functionError = [];
	this.monitors = [];
	this.predicates = [];
	this.params = {};
	this.contentType = 'params';
	this.urlParams = [];
}

function AJAXquery(anotherQuery = undefined) {
	if (anotherQuery === undefined) {
		return new CascadeHTTPQuery();
	}
	else {
		var query = new CascadeHTTPQuery();
		query.type = anotherQuery.type;
		query.dataType = anotherQuery.dataType;
		query.url = anotherQuery.url;
		query.asyncQuery = anotherQuery.asyncQuery;
		query.functionAfter = [].concat(anotherQuery.functionAfter);
		query.functionBefore = [].concat(anotherQuery.functionBefore);
		query.functionSuccess = [].concat(anotherQuery.functionSuccess);
		query.functionError = [].concat(anotherQuery.functionError);
		query.monitors = [].concat(anotherQuery.monitors);
		query.predicates = [].concat(anotherQuery.predicates);
		query.urlParams = [].concat(anotherQuery.urlParams);
		query.params = {};
		for (var attr in anotherQuery.params) {
			query.params[attr] = anotherQuery.params[attr];
		}
		query.contentType = anotherQuery.contentType;
		return query;
	}
}

CascadeHTTPQuery.prototype.POST = function(str) {
	this.type = 'POST';
	this.url = str;
	return this;
}

CascadeHTTPQuery.prototype.GET = function(str) {
	this.type = 'GET';
	this.url = str;
	return this;
}

CascadeHTTPQuery.prototype.PUT = function(str) {
	this.type = 'PUT';
	this.url = str;
	return this;
}

CascadeHTTPQuery.prototype.DELETE = function(str) {
	this.type = 'DELETE';
	this.url = str;
	return this;
}

CascadeHTTPQuery.prototype.async = function(asyncVal = true) {
	this.asyncQuery = asyncVal;
	return this;
}

CascadeHTTPQuery.prototype.raw = function(paramName, paramValue = undefined) {
	this.contentType = 'application/json';
	return this.param(paramName, paramValue);
}

CascadeHTTPQuery.prototype.param = function(paramName, paramValue = undefined) {
	if (paramName !== undefined) {
		if (paramValue === undefined) {
			if (paramName instanceof Array) {
				this.params = paramName;
			} else if (typeof paramName == "object") {
				for (var param in paramName) {
					this.params[param] = paramName[param];
					//this.params.push(param.toString() + "=" + paramName[param].toString());
				}
			}
			else {
				var paramSpliter = paramName.split('=');
				this.params[paramSpliter[0]] = paramSpliter[1];
				//this.params.push(paramName);
			}
		} else {
			this.params[paramName] = paramValue;
			//this.params.push(paramName.toString() + "=" + paramValue.toString());
		}
	}

	return this;
}

CascadeHTTPQuery.prototype.urlParam = function(paramName, paramValue = undefined) {
	if (paramName !== undefined) {
		if (paramValue === undefined) {
			if (typeof paramName == "object") {
				for (var param in paramName) {
					this.urlParams.push(param.toString() + "=" + paramName[param].toString());
				}
			} else {
				this.urlParams.push(paramName);
			}
		} else {
			this.urlParams.push(paramName.toString() + "=" + paramValue.toString());
		}
	}

	return this;
}

CascadeHTTPQuery.prototype.synchronize = function(monitor) {
	if (monitor === undefined || monitor == false){
		this.monitors = [];
	}
	else {
		this.monitors.push(monitor);
	}
	return this;
}

CascadeHTTPQuery.prototype.predicate = function(predicate, after = undefined) {
	if (predicate !== undefined) {
		if (after === undefined){
				this.predicates.push(predicate);
		}
		else {
			this.predicates.push(() => {
				if (predicate())
					return true;
				else {
					after();
					return false;
				}
			});
		}
	}
	return this;
}

CascadeHTTPQuery.prototype.success = function(func, comparator = undefined) {
	if (func !== undefined){
		if (comparator === undefined) {
			this.functionSuccess.push(func);
		}
		else {
			this.functionSuccess.push(function(data) {
				if (comparator(data)) {
					func(data);
				}
			});
		}
	}

	return this;
}

CascadeHTTPQuery.prototype.error = function(func) {
	if (func !== undefined)
		this.functionError.push(func);
	return this;
}

CascadeHTTPQuery.prototype.after = function(func) {
	if (func !== undefined)
		this.functionAfter.push(func);
	return this;
}

CascadeHTTPQuery.prototype.before = function(func) {
	if (func !== undefined)
		this.functionBefore.push(func);
	return this;
}

CascadeHTTPQuery.prototype.send = function() {
	var query = this;

	$.when.apply(this, query.monitors.map(val => val._deferred))
	 .always(function() {

		if (query.predicates.every(p => p()) && query.url != "") {
			var def_monitors = $.ajax({
				dataType: query.dataType,
				type: query.type,
				url: query.url + ((query.urlParams.length > 0) ? "?" + query.urlParams.join("&") : ""),
				async: query.asyncQuery,

				contentType: query.contentType=='params' ? 'application/x-www-form-urlencoded; charset=UTF-8' : query.contentType,
				processData: query.contentType=='params',
				data: (query.contentType=='params') ? query.params : JSON.stringify(query.params),
		
				beforeSend: function(jqXHR, settings) {
					query.functionBefore.reverse().forEach(func => 
						func(jqXHR, settings))
				},
		
				success: function(data) {
					query.functionSuccess.forEach(func => 
						func(data))
				},
		
				error: function(jqXHR, textStatus, errorThrown) {
					query.functionError.forEach(func => 
						func(jqXHR, textStatus, errorThrown))
				},
		
				complete: function(jqXHR, textStatus) {
					query.functionAfter.forEach(func => 
						func(jqXHR, textStatus))
				}
			});
	
			query.monitors.forEach(monitor => 
				monitor._deferred = def_monitors);
		}
	});
}

CascadeHTTPQuery.prototype.getPromise = function() {
	var query = this;

	return new Promise(function(resolve, reject) {
		query.success(data => resolve(data))
			 .error((jqXHR, textStatus, errorThrown) => reject(new Error(textStatus)))
			 .send();
	});
}