const { showerr } = require("./err.js");

var funcs = [];

function existsfunc(funcname){
    let out = false;
    funcs.forEach(function(func){
        if(func.name == funcname)
            out = true;
    });
    return out;
}
function addfunc(funcname, args, argstype){
    if(existsfunc(funcname))
        showerr(`Function('${funcname}') is already defined`, "FuncError");
    funcs.push({
        name:funcname,
        args:args,
        argstype:argstype
    });
}
module.exports = {
    addfunc,
    existsfunc
};