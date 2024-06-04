/**
 * Remplazar guiones por slash
 * @param {*} str texto a convertir
 * @returns el mismo texto con los guiones remplazados por slash
 */
function replaceHyphensWithSlashes(str) {
    return str.replace(/-/g, '/');
}

module.exports = {
    replaceHyphensWithSlashes
}