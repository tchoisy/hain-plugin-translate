'use strict';

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
            desc: 'Translate your sentence'
        });
    }

    function execute(id, payload) {
        
        if (payload == 'translate') {
            var sourceLang = 'en';
            var targetLang = 'fr';
            var sourceText = 'hello';
             var url = "https://translate.googleapis.com/translate_a/single?client=gtx&sl=" 
                    + sourceLang + "&tl=" + targetLang + "&dt=t&q=" + encodeURI(sourceText);
  
            // var result = JSON.parse(UrlFetchApp.fetch(url).getContentText());
  
            // var translatedText = result[0][0][0];
            toast.enqueue(sourceText, 2500);



            var req = new XMLHttpRequest();
            req.open('GET', url, true);
            req.onreadystatechange = function (aEvt) {
                toast.enqueue('change', 2500);
              if (req.readyState == 4) {
                 if(req.status == 200)
                  // dump(req.responseText);
                   toast.enqueue('good', 2500);
                 else
                     toast.enqueue('bad', 2500);
                  // dump("Erreur pendant le chargement de la page.\n");
              }
            };
            req.send(null);
        }else{
            return;
        }
    }

    return {search, execute};
};