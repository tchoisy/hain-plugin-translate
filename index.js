'use strict';


const got = require('got');

module.exports = (pluginContext) => {
    const shell = pluginContext.shell;
    const toast = pluginContext.toast;

 


    function search(query, res) {
        const query_trim = query.trim();
        if (query_trim.length == 0) {
            return;
        }
        res.add({
            id: query_trim,
            payload: 'translate',
            title: 'Search ' + query_trim,
            desc: 'Translate your sentence EN => FR'
        });
    }

    function execute(id, payload) {
        
        if (payload == 'translate') {
            var sourceLang = 'en';
            var targetLang = 'fr';
            var sourceText = id;
             var url = "https://translate.googleapis.com/translate_a/t?client=t&sl=" 
                    + sourceLang + "&tl=" + targetLang + "&dt=t&q=" + encodeURI(sourceText);
  
            got(url)
                .then(response => {
                    var result  = response.body;
                    toast.enqueue(result, 4000);
                })
                .catch(error => {
                    toast.enqueue("An error was occured", 2500);
                });

        }else{
            return;
        }
    }

    return {search, execute};
};