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
function getargid(funcname, arg){
    let out;
    funcs.forEach(function(func){
        if(func.name == funcname){
            let id = 1;
            func["args"].forEach(function(argname){
                if(argname == arg)
                    out = id;
                id++;
            });
        }
    });
    return out;
}
module.exports = {
    addfunc,
    existsfunc,
    gettypearg,
    existsarg,
    getargid
};