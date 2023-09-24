function tokenize(str) {
  //let re = /[\s,]*([()\[\]{}'`]|"(?:\\.|[^\\"])*"|@(?:@@|[^@])*@|;.*|#.*|[^\s,()\[\]{}'"`;@]*)/g;
  let re = /[\s,]*([()\[\]{}']|"(?:\\.|[^\\"])*"|@(?:@@|[^@])*@|`(?:``|[^`])*`|;.*|#.*|[^\s,()\[\]{}'"`;@]*)/g;
  let result = [];
  let token;
  while ((token = re.exec(str)[1]) !== "") {
    if (token[0] === ";") continue;
    if (token[0] === "#") continue;
    //if (token.match(/^-?[0-9][0-9.]*$/)) token = parseFloat(token, 10);
    if (isFinite(token)) token = parseFloat(token, 10);
    result.push(token);
  }
  return result;
}

function read_token(code, exp) {
  if (code.length === 0) return undefined;
  let token = code.shift();
  exp.push(token);
  return token;
}

function read_list(code, exp, ch) {
  let result = [];
  let ast;
  while ((ast = read_sexp(code, exp, false)) !== undefined) {
    if (ast === ".") {
      code.unshift(".");
      break;
    } else if (ast === "]") {
        if (ch !== "[") code.unshift("]");
        break;
      } else if (ast === ")") {
      break;
    }
    result.push(ast);
  }
  return result;
}

function read_struct(code, exp) {
  let result = [["#", "struct"]];
  let ast1;
  let ast2;
  while ((ast1 = read_sexp(code, exp)) !== undefined) {
    if (ast1 === "]") continue;
    if (ast1 === "}") break;
    ast2 = read_sexp(code, exp);
    result.push(ast1);
    result.push(ast2);
  }
  return result;
}

function split_ids_convert(id) {
  if (id[0] !== "#") return id;
  id = id.substring(1);
  if (isFinite(id)) return [parseFloat(id, 10)];
  return [id];
}

function split_ids(token) {
  if (token[0] === ".") return [token];
  let result = [];
  let id = "";
  for (let i=0; i<token.length; i++) {
    let ch = token[i];
    switch(ch) {
      case ".":
        result.push(id);
        id = "";
        break;
      case "#":
        result.push(id);
        id = "#";
        break;
      default:
        id += ch;
      }
  }
  if (id !== "") result.push(id);
  return result.map(split_ids_convert);
}

function read_sexp(code, exp) {
  let token = read_token(code, exp);
  if (token === undefined) return undefined;
  if ((typeof token) === "number") return token;
  switch (token) {
    case "false":
      return false;
    case "true":
      return true;
    case "null":
      return null;
    case "undefined":
      return ["@", "undefined"];
  }
  let ch = token[0];
  switch (ch) {
    case "(":
    case "[":
      let lst = read_list(code, exp, ch);
      return lst;
    case ")":
    case "]":
    case ".":
          return ch;
    case "{":
      return read_struct(code, exp);
    case "}":
      return ch;
    case '"':
      token = JSON.parse(token);
      return token;
    case "`":
      token = token.replace(/(^`|`$)/g, "");
      token = token.replace(/(``)/g, "${'`'}");
      return ["@", "`" + token + "`"];
    case "@":
      token = token.replace(/(^@|@$)/g, "");
      token = token.replace(/(@@)/g, "@");
      return ["@", token];
    default: {
      //if (token[0] === ":") return token;
      if (token[0] === ":") return token.substring(1);
      if (token[0] === "&") return token;
      let ids = split_ids(token);
      return ["#", ...ids];
    }
  }
}

function join_sexp_convert(token) {
  if (token === ".") token = ")";
  if (token === "[") token = "(";
  if (token === "]") token = ")";
  return token;
}

function join_sexp(exp) {
  //console.log(exp);
  if (exp.length === 0) return "";
  let last = exp.shift();
  let result = "" + join_sexp_convert(last);
  while (exp.length > 0) {
    let token = exp.shift();
    if (
      token !== "." &&
      token !== ")" &&
      token !== "]" &&
      (last !== "(") & (last !== "[") &&
      last !== "'"
    )
      result += " ";
    //if (token === ".") token = ")";
    //if (token === "[") token = "(";
    //if (token === "]") token = ")";
    result += join_sexp_convert(token);
    last = token;
  }
  return result;
}

export function oml2ast(text) {
  let code = tokenize(text);
  let result = [];
  while (true) {
    let exp = [];
    let ast = read_sexp(code, exp);
    if (ast === undefined) break;
    if (ast === ".") continue;
    if (ast === ")") continue;
    if (ast === "]") continue;
    result.push([join_sexp(exp), ast]);
  }
  return result;
}

export function ast2oml(ast) {
  if (ast === null) return "null";
  if (ast === undefined) return "undefined";
  if ((typeof ast) === "number") return JSON.stringify(ast);
  if ((typeof ast) === "string") return JSON.stringify(ast);
  if ((typeof ast) === "boolean") return JSON.stringify(ast);
  if (ast instanceof Array) {
    let result = "(list";
    for (let i = 0; i < ast.length; i++) {
      /*if (i > 0)*/ result += " ";
      result += ast2oml(ast[i]);
    }
    result += ")";
    /*
    let keys = Object.keys(ast);
    let re = /^[0-9]+/;
    keys = keys.filter(key => !re.test(key));
    keys.sort();
    if (keys.length > 0) {
      if (ast.length > 0) result += " ";
      result += "?";
      for (let i=0; i<keys.length; i++) {
        let key = keys[i];
        result += " (";
        result += JSON.stringify(key);
        result += " ";
        result += ast2oml(ast[key]);
        result += ")";
      }
    }
    result += " )";
    */
    return result;
  } else {
    let result = "(struct";
    let keys = Object.keys(ast);
    keys.sort();
    for (let i = 0; i < keys.length; i++) {
      /*if (i > 0)*/ result += " ";
      result += JSON.stringify(keys[i]);
      result += " ";
      result += ast2oml(ast[keys[i]]);
    }
    result += ")";
    return result;
  }
}

export function astequal(a, b) {
  // primitive
  if (a === b) {
    return true;
  }
  /*
  if(a === null){
    return b === null; // null === null => true
  }
  */
  /*
  if (a instanceof Array && b instanceof Array) {
    // Array
    if (a.length !== b.length) {
      return false
    }
    for (let i = 0; i < a.length; ++i) {
      const ret = astequal(a[i], b[i]);
      if (ret === false) {
        return false
      }
    }
    return true;
  } else
  */
  if (a instanceof Function || b instanceof Function) {
    // Function
    //console.log("function was not supported!!")
    return false
  //} else if (typeof (a) === 'object' && typeof (b) === 'object' && !(a instanceof Array) && !(b instanceof Array)) {
  } else if (typeof (a) === 'object' && typeof (b) === 'object') {
    // Object
    const ak = Object.keys(a);
    const bk = Object.keys(b);
    if (ak.length !== bk.length) {
      return false;
    }
    for (let i = 0; i < ak.length; ++i) {
      const key = ak[i];
      const ret = astequal(a[key], b[key]);
      if (ret === false) {
        return false;
      }
    }
    return true;
  }
  return false
}
