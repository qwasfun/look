import axios from "axios";
import fs from "node:fs";
import { exec } from "node:child_process";

const date = new Date();

let month = date.getMonth() + 1;
let day = date.getDate();

if (month < 10) {
  month = "0" + month;
}
if (day < 10) {
  day = "0" + day;
}

const dateStr = date.getFullYear() + "-" + month + "-" + day;

async function codeUpdate() {
  return new Promise((resolve, rejects) => {
    exec("git fetch && git reset --hard origin/main", (err) => {
      if (err) {
        rejects(err);
      }
      console.log("codeUpdate 执行成功");
      resolve();
    });
  });
}

async function scrapeAndSave() {
  const url = "http://zxgk.court.gov.cn/getSxcjData";
  const UA =
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36 Edg/128.0.0.0";
  await axios
    .get(url, {
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "User-Agent": UA,
      },
    })
    .then(async (res) => {
      await saveToFile(dateStr + " " + res.data.gbsx + "\n");
    })
    .catch((err) => {
      console.log(err);
    });
}

function saveToFile(data) {
  fs.appendFile("./data/shixin.txt", data, (err) => {
    if (err) {
      return console.error(err);
    }
    console.log("数据写入成功");

    // git push
    exec(
      `git commit -am "update ${dateStr}" && git push origin main`,
      (error, stdout, stderr) => {
        if (error) {
          return console.error(error);
        }
        console.log("git push 执行成功");
      }
    );
  });
}

(async () => {
  try {
    await codeUpdate()
    await scrapeAndSave();
    console.log("任务完成");
  } catch (error) {
    console.error("任务出错：", error);
  }
})();
