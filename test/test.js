'use strict';

var RandomizeMe = require('../index');

var Randomize = new RandomizeMe();

var options = {
	tags: {
		open: "[[",
		close: "]]"
	},
	actions: {
		number: function(min, max) {
			return Randomize.tools.Number(min, max);
		},
		choice: function() {
			return Randomize.tools.Choice(...arguments);
		},
		objects: function() {
			let $array = [{
				name: "Федор"
			}, {
				name: "Акакий"
			}, {
				name: "Феоктист"
			}, {
				name: "Иван"
			}];
			let $value = Randomize.tools.Choice($array, 1, true);
			return $value.name;
		},
		who: function() {
			let $array = ["сайт", "проект", "магазин", "дурдом"];
			let $index = Randomize.tools.Choice($array);
			return $array[$index];
		},
		action: function() {
			let $array = ["предлагает", "рекомендует", "советует", "навязывает"];
			let $value = Randomize.tools.Choice($array, 1, true);
			return $value;
		},
		food: function() {
			let $count = Randomize.render(' по цене [[ number(50, 150) ]] р. за [[ number(1, 10) ]] [[ choice(["кг", "г"],1,true) ]]');
			let $array = ["селёдочку", "колбаску", "грибочки", "огурчики"];
			let $index = Randomize.tools.Choice($array);
			return $array[$index] + $count;
		}
	}
}

Randomize.configure(options);

var template = "Нашего директора зовут [[ objects ]] и поэтому наш [[ who ]] [[ action ]] вам [[ food ]].";

var result = Randomize.render(template);

console.log(result);