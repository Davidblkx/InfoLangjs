/**
 * Created by David on 04/05/2015.
 */

PrototypeRule = function(){
  return {

      Name: "RuleName",

      Regex: [],

      Parse: function(stringSource){
          return stringSource;
      }

  };
};

InfoLangSimpleRule = function(name, startRule, endRule) {

    var rule = new PrototypeRule();

    rule.Name = name;

    rule.Regex.push(new RegExp(startRule + "(.*)" + endRule, "g"));

    rule.Parse = function(stringSource){
        var rez = [];

        for (i = 0; i < this.Regex.length; i++) {
            var matchResult = stringSource.match(this.Regex[i]);

            if(matchResult == undefined)
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

        var unique = [];

        $.each(rez, function(i, el){
            if($.inArray(el, unique) === -1) unique.push(el);
        });

        rez = [];
        for(i=0; i<unique.length;i++){
            var obj = JSON.parse('{"'+rule.Name+'":"'+unique[i]+'"}');
            rez.push(obj);
        }

        return rez;
    };

    return rule;
};

InfoLangMultiRule = function(name, startRule, separator, endRule){
    var rule = new PrototypeRule();
    rule.Name = name;
    rule.Regex.push(new RegExp(startRule + "(.*)" + separator + "([0-9])+", "g"));

    rule.Parse = function(stringSource){
        var rez = [];

        for (i = 0; i < this.Regex.length; i++) {
            var matchResult = stringSource.match(this.Regex[i]);

            if(matchResult == undefined)
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

        if(rez.length == 0)
            return rez;

        var unique = [];

        $.each(rez, function(i, el){
            if($.inArray(el, unique) === -1) unique.push(el);
        });

        rez = [];
        for(i=0; i<unique.length;i++){

            var str = unique[i];
            var name = str.substring(startRule.length, str.indexOf(';'));
            var nums = str.substring(str.indexOf(';')+1).split(';');

            var obj = JSON.parse('{"'+rule.Name+'":"'+name+'", "Values": ' + JSON.stringify(nums) + '}');
            rez.push(obj);
        }

        return rez;
    };

    return rule;
};

InfoLangInterop.Rules.push(new InfoLangSimpleRule("Nome", '!n', ''));
InfoLangInterop.Rules.push(new InfoLangMultiRule("Contactos", '#', ';', ''));