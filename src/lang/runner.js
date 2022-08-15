const { showerr } = require("./io/err");
const { addfunc, existsfunc } = require("./io/func");
const { exec } = require("child_process");
const { writeFileSync, unlinkSync } = require("fs");

function run(tokenlist){
    let out = [];
    let waitingend = false;
    let funcname = "";
    //console.log(tokenlist);
    out.push('%include "libs/slio.asm"');
    tokenlist.forEach(function(tokens){
        if(tokens.length == 0)
            return;
        if(tokens[0][0] === "id" && tokens[1][1] === "("){
            let args = [];
            for(let i=2; i < tokens.length-1; i++)
                args.push(tokens[i][1]);
            if(!existsfunc(tokens[0][1]) && (tokens[0][1] != "println" && tokens[0][1] != "print" && tokens[0][1] != "exit" && tokens[0][1] != "sys_call"))
                showerr(`Function('${tokens[0][1]}') is not defined`, "ObjectNotFound");
            out.push(`${tokens[0][1]} ${args.join("")}`);
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
            out.push(`%macro ${tokens[1][1]} ${args.length}`);
            if(waitingend)
                showerr(`It is forbidden to insert a function into a function`, "SyntaxError");
            waitingend = true;
            funcname = tokens[1][1];
        } else if(tokens[0][1] == "end"){
            if(!waitingend)
                showerr(`A curly bracket was placed in the void...`, "SyntaxError");
            waitingend = false;
            if(funcname == "main")
                out.push("exit 0");
            out.push("%endmacro");
        }
        
    });
    if(waitingend)
        showerr(`Missing curly bracket`, "SyntaxError");
    out.push("");
    out.push("section .text");
    out.push("    global _start");
    out.push("_start:");
    out.push("    main");
    if(!existsfunc("main"))
        showerr("Starting function not specified", "SyntaxError");
    writeFileSync(process.argv[2].replace(".in", ".asm"), out.join("\n"), "utf8");
    exec(`nasm -f elf ${process.argv[2].replace(".in", ".asm")} -o ${process.argv[2].replace(".in", ".o")}`, function(err, stdout, stderr){
        if(stdout)
            console.log(stdout);
        if(stderr)
            console.log(stderr);
    });
    exec(`ld -m elf_i386 ${process.argv[2].replace(".in", ".o")} -o ${process.argv[2].replace(".in", "")}`, function(err, stdout, stderr){
        if(stdout)
            console.log(stdout);
        if(stderr)
            console.log(stderr);
        unlinkSync(process.argv[2].replace(".in", ".o"));
        unlinkSync(process.argv[2].replace(".in", ".asm"));
    });
    //console.log(out);
}
module.exports = {
    run
};