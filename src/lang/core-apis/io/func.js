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
function addfunc(funcname, args, argstype, returntype){
    if(existsfunc(funcname))
        showerr(`Function('${funcname}') is already defined`, "FuncError");
    funcs.push({
        name:funcname,
        args:args,
        argstype:argstype,
        returntype:returntype
    });
}
function gettypearg(funcname, argid){
    if(!existsfunc(funcname))
        showerr(`Function('${funcname}') is not exists`, "ObjectNotFound");
    let out;
    funcs.forEach(function(func){
        if(func.name == funcname)
            out = func["argstype"][argid];
    });
    return out;
}
function existsarg(funcname, arg){
    let out = false;
    funcs.forEach(function(func){
        if(func.name == funcname){
            func["args"].forEach(function(argname){
                if(argname == arg)
                    out = true;
            });
        }
    });
    return out;
}
function getreturntype(funcname){
    let out;
    funcs.forEach(function(func){
        if(func.name == funcname)
            out = func.returntype;
    });
    return out;
}
module.exports = {
    addfunc,
    existsfunc,
    gettypearg,
    existsarg,
    getreturntype
};