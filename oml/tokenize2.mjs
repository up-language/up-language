function is_space(ch) {
    return ch.charCodeAt(0) <= 32;
}

function is_special(ch) {
    switch (ch) {
        case "(": return true;
        case ")": return true;
        case "[": return true;
        case "]": return true;
    }
    return false;
}

function push_token(result, token) {
    if (isFinite(token)) token = parseFloat(token, 10);
    result.push(token);
}

export function tokenize2(src) {
    //return ['a', 'b', 'c'];
    let result = [];
    let token = undefined;
    for (let i = 0; i < src.length; i++) {
        let ch = src[i];
        if (is_space(ch)) {
            if (token !== undefined) {
                push_token(result, token);
                token = undefined;
            }
            continue;
        }
        if (is_special(ch)) {
            if (token !== undefined) {
                push_token(result, token);
                token = undefined;
            }
            result.push(ch);
            continue;
        }
        if (ch === "#") {
            if (token !== undefined) {
                push_token(result, token);
                token = undefined;
            }
            let j = i;
            for (; j < src.length; j++) {
                ch = src[j];
                if (ch === "\n") {
                    //j++;
                    break;
                }
            }
            i = j;
            continue;
        }
        if (token === undefined) {
            token = "";
        }
        token += ch;
    }
    if (token !== undefined) {
        push_token(result, token);
        token = undefined;
    }
    return result;
}