import { PathLike, readFileSync, readdirSync, statSync, writeFileSync } from "fs";
import { extname, join } from "path";

/**
 * garbage-maker 类的参数接口
 */
export interface Prop {
    /** 源文件路径 */
    sourcePath: PathLike;
    /** 是否添加垃圾代码 */
    addShit?: boolean;
    /** 垃圾代码内容 */
    codeStr?: string;
    /** 添加垃圾代码的比例 */
    ratio?: number;
}

/** 默认参数 */
export const defaultProp: Prop = {
    sourcePath: "",
    addShit: true,
    codeStr: "(1+1);",
    ratio: 35,
}

/**
 * garbage-maker 核心代码类
 */
export class GarbageMaker {

    /**
     * 执行代码
     * @param prop 参数
     */
    public static execute(prop: Prop) {
        /** 已修改的文件数量 */
        let fileChangeNum: number = 0;
        // 检查可选参数
        prop.addShit = prop.addShit ?? defaultProp.addShit;
        prop.codeStr = prop.codeStr ?? defaultProp.codeStr;
        prop.ratio = prop.ratio ?? defaultProp.ratio;

        /** 添加垃圾代码 */
        let addCode = (path: PathLike) => {
            let context = readFileSync(path, 'utf8');
            let num = Math.floor(context.length * prop.ratio! / 100 / prop.codeStr?.length!);
            for (let i = 0; i < num; i++) {
                context += prop.codeStr;
            }
            writeFileSync(path, context, 'utf8');
            fileChangeNum++;
        }

        /** 清理垃圾代码 */
        let cleanCode = (path: PathLike) => {
            let context = readFileSync(path, 'utf8');
            let pattern = prop.codeStr?.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            let reg = new RegExp(pattern!, 'g');
            context = context.replace(reg, "");
            writeFileSync(path, context, 'utf8');
            fileChangeNum++;
        }

        /** 遍历文件夹 */
        let traverseFile = (path: PathLike) => {
            let files = readdirSync(path);
            files.forEach(val => {
                let subPath = join(path.toString(), val);
                let stat = statSync(subPath);
                if (stat.isFile() && (extname(subPath) == ".ts" || extname(subPath) == ".js")) {
                    prop.addShit ? addCode(subPath) : cleanCode(subPath);
                }
                if (stat.isDirectory()) {
                    traverseFile(subPath);
                }
            })
        }

        let stat = statSync(prop.sourcePath);
        if (stat.isFile() && (extname(prop.sourcePath.toString()) == ".ts" || extname(prop.sourcePath.toString()) == ".js")) {
            prop.addShit ? addCode(prop.sourcePath) : cleanCode(prop.sourcePath);
        }
        if (stat.isDirectory()) {
            traverseFile(prop.sourcePath);
        }
        console.log(`已修改 ${fileChangeNum} 个文件`);
    }

    /**
     * 检查垃圾代码是否存在
     * @param path 文件或文件夹的绝对路径
     * @param codeStr 代码字符串
     * @returns 
     */
    public static checkCode(path: PathLike, codeStr: string) {
        /** 是否存在代码 */
        let haveCode = false;

        /** 清理垃圾代码 */
        let check = (path: PathLike) => {
            let context = readFileSync(path, 'utf8');
            let pattern = codeStr?.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            let reg = new RegExp(pattern!, 'g');
            haveCode = reg.test(context) ? true : haveCode;
        }
        /** 遍历文件夹 */
        let traverseFile = (path: PathLike) => {
            let files = readdirSync(path);
            files.forEach(val => {
                let subPath = join(path.toString(), val);
                let stat = statSync(subPath);
                if (stat.isFile() && (extname(subPath) == ".ts" || extname(subPath) == ".js")) {
                    check(subPath);
                }
                if (stat.isDirectory()) {
                    traverseFile(subPath);
                }
            })
        }

        let stat = statSync(path);
        if (stat.isFile() && (extname(path.toString()) == ".ts" || extname(path.toString()) == ".js")) {
            check(path);
        }
        if (stat.isDirectory()) {
            traverseFile(path);
        }
        return haveCode;
    }
}