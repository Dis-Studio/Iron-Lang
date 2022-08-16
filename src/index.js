const { readFileSync, writeFileSync, unlinkSync, existsSync } = require("fs");
const { lexer } = require("./lang/lexer");
const { showerr } = require("./lang/io/err");
const { exec } = require("child_process");
const memory = require("./lang/memory");

function getdir(filepath){
    let s = filepath.split("/");
    s.pop();
    return s;
}

if(!existsSync(process.argv[2]))
    showerr("No input file/File not found", "FileReadError");
var content = readFileSync(process.argv[2], "utf8").split("");
var lines = readFileSync(process.argv[2], "utf8").split("\n");
lines.forEach(function(tline){
    let line = tline.trim();
    if(line.startsWith("import ")){
        let arr = readFileSync(`${getdir(process.argv[2])}/${line.replace("import ", "")}`, "utf8").split("");
        arr.push("\n");
        content = arr.concat(content);
    }
});
content.push('\n');

lexer(content);

writeFileSync(process.argv[2].replace(".in", ".asm"), memory.code.join("\n"), "utf8");
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