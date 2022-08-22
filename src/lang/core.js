const { showerr } = require("./core-apis/io/err");
const { existsfunc } = require("./core-apis/io/func");

const { funccreate } = require("./core-apis/func-creation");
const { callfunc } = require("./core-apis/call-func");
const { end } = require("./core-apis/end");
const { varcreate, setvar, fixvar } = require("./core-apis/var-manager");

function run(tokenlist){
    tokenlist.forEach(function(tokens){
        if(tokens[0][0] === "id" && tokens[1][1] === "(")
            callfunc(tokens);
        else if(tokens[0][0] == "id" && tokens[1][0] == "id" && tokens[2][1] == "(")
            funccreate(tokens);
        else if(tokens[0][1] == "end")
            end(tokens);
        else if(tokens[0][1] == "var" && tokens[1][0] == "id")
            varcreate(tokens);
        else if(tokens[0][0] == "id" && tokens[1][1] == "=")
            setvar(tokens);
        else if(tokens[0][0] == "id" && tokens[1][0] == "assign" && tokens[2][0] == "assign")
            fixvar(tokens);
        else if(tokens[0][1] == "import"){}
        else
            showerr(`Function('${tokens[0][1]}') is not defined`, "ObjectNotFound");
    });
    if(!existsfunc("main"))
        showerr("Starting function not specified", "ObjectError");
}
module.exports = {
    run
};