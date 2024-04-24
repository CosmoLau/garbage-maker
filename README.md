# garbage-maker

![GitHub](https://img.shields.io/github/license/CosmoLau/garbage-maker)

为项目中的所有 `JavaScript` 和 `TypeScript` 脚本添加垃圾代码。

## 背景

部分国内小游戏平台可能会对小游戏进行代码检测，未通过检测可能无法过审。

如果小游戏发布次数不多，可通过简单粗暴往代码里加垃圾代码的形式提交审核，这就是此项目的用途。

如果小游戏被多次发布，使用本项目进行过审的概率会大大降低，可以在本项目的源码中修改部分内容进行多次尝试，或者使用其他方式来完成您的需求，例如 `代码混淆`。

## 快速使用

> 本项目需要安装 [Node](https://nodejs.org/) 环境。

使用你喜欢的包管理器全局安装 `garbage-maker`：

```shell
npm install -g garbage-maker
```

添加垃圾代码：

```shell
garbage-maker add [文件或目录的绝对路径]
```

清理垃圾代码：

```shell
garbage-maker clean [文件或目录的绝对路径]
```

查看 `garbage-maker` 所有命令的帮助：

```shell
garbage-maker --help
```

查看指定命令的帮助：

```shell
garbage-maker add --help
```

## 自定义添加垃圾代码

使用 `-c` 或者 `--code` 标志（flag）来添加自定义的垃圾代码：

```shell
garbage-maker add [绝对路径] -c "console.log();"
# 或者
garbage-maker add [绝对路径] --code "console.log();"
```

> _注意_：自定义添加的垃圾代码最好是未出现在已有代码中的。
> 在使用 `clean` 命令清理代码时，需要传入与 `add` 命令相同的 `--code` 标志，否则会清理默认的 `(1+1);` 垃圾代码。

使用 `-r` 或者 `--ratio` 标志（flag）控制添加垃圾代码的百分比，即根据文件的字符数量，来添加垃圾代码的字符数量。

```shell
garbage-maker add [绝对路径] -r 50
# 或者
garbage-maker add [绝对路径] --ratio 50
```

> _注意_：`--ratio` 标志的值为百分比的数字部分，即示例中的 `50` 相当于 `50%`。

## 修改源码

该分支使用 [oclif](https://github.com/oclif/oclif) 作为 CLI 框架进行开发，如需对源码进行修改，按照以下方法进行：

1. 安装依赖：

    ```shell
    npm install
    ```

2. 调试命令：

    ```shell
    # Windows
    ./bin/dev.cmd --help
    # MacOS 或 Linux
    ./bin/dev.js --help
    ```

3. 构建 CLI：

    ```shell
    npm link
    ```

## 分支说明

本项目以 `main` 作为默认分支，老版本的 JavaScript 代码仍包含在本项目中，可以查看 [garbage-maker.js](./garbage-maker.js)。

如需查看老版本文档，可以切换至 `master` 分支查看 `README.md`。

## 赞助

如果该项目对你有帮助，不妨点个 `star` 来支持我。

也可以通过其他方式来赞助我，从零开始将我培养成一个开源工具人。

[爱发电主页](https://afdian.net/a/CosmoLau)

## LICENSE

[MIT License](./LICENSE)
