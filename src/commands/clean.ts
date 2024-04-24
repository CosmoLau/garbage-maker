import { Args, Command, Flags } from '@oclif/core'
import { GarbageMaker, Prop, defaultProp } from '../garbage-maker.js'
import { statSync } from 'fs'
import { input } from '@inquirer/prompts'

export default class Clean extends Command {
    static override args = {
        path: Args.string({
            name: 'path',
            required: true,
            description: '目标文件或目录的路径'
        }),
    }

    static override description = '🧹清理垃圾代码'

    static override examples = [
        '<%= config.bin %> <%= command.id %>',
    ]

    static override flags = {
        /** 清理的垃圾代码字符串  */
        code: Flags.string({
            name: 'code',
            description: '需要清理的垃圾代码',
            char: 'c',
            required: false,
        }),
    }

    public async run(): Promise<void> {
        const { args, flags } = await this.parse(Clean)

        this.log(`输入的路径：${args.path}`);
        this.log(`垃圾代码：${flags.codeStr}\n添加比例：${flags.ratio}`)

        if (!flags.code) {
            flags.code = await input({
                message: '需要清理的垃圾代码：',
                default: defaultProp.codeStr!
            })
        }
        try {
            let stat = statSync(args.path!);
            if (stat.isDirectory()) {
                this.log("传入的是一个文件夹路径");
            }
            else if (stat.isFile()) {
                this.log("传入的是一个文件路径");
            }
            else {
                this.warn("请输入正确的路径");
            }
        }
        catch (error) {
            this.error("无法读取路径，请输入正确的路径：" + error);
        }
        let prop: Prop = {
            sourcePath: args.path,
            addShit: false,
            codeStr: flags.code,
        }
        GarbageMaker.execute(prop);
    }
}
