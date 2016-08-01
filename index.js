;
(function(root, factory) {
	if (typeof exports === "object") {
		// CommonJS
		module.exports = exports = factory();
	} else if (typeof define === "function" && define.amd) {
		// AMD
		define([], factory);
	} else {
		// Global (browser)
		root.RandomizeMe = factory();
	}
}(this || window, function() {

	'use strict';

	/**
	 * Класс содержит методы для работы со случайными числами и последовательностями
	 *
	 * @name RTools
	 */
	var RTools = (new function() {
		let self = this;

		/**
		 * Метод склеивает переданные в аргументах объекты
		 *
		 * @memberof RTools
		 * 
		 * @method  merge
		 *
		 * @example
		 * var tools = new RTools();
		 * var a = {a:1};
		 * var b = {b:1};
		 * var f = new function(){
		 *   this.property = "property";
		 *   this.method = function(){
		 *     return 1;
		 *   };
		 * }
		 * var newObject = tools.merge(a, b, f); 
		 * console.log(newObject); // {a:1, b:1, property: 'property', method: [Function]}
		 * 
		 * @returns {Object}
		 */
		self.merge = function() {
			let $newObject = {};
			let $args = Array.prototype.slice.call(arguments);
			while ($args.length) {
				let $arg = $args.shift();
				if (!!$arg && (typeof $arg == 'object' || typeof $arg == 'function')) {
					$newObject = Object.assign($newObject, $arg);
				}
				$arg = null;
			}
			$args = null;
			return $newObject;
		};

		/**
		 * Метод возвращает случайное число в заданном диапазоне
		 *
		 * @memberof RTools
		 * 
		 * @method Number
		 *
		 * @param  {Number} _min Минимальная граница диапазона. По-умолчанию 0.
		 * @param  {Number} _max Максимальная граница диапазона. По-умолчанию 1.
		 *
		 * @example
		 * var tools = new RTools();
		 * var randInt = tools.Number(1, 10); 
		 * console.log(randInt); // Число от 1 до 10 включительно
		 * 
		 * @returns {Object}
		 */
		self.Number = function(_min, _max) {
			let $min = (_min && typeof(_min) === 'number') ? _min : 0;
			let $max = (_max && typeof(_max) === 'number') ? _max : 1;
			let $randInt = parseInt(Math.floor(Math.random() * ($max - $min)) + $min + 1);
			return $randInt;
		};

		/**
		 * Метод возвращает случайный индекс последовательности _array.
		 * Если передан аргумент _num, то вернется массив случайных 
		 * индексов последовательности _array в количестве _num элементов.
		 *
		 * @memberof RTools
		 * 
		 * @method Choice
		 *
		 * @param  {Array} _array Последовательность элементов (Array или Object)
		 * @param  {Number} _num Количество случайных индексов последовательности. По-умолчанию 1.
		 * @param  {Boolean} _mode Если true, то вернется не индекс, а значение элемента массива. По-умолчанию false.
		 *
		 * @example
		 * var tools = new RTools();
		 * var arr = ["один", "два", "три", "четыре"];
		 * var randIndex = tools.Choice(arr); 
		 * console.log(randInt); // 2
		 * var randIndexes = tools.Choice(arr, 2); 
		 * console.log(randInt); // [1, 3]
		 * var randValue = tools.Choice(arr, 1, true); 
		 * console.log(randValue); // три
		 * var randValues = tools.Choice(arr, 3, true); 
		 * console.log(randValue); // три, один, четыре
		 * 
		 * @returns {Number,Array}
		 */
		self.Choice = function(_array, _num, _mode) {
			let mode = (_mode && typeof(_mode) === 'boolean') ? _mode : false;
			let num = (_num && typeof(_num) === 'number') ? +_num : 1;
			let keys = (_array && Array.isArray(_array)) ? Object.keys(_array) : [];

			switch(num){
				case isNaN(num):
				case num < 1:
					num = 1;
					break;
				case num > keys.length:
					num = keys.length;
					break;
			}

			for (let i = 0; i < keys.length; i++) {
				let j = Math.floor(Math.random() * (i + 1));

				let tmp = keys[j];
				keys[j] = keys[i];
				keys[i] = tmp;
			}
			if (mode === false) {
				return num === 1 ? keys[0] : keys.slice(0, num);
			}

			if (num === 1) {
				return _array[keys[0]];
			}

			let $keys = keys.slice(0, num);
			let $tmp = [];
			while ($keys.length) {
				let $key = $keys.shift();
				$tmp.push(_array[$key]);
				$key = null;
			}
			$keys = null;
			return $tmp;
		};
	});

	/**
	 * Основной класс модуля. Предоставляет интерфейс для конфигурирования и рендеринга шаблона текста.
	 *
	 * @name RandomizeMe
	 *
	 * @property {Object} options Объект конфигурации.
	 * @property {Object} options.tags Открывающий и закрывающий теги для поиска вставок в шаблоне.
	 * @property {String} options.tags.open Открывающий тег. По-умолчанию '{{'.
	 * @property {String} options.tags.close Закрывающий тег. По-умолчанию '}}'.
	 * @property {Object} options.actions Функции, имена которых нужно будет вставлять в шаблон. Функции могут принимать аргументы. По-умолчанию имеет два метода: number и choice.
	 * 
	 * @param   {Object) _options Объект конфигурации. Можно передать его позже, через метод configure.
	 */
	var RandomizeMe = RandomizeMe || (function(_options) {
		let self = this;

		self.options = {
			tags: {
				open: "{{",
				close: "}}"
			},
			actions: {
				/**
				 * Метод принимает два аргумента: min и max и возвращает случайное число в указанном диапазоне.
				 *
				 * @link{RTools.Number}
				 *
				 * @method  number
				 *
				 * @param   {Number} min Нижняя граница диапазона. По-умолчанию 0.
				 * @param   {Number} max Верхняя граница диапазона. По-умолчанию 1.
				 *
				 * @returns {Number}     Случайное число в указанном диапазоне
				 */
				number: function(min, max) {
					return (min, max) => RTools.Number(...arguments);
				},
				/**
				 * Метод возвращает случайный индекс или элемент массива.
				 *
				 * @link{RTools.Choice}
				 *
				 * @method  choice
				 *
				 * @param  {Array} array Последовательность элементов (Array или Object)
				 * @param  {Number} num Количество случайных индексов последовательности. По-умолчанию 1.
				 * @param  {Boolean} mode Если true, то вернется не индекс, а значение элемента массива. По-умолчанию false.
				 * 
				 * @returns {Number,Array}
				 */
				choice: function(array, num, mode) {
					return (array, num, mode) => RTools.Choice(...arguments);
				}
			}
		};

		self.configure = function (_options) {
			let options = _options || {};
			self.options = RTools.merge(self.options, options || {});
			return self;
		};

		self.render = function (template) {
			let sentence = (template && typeof template === 'string') ? template : "";
			let openTag = "\\" + self.options.tags.open.split('').join("\\");
			let closeTag = "\\" + self.options.tags.close.split('').join("\\");
			let searchRegexp = new RegExp(`${openTag}(.+?)${closeTag}`, "g");
			let occurrences = template.match(searchRegexp);

			if (occurrences && occurrences.length) {
				for (let i = 0, len = occurrences.length; i < len; i++) {
					let action = occurrences[i]
						.replace(self.options.tags.open, '')
						.replace(self.options.tags.close, '')
						.trim();
					let result = '';
					if (action.match(/\((.*)\)/)) {
						try {
							result = eval(`self.options.actions.${action}`);
						} catch (e) {}
					} else {
						if (self.options.actions[action]) {
							result = self.options.actions[action]();
						} else {
							result = occurrences[i];
						}
					}
					sentence = sentence.replace(occurrences[i], result);
				}
			}
			return sentence;
		};

		if (_options) {
			self.configure(_options);
		}
		_options = null;

		return {
			configure: self.configure,
			render: self.render,
			tools: RTools
		};

	});

	return RandomizeMe;

}));