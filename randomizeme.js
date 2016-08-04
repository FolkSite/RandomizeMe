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
	 * @constructor
	 * 
	 * @name RTools
	 */
	var RTools = RTools || (new function() {
		let self = this;

		/**
		 * Метод склеивает переданные в аргументах объекты
		 *
		 * @memberof RTools
		 * 
		 * @method  merge
		 *
		 * @param {...object} args Объекты, которые будут собраны в один и дополнены свойствами друг друга.
		 *
		 * @example {@lang javascript}
		 * var tools = new RTools();
		 * var a = {a:1};
		 * var b = {b:1};
		 * var f = function(){
		 *   this.property = "property";
		 *   this.method = function(){
		 *     return 1;
		 *   };
		 * }
		 * var newObject = tools.merge(a, b, {f: new f()}); 
		 * console.log(newObject); // { a: 1, b: 1, f: { property: 'property', method: [Function] } }
		 * 
		 * @returns {Object}
		 */
		self.merge = function() {
			let $new = {};
			let $args = Array.prototype.slice.call(arguments);
			while ($args.length) {
				let $arg = $args.shift();
				for (let $prop in $arg) {
					if (typeof $arg[$prop] !== 'object') {
						$new[$prop] = $arg[$prop];
					} else if (typeof $arg[$prop] === 'object') {
						$new[$prop] = self.merge($new[$prop], $arg[$prop]);
					}
				}
			}
			$args = null;
			return $new;
		};

		/**
		 * Метод возвращает случайное число в заданном диапазоне
		 *
		 * @memberof RTools
		 * 
		 * @method Number
		 *
		 * @param  {Number} [min=0] Минимальная граница диапазона.
		 * @param  {Number} [max=1] Максимальная граница диапазона.
		 *
		 * @example {@lang javascript}
		 * var tools = new RTools();
		 * var randInt = tools.Number(1, 10); 
		 * console.log(randInt); // Число от 1 до 10 включительно
		 * var randInt = tools.Number(); 
		 * console.log(randInt); // 0 или 1
		 * 
		 * @returns {Object}
		 */
		self.Number = function(min, max) {
			let $min = (min && typeof(min) === 'number') ? min : 0;
			let $max = (max && typeof(max) === 'number') ? max : 1;
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
		 * @param  {Array} [array=[]] Последовательность элементов (Array или Object)
		 * @param  {Number} [num=1] Количество случайных индексов последовательности. По-умолчанию 1.
		 * @param  {Boolean} [mode=false] Если true, то вернется не индекс, а значение элемента массива. По-умолчанию false.
		 *
		 * @example {@lang javascript}
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
		 * @returns {Number|Array|String}
		 */
		self.Choice = function(array, num, mode) {
			let $mode = (mode && typeof(mode) === 'boolean') ? mode : false;
			let $count = (num && typeof(num) === 'number') ? +num : 1;
			let $_keys = (array && Array.isArray(array)) ? Object.keys(array) : [];

			switch ($count) {
				case isNaN($count):
				case $count < 1:
					$count = 1;
					break;
				case $count > $_keys.length:
					$count = $_keys.length;
					break;
			}

			for (let i = 0; i < $_keys.length; i++) {
				let j = Math.floor(Math.random() * (i + 1));

				let tmp = $_keys[j];
				$_keys[j] = $_keys[i];
				$_keys[i] = tmp;
			}
			if ($mode === false) {
				return $count === 1 ? $_keys[0] : $_keys.slice(0, $count);
			}

			if ($count === 1) {
				return array[$_keys[0]];
			}

			let $keys = $_keys.slice(0, $count);
			let $tmp = [];
			while ($keys.length) {
				let $key = $keys.shift();
				$tmp.push(array[$key]);
				$key = null;
			}
			$keys = null;
			return $tmp;
		};
	});

	/**
	 * Основной класс модуля. Предоставляет интерфейс для конфигурирования и рендеринга шаблона текста.
	 *
	 * @constructor
	 * 
	 * @name RandomizeMe
	 * 
	 * @param   {Object} [options] Объект конфигурации. Можно передать его позже, через метод configure.
	 */
	var RandomizeMe = RandomizeMe || (function(options) {
		let self = this;

		/**
		 * Объект конфигурации. По-умолчанию приватное свойство.
		 * Доступно только расширение объекта через метод [RandomizeMe.configure]{@link RandomizeMe.configure}
		 *
		 * @private
		 * 
		 * @memberof RandomizeMe
		 *
		 * @name options
		 *
		 * @type {Object}
		 * 
		 * @namespace RandomizeMe.options
		 */
		self.options = {

			/**
			 * Открывающий и закрывающий теги для поиска вставок в шаблоне.
			 *
			 * @memberof RandomizeMe.options
			 * 
			 * @namespace RandomizeMe.options.tags
			 * 
			 * @type {Object}
			 */
			tags: {
				/**
				 * Открывающий тег шаблона.
				 * 
				 * @memberof RandomizeMe.options.tags
				 *
				 * @name open
				 *
				 * @default {String} {{
				 * 
				 * @type {String}
				 */
				open: "{{",

				/**
				 * Закрывающий тег шаблона.
				 *
				 * @memberof RandomizeMe.options.tags
				 *
				 * @name close
				 * 
				 * @default {String} }}
				 * 
				 * @type {String}
				 */
				close: "}}"
			},

			/**
			 * Функции, имена которых нужно будет вставлять в шаблон. Функции могут принимать аргументы. По-умолчанию имеет два метода: number и choice.
			 *
			 * @memberof RandomizeMe.options
			 * 
			 * @namespace RandomizeMe.options.actions
			 * 
			 * @type {Object}
			 */
			actions: {
				/**
				 * Метод принимает два аргумента: min и max и возвращает случайное число в указанном диапазоне. [Подробнее]{@link RTools.Number}.
				 *
				 * @memberof RandomizeMe.options.actions
				 * 
				 * @method  number
				 *
				 * @param   {Number} [min=0] Нижняя граница диапазона.
				 * @param   {Number} [max=1] Верхняя граница диапазона.
				 *
				 * @example {@lang javascript}
				 * var RandomizeMe = require('randomizeme');
				 * var Randomize = new RandomizeMe();
				 * var randInt = Randomize.tools.Number(1, 10); 
				 * console.log(randInt); // Число от 1 до 10 включительно
				 * var randInt = Randomize.tools.Number(); 
				 * console.log(randInt); // 0 или 1
				 * 
				 * @returns {Number}     Случайное число в указанном диапазоне
				 */
				number: function(min, max) {
					return RTools.Number(min, max);
				},

				/**
				 * Метод возвращает случайный индекс или элемент массива. [Подробнее]{@link RTools.Choice}.
				 *
				 * @memberof RandomizeMe.options.actions
				 * 
				 * @method  choice
				 *
				 * @param  {Array} [array=[]] Последовательность элементов (Array или Object).
				 * @param  {Number} [num=1] Количество случайных индексов последовательности.
				 * @param  {Boolean} [mode=false] Если true, то вернется не индекс, а значение элемента массива.
				 * 
				 * @example {@lang javascript}
				 * var RandomizeMe = require('randomizeme');
				 * var Randomize = new RandomizeMe();
				 * var randIndex = Randomize.tools.Choice(['one', 'two', 'three'], 1, false);
				 * console.log(randIndex); // 1
				 * var randIndexes = Randomize.tools.Choice(['one', 'two', 'three'], 2);
				 * console.log(randIndexes); // [1, 3]
				 * var randValue = Randomize.tools.Choice(['one', 'two', 'three'], 1, true);
				 * console.log(randValue); // three
				 * 
				 * @returns {Number|Array|String}
				 */
				choice: function(array, num, mode) {
					return RTools.Choice(array, num, mode);
				}
			}
		};

		/**
		 * Метод принимает один аргумент - новый объект конфигурации и расширяет его свойствами дефолтный.
		 *
		 * @memberof RandomizeMe
		 * 
		 * @method  configure
		 *
		 * @example {@lang javascript}
		 * var RandomizeMe = require('randomizeme');
		 * var Randomize = new RandomizeMe();
		 * var options = {
		 *     tags: {
		 *         open: "[[",
		 *         close: "]]"
		 *     },
		 *     actions: {
 		 *        number: function(min, max) {
 		 *            return Randomize.tools.Number(min, max);
 		 *        },
		 *        choice: function(array, num, mode) {
		 *            return Randomize.tools.Choice(array, num, mode);
		 *        }
		 *     }
		 * }
		 * Randomize.configure(options);
		 * 
		 * @param   {Object}  [options={}] Новый объект конфигурации
		 */
		self.configure = function(options) {
			self.options = RTools.merge(self.options, options || {});
		};

		/**
		 * Метод обрабатывает шаблон, содержащий вставки вида {{ action_name() }}, и возвращает строку с измененными данными.
		 *
		 * @memberof RandomizeMe
		 * 
		 * @method  render
		 *
		 * @example {@lang javascript}
		 * var RandomizeMe = require('randomizeme');
		 * var Randomize = new RandomizeMe();
		 * var options = {
		 *     tags: {
		 *         open: "[[",
		 *         close: "]]"
		 *     },
		 *     actions: {
 		 *        number: function(min, max) {
 		 *            return Randomize.tools.Number(min, max);
 		 *        },
		 *        choice: function(array, num, mode) {
		 *            return Randomize.tools.Choice(array, num, mode);
		 *        }
		 *     }
		 * }
		 * Randomize.configure(options);
		 * var template = "Random int: [[ number(1, 10) ]]. Random array value: [[ choice(['one', 'two', 'three'], 1, true) ]].";
		 * var result = Randomize.render(template);
		 * console.log(result); // Random int: 5. Random array value: one.
		 * 
		 * @param   {String} [template=""] Строка со вставками вида {{ action_name() }}
		 *
		 * @returns {String}
		 */
		self.render = function(template) {
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

		if (options) {
			self.configure(options);
		}
		options = null;

		return {
			configure: self.configure,
			render: self.render,
			tools: RTools
		};
	});

	return RandomizeMe;
}));