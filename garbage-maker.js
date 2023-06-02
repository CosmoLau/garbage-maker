const fs = require("fs");
const path = require("path");
const process = require("process");

/**
 * @zh
 * 运行环境：node
 * 快速使用 `shell 命令行`：
 * node test.js [源路径文件夹](必选) clean(可选)
 * 
 */

/** 源路径文件夹 */
let sourcePath = "";
/** 是否添加垃圾代码 */
let addShit = true;
/** 默认添加的垃圾代码，如需定制化，可修改这个变量 */
let codeStr = "console.log();";
/** 添加代码的比例，这个值越大，添加的代码越少 */
let ratio = 35;
/** 文件总数 */
let fileSum = 0;

// |---------- 命令行检测 ----------
let commandArr = process.argv.slice(2);

// 第一个参数判断
if (commandArr[0]) {
    sourcePath = commandArr[0].replace(/\\/g, "/");
    try {
        let stat = fs.statSync(sourcePath);
        if (!stat.isDirectory()) {
            console.warn("请输入一个有效的文件夹路径");
            return;
        }
    } catch(err) {
        console.warn("请输入一个有效的文件夹路径");
    }
}
else {
    console.warn("请键入源路径，例如：node test.js [源路径文件夹](必选) clean(可选)");
    return;
}

// 第二个参数判断
if (commandArr[1]) {
    if (commandArr[1] == "clean") {
        addShit = false;
    }
    else {
        console.warn("参数错误，目前可选参数只能为 clean");
        return;
    }
}

// ---------- 命令行检测 ----------|

/**
 * 添加代码
 * @param {string} filePath 
 */
function addCode(filePath) {
    let context = fs.readFileSync(filePath, { encoding: "utf8" });
    let num = Math.floor(context.length / ratio);
    for (let i = 0; i < num; i++) {
        context += codeStr;
    }
    fs.writeFileSync(filePath, context);
}

/**
 * 清理代码
 * @param {string} filePath 
 */
function cleanCode(filePath) {
    let context = fs.readFileSync(filePath, { encoding: "utf8" });
    let escapedOldValue = codeStr.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    let reg = new RegExp(escapedOldValue, "g");
    context = context.replace(reg, "");
    fs.writeFileSync(filePath, context);
}

/**
 * 遍历文件夹下所有文件
 * @param {string} filePath 
 */
function find(filePath) {
    let files = fs.readdirSync(filePath);
    files.forEach((val) => {
        let subPath = path.join(filePath, val);
        let stat = fs.statSync(subPath);
        // 这里只替换了 .ts 文件，如果要替换 .js 文件，可以改成 val.indexOf(".js")
        if (stat.isFile() && val.indexOf(".ts") != -1 && val.indexOf(".meta") == -1) {
            if (addShit) {
                addCode(subPath);
            }
            else {
                cleanCode(subPath);
            }
        }
        if (stat.isDirectory()) {
            find(subPath);
        }
    })
}

find(sourcePath);
console.log("操作完成");


