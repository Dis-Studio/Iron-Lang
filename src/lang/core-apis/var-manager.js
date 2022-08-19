const { addvar, existsvar } = require("./io/variable");
const { showerr } = require("./io/err");
const memory = require("../memory");

function varcreate(tokens){
    if(existsvar(tokens[1][1]))
        showerr("Variable is already defined", "ObjectRedefined");
    if(tokens[2][1] == "="){
        addvar(tokens[1][1], tokens[3][1], tokens[3][0]);
        memory.code.push(`${tokens[3][1]} ${tokens[1][1]} = ${tokens[3][1]};`);
    } else if(tokens[2][1] == ":") {
        addvar(tokens[1][1], "0", tokens[3][1]);
        memory.code.push(`${tokens[3][1]} ${tokens[1][1]} = 0;`);
    }
}
function setvar(tokens){
    if(!existsvar(tokens[0][1]))
        showerr(`Variable('${tokens[0][1]}') is not defined`, "ObjectNotFound");
    memory.code.push(`${tokens[1][1]} = ${tokens[3][1]};`);
}
function fixvar(tokens){
    switch(tokens[1][1]){
        case "+":
            if(!existsvar(tokens[0][1]))
                showerr(`Variable('${tokens[0][1]}') is not defined`, "ObjectNotFound");
            memory.code.push(`${tokens[0][1]}++;`);
            break;
    }
}
module.exports = {
    varcreate, setvar, fixvar
};