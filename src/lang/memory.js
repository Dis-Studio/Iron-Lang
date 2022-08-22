var filepath = process.argv[1];
var code = ["#include <stdio.h>\n#include <stdlib.h>\n#include <ctype.h>\n", '#include "string.h"\n#include "port.h"'];
var outputcode = "a.out";
var mein = [];
var funcname = "";
const maxsizestring = 5024;

const types = {
    int:"int",
    string:"char",
    func:"void",
    char:"char",
    uint_t:"uint_t"
};

module.exports = {
    filepath, code, outputcode, mein, funcname, types, maxsizestring
};