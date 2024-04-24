import { Args, Command, Flags } from '@oclif/core'
import { statSync } from 'fs'
import { GarbageMaker, Prop, defaultProp } from '../garbage-maker.js'
import { confirm, input } from '@inquirer/prompts'

export default class Add extends Command {
    static override args = {
        path: Args.string({
            name: 'path',
            required: true,
            description: '目标文件或目录的路径'
        }),
    }

    static override description = '➕添加垃圾代码'

    static override examples = [
        '<%= config.bin %> <%= command.id %>',
    ]

    static override flags = {
        /** 添加的垃圾代码字符串  */
        code: Flags.string({
            name: 'code',
            description: '自定义添加的垃圾代码',
            char: 'c',
            required: false,
        }),
        /** 添加垃圾代码的比例 */
        ratio: Flags.string({
            name: 'ratio',
            description: '添加垃圾代码的比例',
            char: 'r',
            required: false,
        })
    }

    public async run(): Promise<void> {
        const { args, flags } = await this.parse(Add)

        this.log(`输入的路径：${args.path}`);
        this.log(`垃圾代码：${flags.code}\n添加比例：${flags.ratio}`)
        
        if (!flags.code) {
            // 如果没有在标志中传参，对其进行询问
            flags.code = await input({
                message: '想要添加的垃圾代码：',
                default: defaultProp.codeStr!
            })
        }
        // 检查文件中是否包含垃圾代码
        let checkCodeConfirm = true;
        if (GarbageMaker.checkCode(args.path, flags.code)) {
            checkCodeConfirm = await confirm({
                message: '现有代码中已包含垃圾代码，是否继续添加？',
                default: false,
            })
        }
        if (!checkCodeConfirm) {
            console.log("已取消添加代码");
            return;
        }
        // 如果没有在标志中传参，对其进行询问
        if (!flags.ratio) {
            flags.ratio = await input({
                message: '添加垃圾代码的比例：',
                default: defaultProp.ratio?.toString()
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
            addShit: true,
            codeStr: flags.code,
            ratio: flags.ratio ? Number(flags.ratio) : undefined,
        }
        GarbageMaker.execute(prop);
    }
}
