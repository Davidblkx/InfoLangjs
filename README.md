# InfoLangJS #

Framework to convert text to Objects

### Example ###

`var conRule =  new InfoLangSimpleRule("Names", '!n', '');`

`InfoLangInterop.Rules.push(conRule);`

`InfoLangInterop.SetWatchOn("TextArea-ClientInput", "", callback);`

`var callback = function(obj){alert(obj.Names[0]);}`

Now when you enter !n MySuperName, an object is returned:
`{Names : ["MySuperName"]}`