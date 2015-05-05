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
        return arr;
    }
};