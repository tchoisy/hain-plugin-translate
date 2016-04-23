'use strict';


const got = require('got');

module.exports = (pluginContext) => {
    const shell = pluginContext.shell;
    const toast = pluginContext.toast;

    const args = [
        {"argument" : "-sl" },
        {"argument" : "-tl" },
        {"argument" : "-m" },
    ];

    function search(query, res) {
        const query_trim = query.trim();
        if (query_trim.length == 0) {
            return;
        }

        var queryParse = parseQuery(query_trim);
        res.add({
            id: queryParse,
            payload: 'translate',
            title: 'Translate ' + ((getByArg("m", queryParse) != null)?getByArg("m", queryParse): "your sentence"),
            desc: 'Translate your sentence',
            icon: "#fa fa-language",
        });
        
    }

    function execute(id, payload) {
        
        if (payload == 'translate') {
            var sourceLang = ((getByArg("sl", id) != null)?getByArg("sl", id): "en");
            var targetLang = ((getByArg("tl", id) != null)?getByArg("tl", id): "fr");
            var sourceText = ((getByArg("m", id) != null)?getByArg("m", id): "");
            

            if(sourceText != ""){
                var url = "https://translate.yandex.net/api/v1.5/tr.json/translate?key=trnsl.1.1.20160423T154320Z.a16aa24916c8947b.612925192e37ef98dcbdf46c870ee39edd74d717&text=" +encodeURI(sourceText)+ "&lang="+sourceLang + "-" + targetLang;
                
                got(url)
                .then(response => {
                    var result  = response.body;
                    var data = JSON.parse(result);
                    toast.enqueue(data.text[0], 2500);
                })
                .catch(error => {
                    toast.enqueue("An error has occurred", 2500);
                    toast.enqueue(error.response.body, 2500);
                });
            }else{
                toast.enqueue("You must write a sentence to translate", 2500);
            }
    
        }else{
            return;
        }
    }

    function parseQuery(query){
        var obj = [];
        for(var i=0; i < args.length; i++){
            var pos = query.indexOf(args[i].argument);
            if(pos >= 0) {
                obj.push( {"arg": args[i].argument, "value" : getValue(args[i].argument, query) } );
            }
        }
        if(obj.length == 0){
            obj.push({"arg": "-m", "value" : query });
        }
        return obj; 
    }

    function getValue(arg, query){
        var pos = query.indexOf(arg);
        if(pos != 0){
            query = query.substr(pos, query.length);
        }
        
        query = query.substr(arg.length, query.length);
        query = query.substr(0, posNextArg(query));
        
        return query.trim();
    }

    function posNextArg(query){
        var minPos = query.length;
        for(var i=0; i < args.length; i++){
            var pos = query.indexOf(args[i].argument);
            if(pos >= 0) {
                if(pos < minPos){
                    minPos = pos;
                }
            }
        }
        return minPos;
    }

    function getByArg(arg, parse){
        for(var i=0; i < parse.length; i++){
            if(parse[i].arg == "-"+arg){
                return parse[i].value;
            }
        }
        return null;
    }
    return {search, execute};
};