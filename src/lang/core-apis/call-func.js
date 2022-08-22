const memory = require("../memory");
const { showerr } = require("./io/err");
const { existsfunc, gettypearg, existsarg, getreturntype, getmaxargs } = require("./io/func");
const { existsvar, gettypevar } = require("./io/variable");

function replace_all(str, oldstr, newstr){
    let out = str;
    while(out.indexOf(oldstr) !== -1)
        out = out.replace(oldstr, newstr);
    return out;
}

function print(args, argstype){
    for(let i=0; i < args.length; i++){
        if(argstype[i] == "uint_t")
            argstype[i] = "int";
        memory.code.push(`printf("%${argstype[i].split("")[0]}", ${args[i]});`);
    }
}

function callfunc(tokens){
    let args = [];
    let argstype = [];
    let argid = 0;
    let argtype = "";
    let standartfuncs = ["crun", "repeat", "print", "println", "printint"];
    let arg = "";
    let skip = 0;
    for(let i=2; i < tokens.length-1; i++){
        if(tokens[i][1] == "(")
            skip++;
        else if(tokens[i][1] == ")")
            skip--;
        if(!standartfuncs.includes(tokens[0][1]) && tokens[i][0] != "id" && gettypearg(tokens[0][1], argid) != tokens[i][0])
            showerr(`You cannot convert '${tokens[i][0]}' to '${gettypearg(tokens[0][1], argid)}'`, "TypeError");
        if(tokens[i][0] == "id"){
            /*if(!(existsarg(memory.funcname, tokens[i][1]) || existsvar(tokens[i][1]) || existsfunc(tokens[i][1])))
                showerr("Expression error", "SyntaxError");*/
            if(tokens[i+1][1] == "("){
                argtype = getreturntype(tokens[i][1]);
                let skip = 0;
                for(; i < tokens.length-1; i++){
                    if(tokens[i][1] == "(")
                        skip++;
                    else if(tokens[i][1] == ")"){
                        skip--;
                        if(skip == 0)
                            break;
                    }
                    arg += tokens[i][1];
                }
            }
            else{
                if(existsarg(memory.funcname, tokens[i][1]))
                    argtype = gettypearg(memory.funcname, argid);
                else if(existsvar(tokens[i][1]))
                    argtype = gettypevar(tokens[i][1]);
                else
                    showerr("Expression error", "SyntaxError");
            }
        } else if(tokens[i][0] != "assign")
            argtype = tokens[i][0];
        arg += tokens[i][1];
        if((tokens[i][1] == "," && skip == 0) || (i == tokens.length-2 || i == tokens.length-1)){
            if(arg.endsWith(",")){
                let temparg = arg.split("");
                temparg.pop();
                arg = temparg.join("");
            }
            args.push(arg);
            arg = "";
            argstype.push(argtype);
            argtype = "";
            argid++;
            continue;
        }
    }
    switch(tokens[0][1]){
        case "repeat":
            memory.code.push(`for(int ${repeatname} = 0; ${repeatname} < ${args[0]}; ${repeatname}++){`);
            memory.mein.push("repeat");
            break;
        case "crun":
            memory.code.push(`${replace_all(args.join(", "), '"', "")}\n`);
            break;
        case "print":
            print(args, argstype);
            break;
        case "println":
            print(args, argstype);
            memory.code.push('printf("\\n");');
            break;
        default:
            if(!existsfunc(tokens[0][1]))
                showerr(`Function('${tokens[0][1]}') is not defined`, "ObjectNotFound");
            else if(args.length != getmaxargs(tokens[0][1]))
                showerr("Not all arguments are specified for the function", "ArgumentsError");
            memory.code.push(`${tokens[0][1]}(${args.join(", ")});`);
            break;
    }
}

module.exports = {
    callfunc
};