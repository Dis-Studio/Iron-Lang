const { showerr } = require("../io/err");
const memory = require("../memory");

function end(tokens){
    if(memory.mein.length == 0)
        showerr("End is specified outside the object", "SyntaxError");
    memory.code.push("}");
    memory.mein.pop();
}
module.exports = {
    end
};