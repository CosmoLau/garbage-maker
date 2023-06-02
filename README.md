# garbage-maker

![GitHub](https://img.shields.io/github/license/CosmoLau/garbage-maker)

为项目中的所有 `TypeScript` 脚本添加垃圾代码。

## 背景

部分国内小游戏平台可能会对小游戏进行代码检测，未通过检测可能无法过审。

如果小游戏发布次数不多，可通过简单粗暴往代码里加垃圾代码的形式提交审核，这就是此项目的用途。

如果小游戏被多次发布，使用本项目进行过审的概率会大大降低，可以在本项目的源码中修改部分内容进行多次尝试，或者使用其他方式来完成您的需求，例如 `代码混淆`。

## 快速使用

> 本项目需要安装 [Node](https://nodejs.org/) 环境。

在终端中，按照以下格式执行命令：

```shell
node test.js [源路径文件夹](必选) clean(可选)
```

为文件夹下所有 `TypeScript` 脚本添加垃圾代码：

```shell
node test.js ./assets/script
```

清理文件夹下所有 `TypeScript` 脚本中的垃圾代码：

```shell
node test.js ./assets/script clean
```

## 为 `JavaScript` 脚本添加代码

在 `garbage-maker.js` 中进行如下修改：

```javascript
// ...
function find(filePath) {
    let files = fs.readdirSync(filePath);
    files.forEach((val) => {
        let subPath = path.join(filePath, val);
        let stat = fs.statSync(subPath);
        // 替换原来的代码： if (stat.isFile() && val.indexOf(".ts") != -1 && val.indexOf(".meta") == -1) {
        if (stat.isFile() && val.indexOf(".js") != -1 && val.indexOf(".meta") == -1) {
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
```

## 自定义部分参数

修改垃圾代码的内容，尽量用项目里不常见的代码形式：

```javascript
/** 默认添加的垃圾代码，如需定制化，可修改这个变量 */
let codeStr = "console.log();";
```

修改垃圾代码的数量比例：

```javascript
/** 添加代码的比例，这个值越大，添加的代码越少 */
let ratio = 35;
```

## LICENSE

[MIT License](./LICENSE)