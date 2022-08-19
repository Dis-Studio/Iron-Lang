const { run } = require("./core");

function lexer(chars){
    let str = "";
    let strskip = false;
    var out = [];
    let ids = [];

    function add(deftype){
        if(str === "")
            return;
        let type = deftype;
        switch(str){
            case "true" || "false":
                type = "boolean";
                break;
            case "=":
                type = "assign";
                break;
            default:
                if(!isNaN(Number(str)))
                    type = "int"
                else if(str.startsWith('"') || str.endsWith('"'))
                    type = "string";
                break;
        }
        ids.push([type, str]);
        str = "";
    }

    chars.forEach(function(char){
        switch(char){
            case '"':
                if(!strskip)
                    add("id")
                strskip = !strskip;
                break;
            case "\n":
                if(!strskip) {
                    add("id");
                    if(ids.length === 1)
                        ids.push(["end", "end"]);
                    if(ids.length > 1)
                        out.push(ids);
                    ids = [];
                }
                return;
            default:
                if(char === " " || char === "(" || char === ")" || char === "{" || char === "}" || char === ":" || char == "," || char == "=" || char == "+" || char == "-" || char == "*" || char == "/") {
                    if(!strskip){
                        add("id");
                        if(char !== " ")
                            ids.push(["assign", char]);
                        return;
                    }
                }
                break;
        }
        str+=char;
    });
    run(out);
}
module.exports = {
    lexer
};