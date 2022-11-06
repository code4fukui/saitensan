import { serveAPI } from "https://js.sabae.cc/wsutil.js";
import { dir2array } from "https://js.sabae.cc/dir2array.js";

const mkdir = async (dir) => {
  try {
    await Deno.mkdir(dir);
  } catch (e) {
  }
};

serveAPI("/api", async (param, req, path) => {
  const dir = param.contest;
  if (dir.indexOf("..") >= 0 || dir.indexOf("/") >= 0) {
    return;
  }
  if (path == "/api/add") {
    await mkdir("data/" + dir);
    const id = parseInt(param.id);
    if (isNaN(id)) {
      return;
    }
    await Deno.writeTextFile("data/" + dir + "/" + id + ".json", JSON.stringify(param, null, 2));
    return "ok";
  } else if (path == "/api/get") {
    const res = [];
    const list = await dir2array("data/" + dir);
    for (const fn of list) {
      if (!fn.endsWith(".json")) {
        continue;
      }
      const data = JSON.parse(await Deno.readTextFile("data/" + dir + "/" + fn));
      res.push(data);
    }
    return res;
  }
});
