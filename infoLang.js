/**
 * Created by David on 03/05/2015.
 */

var InfoLangInterop = {
    Rules : [ ],

    Parse : function(source){

        var arr = [];

        for(v=0;v<this.Rules.length;v++){
            arr.push(this.Rules[v].Parse(source));
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

            if(viewElemId !== undefined) {
                var view = document.getElementById(viewElemId);
                while (view.hasChildNodes()) {
                    view.removeChild(view.lastChild);
                }

                for (var ruleId = 0; ruleId < sourceRules.length; ruleId++) {
                    view.appendChild(sourceRules[ruleId].BuildElement(DATA));
                }
            }

            if(onInput !== undefined)
                onInput(DATA);

        });
    }
};

PrototypeRule = function(){
  return {

      Name: "RuleName",
      Key: "",
      Value: "",

      Regex: [],

      Parse: function(stringSource){
          return stringSource;
      },

      BuildElement : function(objData){
          return document.createElement('div');
      }

  };
};
InfoLangSimpleRule = function(name, startRule, endRule) {

    var rule = new PrototypeRule();
    rule.Name = name;
    rule.Regex.push(new RegExp(startRule + "(.*)" + endRule, "g"));

    rule.Parse = function(stringSource){
        var rez = [];

        //Get items from source string
        for (var i = 0; i < this.Regex.length; i++) {
            var matchResult = stringSource.match(this.Regex[i]);

            if(matchResult === undefined)
                continue;

            for(j = 0;j < matchResult.length; j++){

                var data = matchResult[j];
                data = data.replace(startRule, '');
                data = data.replace(endRule, '');

                while(data.charAt(0) == ' ')
                    data = data.substring(1);

                while(data.length > 3 && data.charAt(data.length-1) == ' ')
                    data = data.substring(0, data.length-1);

                rez.push(data);
            }
        }

        //If no item is parsed, an empty object is returned
        if(rez.length === 0)
            return (JSON.parse('{"' + rule.Name + '" : []}'));

        //remove repeated items
        var unique = [];
        for(var itmId = 0; itmId < rez.length; itmId++){

            var item = rez[itmId];
            var hasItem = false;
            for(hasId = 0; hasId < unique.length; hasId++){
                if(unique[hasId] === item){
                    hasItem = true;
                    break;
                }
            }

            if(!hasItem){
                unique.push(item);
            }

        }

        //Build Object
        var result = '{ "' + rule.Name +'" : ' + JSON.stringify(unique) + '}';
        return JSON.parse(result);
    };

    rule.BuildElement = function(objData){

        var rootDiv = document.createElement('div');
        rootDiv.setAttribute("data-IL-Id", rule.Name);
        rootDiv.className = "iL-View iL-ViewSR";

        var titleH1 = document.createElement('H1');
        titleH1.innerHTML = rule.Name;
        titleH1.className = "iL-ViewItem iL-ViewItemSR iL-ViewItemSR-Title";

        rootDiv.appendChild(titleH1);

        var arr = objData[rule.Name];
        for(var i=0; i < arr.length; i++){
            var valueDiv = document.createElement('div');
            valueDiv.setAttribute("data-IL-SR-ItemIndex", i);
            valueDiv.className = "iL-ViewItem iL-ViewItemSR iL-ViewItemSR-ValueHost";

            var valueInput = document.createElement('input');
            valueInput.type = "text";
            valueInput.setAttribute("data-IL-SR-ItemIndex", i);
            valueInput.className = "iL-ViewItem iL-ViewItemSR iL-ViewItemSR-Value";
            valueInput.value = arr[i];

            valueDiv.appendChild(valueInput);
            rootDiv.appendChild(valueDiv);
        }

        return rootDiv;
    };

    return rule;
};
InfoLangMultiRule = function(name, key, value,  startRule, separator, endRule){

    var rule = new PrototypeRule();
    rule.Name = name;
    rule.Key = key;
    rule.Value = value;
    rule.Regex.push(new RegExp(startRule + "(.*)" + separator + "([0-9])+" + endRule, "g"));

    rule.Parse = function(stringSource){

        //Parse items from source string
        var rez = [];
        for (i = 0; i < this.Regex.length; i++) {
            var matchResult = stringSource.match(this.Regex[i]);

            if(matchResult === undefined)
                continue;

            for(j = 0;j < matchResult.length; j++){

                var data = matchResult[j];

                while(data.charAt(0) == ' ')
                    data = data.substring(1);

                while(data.length > 3 && data.charAt(data.length-1) == ' ')
                    data = data.substring(0, data.length-1);

                rez.push(data);
            }
        }

        //If no item is parsed, an empty object is returned
        if(rez.length === 0)
            return JSON.parse('{"' + rule.Name + '" : ' + JSON.stringify(rez) + '}');

        //remove repeated items
        var unique = [];
        for(var itmId = 0; itmId < rez.length; itmId++){

            var item = rez[itmId];
            var hasItem = false;
            for(hasId = 0; hasId < unique.length; hasId++){
                if(unique[hasId] === item){
                    hasItem = true;
                    break;
                }
            }

            if(!hasItem){
                unique.push(item);
            }

        }

        //Build object from items
        rez = [];
        for(i=0; i<unique.length;i++){

            var str = unique[i];
            var name = str.substring(startRule.length, str.indexOf(';'));
            var nums = str.substring(str.indexOf(';')+1).split(';');

            var obj = JSON.parse('{ "'+ key + '" : "'+name+'", "' + value + '" : ' + JSON.stringify(nums) + '}');
            rez.push(obj);
        }

        return JSON.parse('{"' + rule.Name + '" : ' + JSON.stringify(rez) + '}');
    };

    rule.BuildElement = function(objData){

        var rootDiv = document.createElement('div');
        rootDiv.setAttribute("data-IL-Id", rule.Name);
        rootDiv.className = "iL-View iL-ViewMR";

        var titleH1 = document.createElement('H1');
        titleH1.innerHTML = rule.Name;
        titleH1.className = "iL-ViewItem iL-ViewItemMR iL-ViewItemMR-Title";

        rootDiv.appendChild(titleH1);

        var arr = objData[rule.Name];
        for(var i=0; i < arr.length; i++){

            var Key = arr[i][rule.Key];
            var Values = arr[i][rule.Value];

            var keyDiv = document.createElement('div');
            keyDiv.setAttribute("data-IL-MR-Key", key);
            keyDiv.className = "iL-ViewItem iL-ViewItemMR iL-ViewItemMR-Host";

            var titleH3 = document.createElement('H3');
            titleH3.innerHTML = Key;
            titleH3.className = "iL-ViewItem iL-ViewItemMR iL-ViewItemMR-SubTitle";

            keyDiv.appendChild(titleH3);

            for(var valId=0; valId < Values.length; valId++){
                var valueDiv = document.createElement('div');
                valueDiv.setAttribute("data-IL-MR-ItemIndex", valId);
                valueDiv.className = "iL-ViewItem iL-ViewItemMR iL-ViewItemMR-ValueHost";

                var valueInput = document.createElement('input');
                valueInput.type = "text";
                valueInput.setAttribute("data-IL-MR-ItemIndex", valId);
                valueInput.className = "iL-ViewItem iL-ViewItemMR iL-ViewItemMR-Value";
                valueInput.value = Values[valId];

                valueDiv.appendChild(valueInput);
                keyDiv.appendChild(valueDiv);
            }


            rootDiv.appendChild(keyDiv);
        }

        return rootDiv;
    };

    return rule;
};