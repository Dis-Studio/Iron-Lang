var filepath = process.argv[1];
var code = ["#include <stdio.h>\n"];
var outputcode = "a.out";
var mein = [];
var funcname = "";

const types = {
    int:"int",
    string:"char*",
    func:"void"
};

module.exports = {
    filepath, code, outputcode, mein, funcname, types
};