/**
 * Created by David on 03/05/2015.
 */

var InfoLangInterop = {
    Rules : [ ],

    Parse : function(source){

        var arr = [];

        for(i=0;i<this.Rules.length;i++){
            arr.push(this.Rules[i].Get(source))
        }

        console.log(arr);
        return arr;
    }
};

var InfoLangRule;
InfoLangRule = {
    Name: "Nome",

    Regex: [
        new RegExp("!n(.*)", "g")
    ],

    Parse : function (txt){
        var data = txt;

        data = data.replace('!n', '');
        data = data.replace('!n', '');
        data = data.replace('!n', '');

        return data;
    },

    Get: function (source) {

        var rez = [];

        for (i = 0; i < this.Regex.length; i++) {
            var matchResult = source.match(this.Regex[i]);

            if(matchResult == undefined)
                continue;

            for(j = 0;j < matchResult.length; j++){
                rez.push(this.Parse(matchResult[j]));
            }
        }

        var unique = [];

        $.each(rez, function(i, el){
            if($.inArray(el, unique) === -1) unique.push(el);
        });

        return unique;
    }
};

InfoLangInterop.Rules.push(InfoLangRule);
console.log(InfoLangInterop.Rules);