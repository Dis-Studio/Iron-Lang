const { showerr } = require("./io/err");
const { addfunc, existsfunc, gettypearg, existsarg, getargid, getmaxargs } = require("./io/func");
const { addvar, existsvar } = require("./io/variable");
const memory = require("./memory");

const { funccreate } = require("./core-apis/func-creation");
const { callfunc } = require("./core-apis/call-func");
const { end } = require("./core-apis/end");
const { varcreate } = require("./core-apis/var-creation");

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
        else if(tokens[0][0] == "id" && tokens[1][1] == "="){
            if(!existsvar(tokens[0][1]))
                showerr(`Variable('${tokens[0][1]}') is not defined`, "ObjectNotFound");
            memory.code.push(`${tokens[1][1]} = ${tokens[3][1]};`);
        } else if(tokens[0][0] == "id" && tokens[1][0] == "assign" && tokens[2][0] == "assign"){
            switch(tokens[1][1]){
                case "+":
                    if(!existsvar(tokens[0][1]))
                        showerr(`Variable('${tokens[0][1]}') is not defined`, "ObjectNotFound");
                    memory.code.push(`${tokens[0][1]}++;`);
                    break;
            }
        } else if(tokens[0][1] == "import") {}
        else
            showerr(`Function('${tokens[0][1]}') is not defined`, "ObjectNotFound");
    });
    if(!existsfunc("main"))
        showerr("Starting function not specified", "SyntaxError");
}
module.exports = {
    run
};