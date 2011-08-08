# macros

`macros` is an easy way to define a pre-processor chain for your source.

The macro processor is combined of steps:

  * Regex (string to string)
  * Token Transformations (token to token)
  * AST Transformations (valid JS AST to valid JS AST)
  * Prepend (valid JS str to valid JS str)
  * Append (valid JS str to valid JS str)
  * require (valid JS str to module.exports object)


You define a file extension and a suite of filters that accepts source and returns transformed source.

## Examples:

### Regex:

Don't you wish JavaScript had easy parse-time string substitution? ;)  Caution: as this is just a straight string substitution, you will probably blow up your code.

    macros.register(".cjs", {
      regex: [
        [/development.local/, "example.com"]
      ]
    });

### Token:

If you want to twiddle your tokens, use this handy token-substitution device.

Example: decafscript is javascript where "f" is the same as "function". You can do it with a simple token transformation. all files with the ".ds" extension will treat "f" as the "function" keyword using this macro:
  
    macros.register(".ds",{
      token: function(tok){
        if(tok.type == "name" && tok.value == "f"){
          tok.type = "keyword";
          tok.value = "function";
        }
        return tok;
      }
    });

### AST

If you want to do crazy transformations on your source tree, then you can modify the syntax tree directly.  `macros` uses a fork of Uglify-JS, but the AST is the same.

Here's an example with substack's handy `burrito`! It will wrap all function calls with another function call :D

    burrito = require("burrito");
  
    macros.register(".trace", {
      ast: function(ast){
        var str = burrito(ast, function(node){
          if(node.name === 'call') node.wrap('wrapper(%s)'); 
        });
        return burrito.parse(str);
      }
    });
