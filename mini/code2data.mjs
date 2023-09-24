function om$tokenize(str) {
  //let re = /[\s,]*([()\[\]'`]|"(?:\\.|[^\\"])*"|@(?:@@|[^@])*@|;.*|#.*|[^\s,()\[\]'"`;@]*)/g;
  let re = /[\s,]*([()\[\]'`]|"(\\.|[^\\"])*"|@(@@|[^@])*@|\/\*.*\/\*|;.*|#.*|[^\s,()\[\]'"`;@]*)/g;
  let result = [];
  let token;
  while ((token = re.exec(str)[1]) !== "") {
    if (token[0] === ";") continue;
    if (token[0] === "#") continue;
    if (token.startsWith("/*")) continue;
    //if (token.match(/^-?[0-9][0-9.]*$/)) token = parseFloat(token, 10);
    if (isFinite(token)) token = parseFloat(token, 10);
    result.push(token);
  }
  return result;
}

export function om$typeof(x) {
  if (x === undefined) return "undefined";
  if (x === null) return "null";
  if ((typeof x) !== "object") {
    return (typeof x);
  }
  if (!x.hasOwnProperty("!")) return (typeof x);
  return x["!"];
}

export function om$typeis(x, t) {
  return om$typeof(x) === t;
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
  while ((ast = read_sexp(code, exp)) !== undefined) {
    if (ast === "?") {
      code.unshift("?");
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

function read_sexp(code, exp) {
  let token = read_token(code, exp);
  if (token === undefined) return undefined;
  switch (token) {
    case "false":
      return false;
    case "true":
      return true;
    case "null":
      return null;
    case "undefined":
      return { "!": "undefined" };
  }
  let ch = token[0];
  switch (ch) {
    case "(":
    case "[":
      let lst = read_list(code, exp, ch);
      return lst;
    case ")":
    case "]":
    case "?":
      return ch;
    case "'":
      let ast = read_sexp(code, exp);
      return ["`", ast];
    case '"':
      token = JSON.parse(token);
      //return ["`", token];
      return token;
    case "@":
      token = token.replace(/(^@|@$)/g, "");
      token = token.replace(/(@@)/g, "@");
      return ["`", token];
    case ":":
      return ["`", token.substring(1)];
    default:
      if ((typeof token) === "string" /*&& token !== '&'*/)
        return { "!": "id", "?": token };
      return token;
  }
}

export function code2ast(text) {
  let code = om$tokenize(text);
  let result = [];
  while (true) {
    let exp = [];
    let ast = read_sexp(code, exp);
    if (ast === undefined) break;
    if (ast === ")") continue;
    if (ast === "]") continue;
    if (ast === "?") continue;
    result.push(ast);
  }
  return result;
}

/*
export function code2do(text) {
  var ary = code2ast(text);
  var do_ = ["do"];
  for (var x of ary) {
    do_.push(x[1]);
  }
  return do_;
}
*/

export function ast2code(ast) {
  if (ast === null) return "null";
  if (ast === undefined) return "undefined";
  if ((typeof ast) === "number") return JSON.stringify(ast);
  if ((typeof ast) === "string") return JSON.stringify(ast);
  if ((typeof ast) === "boolean") return JSON.stringify(ast);
  if (om$typeis(ast, "id")) return ast["?"];
  if (ast instanceof Array) {
    if (ast[0] === "`") {
      if ((typeof ast[1]) === "string") return JSON.stringify(ast[1]);
      return "'" + ast2code(ast[1]);
    }
    let result = "(";
    for (let i = 0; i < ast.length; i++) {
      if (i > 0) result += " ";
      result += ast2code(ast[i]);
    }
    result += ")";
    return result;
  } else {
    let result = "(struct";
    let keys = Object.keys(ast);
    keys.sort();
    for (let i = 0; i < keys.length; i++) {
      result += " ";
      result += JSON.stringify(keys[i]);
      result += " ";
      result += ast2code(ast[keys[i]]);
    }
    result += ")";
    return result;
  }
}

export function data2code(ast) {
  if (ast === null) return "null";
  if (ast === undefined) return "undefined";
  if ((typeof ast) === "number") return JSON.stringify(ast);
  if ((typeof ast) === "string") return JSON.stringify(ast);
  if ((typeof ast) === "boolean") return JSON.stringify(ast);
  if (ast instanceof Array) {
    let result = "(list";
    for (let i = 0; i < ast.length; i++) {
      result += " ";
      result += data2code(ast[i]);
    }
    result += ")";
    return result;
  } else {
    let result = "(struct";
    let keys = Object.keys(ast);
    keys.sort();
    for (let i = 0; i < keys.length; i++) {
      result += " ";
      result += JSON.stringify(keys[i]);
      result += " ";
      result += data2code(ast[keys[i]]);
    }
    result += ")";
    return result;
  }
}

