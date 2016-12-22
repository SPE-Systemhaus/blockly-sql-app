function Language() {
    var lang = null;

    var __construct = function() {
        if (!localStorage.getItem("lang"))
            localStorage.setItem("lang", SQLBlockly.LANG);
        
        lang = localStorage.getItem("lang");
    }()

    this.readLanguageFile = function(callback) {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", "lang/" + lang + ".js", true);
        xhr.responseType = "text";
        xhr.onreadystatechange = function() {
            if (xhr.status === 200 && xhr.readyState === 4) {
                var SQLLang = xhr.responseText;
                var langScript = document.getElementById("languageHeader");
                if (langScript == null) {   /* If language not exists, create new script tag. */
                    langScript = document.createElement("script");
                    langScript.id = "languageHeader";
                }
           
                var xh = new XMLHttpRequest();
                xh.open("GET", SQLBlockly.BLOCKLY_PATH + "msg/js/" + lang + ".js", true);
                xh.responseType = "text";
                xh.onreadystatechange = function() {
                    if (xh.status === 200 && xh.readyState === 4) {
                        langScript.innerHTML = SQLLang + xh.responseText;
                        document.getElementsByTagName("head")[0].appendChild(langScript);

                        languageTheDom();
                        callback();
                    }
                }
                xh.send(null);
            }
        }
        xhr.send(null);
    };

    this.updateLanguage = function(lang) {
        localStorage.setItem("lang", lang);
        window.location.reload();
    };

    this.getLanguage = function() {
        return localStorage.getItem("lang");
    };

    this.updateLanguageSelect = function() {
        var select = document.getElementById("languageSelect");

        /* Clearing old entries */
        while(select.firstChild) {
            select.removeChild(select.firstChild);
        }

        for (var langKey in SQLBlocks.Msg.languages) {
            var lang = SQLBlocks.Msg.languages[langKey];
            var option = document.createElement("option");
            option.value = langKey;
            option.innerHTML = lang;

            if (langKey === this.getLanguage())
                option.selected = "selected";

            select.appendChild(option);
        }
    };

    var languageTheDom = function() {
        assignToClass("innerHTML");
        assignToClass("title");
        assignToClass("value");
    }.bind(this);

    var assignToClass = function(type) {
        for (var key in SQLBlocks.Msg.html[type]) {
            var classes = document.getElementsByClassName(key);
            if (classes)
                for (var cCnt = 0; cCnt < classes.length; cCnt++)
                    classes[cCnt][type] = SQLBlocks.Msg.html[type][key];
        }
    }.bind(this);
}