function Language() {

    var __construct = function() {
    }()

    this.readLanguageFile = function(lang, callback) {
        if (!lang)
            lang = sessionStorage.getItem("lang");
        
        var xhr = new XMLHttpRequest();
        xhr.open("GET", "lang/" + lang + ".js", true);
        xhr.responseType = "text";
        xhr.onreadystatechange = function() {
            if (xhr.status === 200 && xhr.readyState === 4) {
                var langScript = document.getElementById("languageHeader");
                if (langScript == null) {   /* If language not exists, create new script tag. */
                    langScript = document.createElement("script");
                    langScript.id = "languageHeader";
                }

                langScript.innerHTML = xhr.responseText;
                document.getElementsByTagName("head")[0].appendChild(langScript);

                languageTheDom();
                callback();
            }
        }

        xhr.send(null);
    };

    this.updateLanguage = function(lang) {
        sessionStorage.setItem("lang", lang);
        window.location.reload();
    };

    this.getLanguage = function() {
        return sessionStorage.getItem("lang");
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