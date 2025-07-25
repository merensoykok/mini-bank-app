function generateId(prefix) {
    const ts = Date.now().toString().slice(-12);
    return `${prefix}${ts}`;
}


module.exports = {generateId};