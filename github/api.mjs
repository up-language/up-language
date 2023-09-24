import { fetch_json } from "./fetch_json.mjs";

export async function repo(repo) {
    const json = await fetch_json(`https://ungh.cc/repos/${repo}`);
    return json;
}

export async function files(repo, branch) {
    const json = await fetch_json(`https://ungh.cc/repos/${repo}/files/${branch}`);
    const files = json.files;
    for (let file of files) {
        //console.log(file);
        file.url = `https://raw.githubusercontent.com/${repo}/${branch}/${file.path}`
    }
    return json;
}

export async function file(repo, branch, path) {
    const json = await fetch_json(`https://ungh.cc/repos/${repo}/files/${branch}/${path}`);
    return json;
}

export async function releases(repo) {
    const json = await fetch_json(`https://ungh.cc/repos/${repo}/releases`);
    return json;
}

export async function latest_release(repo) {
    const json = await fetch_json(`https://ungh.cc/repos/${repo}/releases/latest`);
    return json;
}

