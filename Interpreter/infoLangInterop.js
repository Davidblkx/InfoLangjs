/**
 * Created by David on 03/05/2015.
 */

var InfoLangInterop = {
    Rules : [ ],

    Parse : function(source){

        var arr = [];

        for(v=0;v<this.Rules.length;v++){
            arr.push(this.Rules[v].Parse(source))
        }

        var ptp = '{';

        for(v=0;v<arr.length;v++){

            var txt = JSON.stringify(arr[v]);
            txt = txt.substring(1, txt.length-1);

            if(v>0)
                txt = ',' + txt;

            ptp += txt;
        }

        ptp += '}';

        return JSON.parse(ptp);
    },

    SetWatchOn : function(elemId, viewElemId , onInput){

        var elem = document.getElementById(elemId);
        var sourceRules = this.Rules;
        elem.addEventListener("input", function(){

            var DATA = InfoLangInterop.Parse(elem.value);

            if(viewElemId != undefined) {
                var view = document.getElementById(viewElemId);
                while (view.hasChildNodes()) {
                    view.removeChild(view.lastChild);
                }

                for (var ruleId = 0; ruleId < sourceRules.length; ruleId++) {
                    view.appendChild(sourceRules[ruleId].BuildElement(DATA));
                }
            }

            if(onInput != undefined)
                onInput(DATA);

        });
    }
};