const { showerr } = require("./err.js");

var funcs = [
    {
        name:"stringLength",
        args:["str"],
        argstype:["string"],
        returntype:"int"
    },
    {
        name:"outb",
        args:["port", "data"],
        argstype:["uint_t", "uint_t"],
        returntype:"func"
    },
    {
        name:"inb",
        args:["port"],
        argstype:["uint_t"],
        returntype:"uint_t"
    }
];

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
function getmaxargs(funcname){
    let out;
    funcs.forEach(function(func){
        if(func.name == funcname)
            out = func.args.length;
    });
    return out;
}
module.exports = {
    addfunc,
    existsfunc,
    gettypearg,
    existsarg,
    getreturntype,
    getmaxargs
};