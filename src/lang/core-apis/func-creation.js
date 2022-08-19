const memory = require("../memory");
const { showerr } = require("../io/err");
const { addfunc, existsfunc, gettypearg, existsarg, getreturntype } = require("../io/func");

function funccreate(tokens){
    if(existsfunc(tokens[1][1]))
        showerr(`Function '${tokens[1][1]}' is redefined`, "ObjectRedefined");
    let args = [];
    let argstype = [];
    let length = tokens.length;
    if(tokens[length] === ")")
        length--;
    let funcisreturned = false;
    let returnvalue = [];
    for(let i=3; i < length; i++){
        if(tokens[i][1] === ",")
            continue;
        if(tokens[i][1] === ":"){
            if(!memory.types[tokens[i+1][1]])
                showerr(`Unvalid value type '${tokens[i+1][1]}'`, "TypeError");
            args.push(tokens[i-1][1]);
            argstype.push(tokens[i+1][1]);
        }
        if(tokens[i][1] == "="){
            funcisreturned = true;
            i++;
            for(; i < length; i++)
                returnvalue.push(tokens[i][1]);
        }
    }
    addfunc(tokens[1][1], args, argstype);
    let outargs = [];
    for(let i = 0; i < args.length; i++){
        outargs.push(`${argstype[i]} ${args[i]}`);
    }
    let typefunc = memory.types[tokens[0][1]];
    if(!typefunc)
        showerr(`Unvalid value type '${tokens[0][1]}'`, "TypeError");
    if(tokens[1][1] == "main")
        typefunc = "int";
    if(funcisreturned){
        memory.code.push(`${typefunc} ${tokens[1][1]}(${outargs.join(", ")}){return ${returnvalue.join(" ")};}`);
        return;
    }
    memory.code.push(`${typefunc} ${tokens[1][1]}(${outargs.join(", ")}){`);
    memory.mein.push("func");
    memory.funcname = tokens[1][1];
}
module.exports = {
    funccreate
};