const { showerr } = require("./err");

var vars = [];

function existsvar(varname){
    let out = false;
    vars.forEach(function(variable){
        if(variable["name"] == varname)
            out = true;
    });
    return out;
}

function addvar(varname, value, type){
    if(existsvar(varname))
        showerr(`Variable('${varname}') is already defined`, "ObjectNotFound");
    vars.push({
        name:varname,
        value:value,
        type:type
    });
}
function gettypevar(varname){
    let out;
    vars.forEach(function(variable){
        if(variable.name == varname)
            out = variable.type;
    });
    return out;
}
module.exports = {
    addvar,
    existsvar,
    gettypevar
};