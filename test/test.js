macros = require("../index.js");

burrito = require("burrito");

macros.register(".ds",{
  prepend: "console.log('being processed: '+ (new Date));\n",
  regex: [
    [/development.local/, "example.com"]
  ],
  token: function(tok){
    if(tok.type == "name" && tok.value == "f"){
      tok.type = "keyword";
      tok.value = "function";
    }
    return tok;
  },
  ast: function(ast){
   var str = burrito(ast, function(node){
      if(node.name === 'call'){
        node.wrap('wrapper(%s)'); 
      } 
    });
    
    return burrito.parse(str);
  },
  append: "function wrapper(fnCall){ return fnCall;}"
});

sample = require("./sample");
result = sample();

expect = "f(){}"; 

reg = result[0].toString().substr(1, expect.length);
str = result[1];

assert = require("assert");

assert.equal(expect, str);
assert.equal(expect, reg);

assert.equal("example.com", sample.location);


console.log("ok");