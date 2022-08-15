function showerr(msg, type){
    console.log(`\x1b[31mERROR\x1b[0m:\x1b[36m:${type}\x1b[0m::\x1b[32m${msg}\x1b[0m`);
    process.exit(msg.split("").length);
}
module.exports = {
    showerr
};