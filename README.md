# RandomizeMe

![](https://david-dm.org/yarkovaleksei/RandomizeMe.svg)

- - -
## Установка

**NPM:**

```bash
$ npm install --save randomizeme
```

**BOWER:**

```bash
$ bower install --save randomizeme
```

**Или можете просто клонировать репозиторий для доработки:**

```bash
$ git clone origin git@github.com:yarkovaleksei/RandomizeMe.git
$ cd RandomizeMe
$ npm install
# Сгенерируем документацию
$ chmod +x jdocs.sh
$ ./jdocs.sh
```

- - -
## Описание

Модуль помогает генерировать случайный текст по заранее заданному шаблону, с помощью JavaScript. 

Изначально разрабатывался для себя, на замену надоевшему **Lorem Ipsum**, но оказался полезен людям, которым по роду деятельности нужно публиковать много объявлений, например о продаже/покупке/сдаче недвижимости.

Все предложения, вопросы, недочеты прошу присылать на адрес: [contact@data-keeper.ru](mailto:contact@data-keeper.ru).

Или можете присоединиться к разработке, дополнив код или открыв [Issue](https://github.com/yarkovaleksei/RandomizeMe/issues).

- - -
## Использование

### Node.js

```javascript
'use strict';

var RandomizeMe = require('randomizeme');

var Randomize = new RandomizeMe();

var options = {
    tags: {
        open: "[[",
        close: "]]"
    },
    actions: {
        number: function(min, max) {
            // Переопределяем встроенный метод number
            return Randomize.tools.Number(min, max);
        },
        choice: function(array, num, mode) {
            // Переопределяем встроенный метод choice
            return Randomize.tools.Choice(array, num, mode);
        },
        names: function() {
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
            let $count = Randomize.render(' по цене [[ number(50, 150) ]] р. за [[ number(1, 10) ]] [[ choice(["кг", "г", "шт"], 1, true) ]]');
            let $array = ["селёдочку", "колбаску", "грибочки", "огурчики"];
            let $index = Randomize.tools.Choice($array);
            return $array[$index] + $count;
        }
    }
};

Randomize.configure(options);

var template = "Нашего директора зовут [[ names ]] и поэтому наш [[ who ]] [[ action ]] вам [[ food ]].";

var result = Randomize.render(template);

console.log(result);
```

### Browser

```javascript
// js/script.js
'use strict';

var Randomize = new RandomizeMe();

var options = {
    tags: {
        open: "[[",
        close: "]]"
    },
    actions: {
        number: function(min, max) {
            // Переопределяем встроенный метод number
            return Randomize.tools.Number(min, max);
        },
        choice: function(array, num, mode) {
            // Переопределяем встроенный метод choice
            return Randomize.tools.Choice(array, num, mode);
        },
        names: function() {
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
            let $count = Randomize.render(' по цене [[ number(50, 150) ]] р. за [[ number(1, 10) ]] [[ choice(["кг", "г", "шт"], 1, true) ]]');
            let $array = ["селёдочку", "колбаску", "грибочки", "огурчики"];
            let $index = Randomize.tools.Choice($array);
            return $array[$index] + $count;
        }
    }
};

Randomize.configure(options);

window.addEventListener("DOMContentLoaded", function(){
    var button = document.getElementById("test");
    var textarea = document.getElementById("text");
    var result = document.getElementById("result");

    button.addEventListener("click", function(){
        var template = textarea.value;
        result.innerHTML = Randomize.render(template);
    });
});
```

```html
<!-- index.html -->
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="utf-8">
    <title>RandomizeMe</title>
    <style>
        .container {
            width: 60%;
            margin: 0 auto;
            text-align: center;
        }
        .container:before {
            content: '';
            display: inline-block;
            height: 100%;
            vertical-align: middle;
        }
        .inner {
            width: 100%;
            display: inline-block;
            vertical-align: middle;
        }
        #result, #text {
            width: 100%;
            max-height: 200px;
            border: 1px solid black;
        }
    </style>
    <script src="node_modules/randomizeme/randomizeme.js"></script>
    <script src="js/script.js"></script>
</head>
<body>
    <div class="container">
        <span class="inner">
            <textarea id="text">Нашего директора зовут [[ names ]] и поэтому наш [[ who ]] [[ action ]] вам [[ food ]].</textarea>
            <input type="button" id="test" value="Сгенерировать текст">
            <div id="result"></div>
        </span>
    </div>
</body>
</html>
```
