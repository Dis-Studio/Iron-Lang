const { readFileSync, existsSync } = require("fs");
const { lexer } = require("./lang/lexer");
const { showerr } = require("./lang/io/err");

if(!existsSync(process.argv[2]))
    showerr("No input file/File not found", "FileReadError");

var content = readFileSync(process.argv[2], "utf8").split("");
content.push('\n');

lexer(content);