const { addvar, existsvar, gettypevar } = require("./io/variable");
const { showerr } = require("./io/err");
const memory = require("../memory");
const { existsarg, gettypearg, existsfunc, getreturntype } = require("./io/func");

function varcreate(tokens){
    if(existsvar(tokens[1][1]))
        showerr("Variable is already defined", "ObjectRedefined");
    if(tokens[2][1] == "="){
        let type = tokens[3][0];
        if(tokens[3][0] == "id"){
            if(existsvar(tokens[3][1]))
                type = gettypevar(tokens[3][1]);
            else if(existsarg(memory.funcname, tokens[3][1])){
                type = gettypearg(memory.funcname, tokens[3][1]);
            }
            else if(tokens[4][1] == "("){
                if(existsfunc(tokens[3][1]))
                    type = getreturntype(tokens[3][1]);
                else
                    showerr(`Function('${tokens[3][1]}') is not defined`, "ObjectNotFound");
            }
            else
                showerr(`Variable('${tokens[3][1]}') is not defined`, "ObjectNotFound");
        }
        if(!memory.types[type])
            showerr(`Invalid value type '${type}'`, "TypeError");
        addvar(tokens[1][1], tokens[3][1], type);
        let args = [];
        for(let i=3; i < tokens.length; i++)
            args.push(tokens[i][1]);
        if(type != "string")
            memory.code.push(`${memory.types[type]} ${tokens[1][1]}${(type == "string") ? "["+memory.maxsizestring+"]" : ""} = ${args.join("")};`);
        else{
            memory.code.push(`${memory.types[type]} ${tokens[1][1]}${(type == "string") ? "["+memory.maxsizestring+"]" : ""};`);
            memory.code.push(`setString(${tokens[1][1]}, ${args.join("")});`);
        }
    } else if(tokens[2][1] == ":") {
        if(!memory.types[tokens[3][1]])
            showerr(`Invalid value type '${tokens[3][1]}'`, "TypeError");
        addvar(tokens[1][1], "0", tokens[3][1]);
        memory.code.push(`${memory.types[tokens[3][1]]} ${tokens[1][1]} = 0;`);
    }
}
function setvar(tokens){
    if(!existsvar(tokens[0][1]))
        showerr(`Variable('${tokens[0][1]}') is not defined`, "ObjectNotFound");
    if(tokens[2][0] == "id"){
        if(existsvar(tokens[2][1])){
            if(gettypevar(tokens[2][1]) != gettypevar(tokens[0][1]))
                showerr(`Unable to convert '${gettypevar(tokens[2][1])}' to '${gettypevar(tokens[0][1])}'`, "TypeError");
        }
        else if(existsarg(tokens[2][1])){
            if(gettypearg(memory.funcname, tokens[2][1]) != gettypevar(tokens[0][1]))
                showerr(`Unable to convert '${gettypearg(memory.funcname, tokens[2][1])}' to '${gettypevar(tokens[0][1])}'`, "TypeError");
        }
        else if(tokens[3][1] == "("){
            if(getreturntype(tokens[2][1]) != gettypevar(tokens[0][1]))
                showerr(`Unable to convert '${getreturntype(tokens[2][1])}' to '${gettypevar(tokens[0][1])}'`, "TypeError");
            if(!existsfunc(tokens[2][1]))
                showerr(`Function('${tokens[2][1]}') is not defined`, "ObjectNotFound");
        }
        else
            showerr(`Variable('${tokens[2][1]}') is not defined`, "ObjectNotFound");
    }
    let args = [];
    for(let i=2; i < tokens.length; i++)
        args.push(tokens[i][1]);
    memory.code.push(`${tokens[0][1]} = ${args.join("")};`);
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