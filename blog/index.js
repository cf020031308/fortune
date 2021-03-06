var xml2obj = function(xml) {
    var obj = {
        toString: function() {
            return xml.textContent.trim();
        }
    }
    for (var i = 0; i < xml.children.length; i++) {
        var key = xml.children[i].tagName.toLowerCase();
        var value = xml2obj(xml.children[i]);
        if (!obj[key]) {
            obj[key] = value;
        } else if (obj[key].constructor === Array) {
            obj[key].push(value);
        } else {
            obj[key] = [obj[key], value];
        }
    }
    var attrs = xml.getAttributeNames();
    for (var i = 0; i < attrs.length; i++) {
        var attr = attrs[i];
        if (obj[attr]) attr = "$" + attr;
        obj[attr] = xml.getAttribute(attr).trim();
    }
    return obj;
};


var decode_entity = function(s) {
    return s.replace(
        /&(amp|gt|lt);/g,
        function(w) {return {"&amp;": "&", "&gt;": ">", "&lt;": "<"}[w]; });
}


var Template = function(template) {
    var output = ["with(input){", 'var output="";'];
    var lines = template.split("\n");
    for (var i = 0; i < lines.length; i++) {
        var line = lines[i].trim();
        if (line[0] === "<") {
            line = "output+=" + JSON.stringify(line).replace(/\$([\w.\$\[\]()]+)/g, '"+($1)+"') + ";";
        }
        output.push(line);
    }
    output.push("return output;", "}");
    return new Function("input", output.join("\n"));
};


var http = function(method, url, callback) {
    var req = window.XMLHttpRequest? (new XMLHttpRequest()): (new ActiveXObject("Microsoft.XMLHTTP"));
    if (callback) req.onreadystatechange = callback;
    req.open(method, url, !!callback);
    req.send();
    return req;
};
