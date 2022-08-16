const { showerr } = require("./io/err");
const { addfunc, existsfunc, gettypearg, existsarg, getargid } = require("./io/func");
const memory = require("./memory");

function rand(){
    return Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
}
function replace_all(str, oldstr, newstr){
    let out = str;
    while(out.indexOf(oldstr) !== -1)
        out = out.replace(oldstr, newstr);
    return out;
}

function run(tokenlist){
    let funcname = "";
    let repeatname = "";
    let mein = [];
    tokenlist.forEach(function(tokens){
        if(tokens[0][0] === "id" && tokens[1][1] === "("){
            let args = [];
            let argid = 0;
            for(let i=2; i < tokens.length; i++){
                if(tokens[i][0] == "assign")
                    continue;
                if(tokens[0][1] !== "asm" && tokens[i][0] != "id" && gettypearg(tokens[0][1], argid) != tokens[i][0])
                    showerr(`You cannot convert '${tokens[i][0]}' to '${gettypearg(tokens[0][1], argid)}'`, "TypeError");
                if(tokens[i][0] == "id"){
                    if(existsarg(funcname, tokens[i][1]))
                        args.push(`%${getargid(funcname, tokens[i][1])}`);
                    else
                        showerr("Expression error", "SyntaxError");
                    continue;
                }
                args.push(tokens[i][1]);
                argid++;
            }
            switch(tokens[0][1]){
                case "repeat":
                    repeatname = `repeat${rand()}`;
                    memory.code.push("push eax");
                    memory.code.push(`mov eax, ${tokens[2][1]}`);
                    memory.code.push(`${repeatname}:`);
                    mein.push("repeat");
                    break;
                case "asm":
                    memory.code.push(replace_all(args.join(""), '"', ""));
                    break;
                default:
                    if(!existsfunc(tokens[0][1]))
                        showerr(`Function('${tokens[0][1]}') is not defined`, "ObjectNotFound");
                    memory.code.push(`${tokens[0][1]} ${args.join("")}`);
                    break;
            }
        } else if(tokens[0][1] == "func" && tokens[1][0] == "id"){
            let args = [];
            let argstype = [];
            let length = tokens.length-1;
            if(tokens[length] === ")")
                length--;
            for(let i=3; i < length; i++){
                if(tokens[i][1] === ",")
                    continue;
                if(tokens[i][1] === ":"){
                    args.push(tokens[i-1][1]);
                    argstype.push(tokens[i+1][1]);
                }
            }
            addfunc(tokens[1][1], args, argstype);
            memory.code.push(`%macro ${tokens[1][1]} ${args.length}`);
            funcname = tokens[1][1];
            mein.push("func");
        } else if(tokens[0][1] == "end"){
            switch(mein[mein.length-1]){
                case "repeat":
                    memory.code.push("dec eax");
                    memory.code.push(`jnz ${repeatname}`);
                    memory.code.push("pop eax");
                    break;
                case "func":
                    if(funcname == "main")
                        memory.code.push("exit 0");
                    memory.code.push("%endmacro");
                    break;
            }
            mein.pop();      
        } else if(tokens[0][1] == "import") {}
        else
            showerr(`Function('${tokens[0][1]}') is not defined`, "ObjectNotFound");
    });
    memory.code.push("");
    memory.code.push("section .text");
    memory.code.push("    global _start");
    memory.code.push("_start:");
    memory.code.push("    main");
    if(!existsfunc("main"))
        showerr("Starting function not specified", "SyntaxError");
    
    
}
module.exports = {
    run
};