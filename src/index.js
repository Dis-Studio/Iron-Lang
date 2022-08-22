const { readFileSync, writeFileSync, unlinkSync, existsSync } = require("fs");
const { lexer } = require("./lang/lexer");
const { showerr } = require("./lang/core-apis/io/err");
const { exec } = require("child_process");
const memory = require("./lang/memory");

function getdir(filepath){
    let s = filepath.split("/");
    s.pop();
    return s;
}

if(process.argv.length == 2)
    showerr("No input file", "FileReadError");

for(let i=2; i < process.argv.length; i++){
    if(process.argv[i] == "-f")
        memory.filepath = process.argv[++i];
    else if(process.argv[i] == "-o")
        memory.outputcode = process.argv[++i];
    else if(process.argv[i] == "--not-import-libs")
        memory.code[0] = "";
}
if(!existsSync(memory.filepath))
    showerr("File not found", "FileReadError");
var content = readFileSync(memory.filepath, "utf8").split("");
var lines = readFileSync(memory.filepath, "utf8").split("\n");
lines.forEach(function(tline){
    let line = tline.trim();
    if(line.startsWith("import ")){
        let arr = readFileSync(`${getdir(memory.filepath)}/${line.replace("import ", "")}`, "utf8").split("");
        arr.push("\n");
        content = arr.concat(content);
    }
});
content.push('\n');

lexer(content);

writeFileSync(memory.filepath.replace(".in", ".c"), memory.code.join("\n"), "utf8");
exec(`gcc ${memory.filepath.replace(".in", ".c")} libs/*.c -I libs/ -o ${memory.outputcode}`, function(err, stdout, stderr){
    if(stdout)
        console.log(stdout);
    if(stderr)
        console.log(stderr);
    //unlinkSync(memory.filepath.replace(".in", ".c"));
});