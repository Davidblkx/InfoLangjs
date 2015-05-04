/**
 * Created by David on 03/05/2015.
 */

var InfoLangInterop = {
    Rules : [ ],

    Parse : function(source){

        var arr = [];

        for(i=0;i<this.Rules.length;i++){
            arr.push(this.Rules[i].Parse(source))
        }

        console.log(arr);
        return arr;
    }
};