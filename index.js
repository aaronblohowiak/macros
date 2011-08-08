var ugly = require("aaronblohowiak-plugify-js"),
    fs = require("fs");

macros = {};
module.exports = macros;

var passthrough = function(item){
  return item;
};

convert = function (code, options){
  options || (options = {});
  
  options.gen_options || (options.gen_options = {})
  if(!options.gen_options.hasOwnProperty("beautify")){
    options.gen_options.beautify = true;
  }

  options.regex || (options.regex = []);
  options.token || (options.token = passthrough);
  options.ast || (options.ast = passthrough);

  var re, sub;
  for (var i = options.regex.length - 1; i >= 0; i--){
    re = options.regex[i][0];
    sub = options.regex[i][1];
    code = code.replace(re, sub);
  };
  
  var jsp = ugly.parser;
  var pro = ugly.uglify;

  var ast = jsp.parse(code, options.strict_semicolons, true, options.token); // parse code and get the initial AST
  
  var ast = options.ast(ast); // run ast through custom converter

  var beautified_code = pro.gen_code(ast, options.gen_options); // final code here
  
  beautified_code = (options.prepend || "") + beautified_code ;
  beautified_code = beautified_code + (options.append || "");
  return beautified_code;
};


macros.register = function(extension, options){
  require.extensions[extension] = function(module, filename) {
    var content;
    content = convert(fs.readFileSync(filename, 'utf8'), options);
    return module._compile(content, filename);
  };
};