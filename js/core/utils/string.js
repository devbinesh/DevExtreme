var typeUtils = require("./type");

var encodeHtml = (function() {
    var encodeRegExp = [new RegExp("&", "g"), new RegExp('"', "g"), new RegExp("'", "g"), new RegExp("<", "g"), new RegExp(">", "g")];

    return function(str) {
        return String(str)
            .replace(encodeRegExp[0], '&amp;')
            .replace(encodeRegExp[1], '&quot;')
            .replace(encodeRegExp[2], '&#39;')
            .replace(encodeRegExp[3], '&lt;')
            .replace(encodeRegExp[4], '&gt;');
    };
})();


var splitQuad = function(raw) {
    switch(typeof raw) {
        case "string":
            return raw.split(/\s+/, 4);
        case "object":
            return [
                raw.x || raw.h || raw.left,
                raw.y || raw.v || raw.top,
                raw.x || raw.h || raw.right,
                raw.y || raw.v || raw.bottom];
        case "number":
            return [raw];
        default:
            return raw;
    }
};

var quadToObject = function(raw) {
    var quad = splitQuad(raw),
        left = parseInt(quad && quad[0], 10),
        top = parseInt(quad && quad[1], 10),
        right = parseInt(quad && quad[2], 10),
        bottom = parseInt(quad && quad[3], 10);

    if(!isFinite(left)) {
        left = 0;
    }
    if(!isFinite(top)) {
        top = left;
    }
    if(!isFinite(right)) {
        right = left;
    }
    if(!isFinite(bottom)) {
        bottom = top;
    }

    return { top: top, right: right, bottom: bottom, left: left };
};

var stringFormat = function() {
    var s = arguments[0],
        values = [].slice.call(arguments).slice(1),
        replaceDollarCount,
        reg,
        value;

    if(typeUtils.isFunction(s)) {
        return s.apply(this, values);
    }

    for(var i = 0; i < values.length; i++) {
        reg = new RegExp("\\{" + i + "\\}", "gm");
        value = values[i];
        if(typeUtils.type(value) === "string" && value.indexOf("$") >= 0) {
            replaceDollarCount = "$".replace("$", "$$").length;
            value = value.replace("$", replaceDollarCount === 1 ? "$$$$" : "$$");
        }
        s = s.replace(reg, value);
    }

    return s;
};

var replaceAll = (function() {
    var quote = function(str) {
        return (str + "").replace(/([\+\*\?\\\.\[\^\]\$\(\)\{\}\><\|\=\!\:])/g, "\\$1");
    };

    return function(text, searchToken, replacementToken) {
        return text.replace(new RegExp("(" + quote(searchToken) + ")", "gi"), replacementToken);
    };
})();

var isEmpty = (function() {
    var SPACE_REGEXP = /\s/g;

    return function(text) {
        return !text || !text.replace(SPACE_REGEXP, "");
    };
})();

exports.encodeHtml = encodeHtml;
exports.quadToObject = quadToObject;
exports.format = stringFormat;
exports.replaceAll = replaceAll;
exports.isEmpty = isEmpty;
