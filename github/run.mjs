import * as api from "./api.mjs";

console.log(await api.repo("spider-explorer/spider-programs"));
console.log(await api.files("spider-explorer/spider-programs", "main"));
console.log(await api.file("spider-explorer/spider-programs", "main", "upload.cmd"));
//console.log(await api.releases("spider-explorer/spider-programs"));
//console.log(await api.latest_release("spider-explorer/spider-programs"));
