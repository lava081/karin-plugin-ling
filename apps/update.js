import { Update, plugin, common } from 'node-karin'
import { Restart, makeForwardMsg } from '#lib'
import { Version } from '#components'
import _ from 'lodash'

let uping = false
export class MusicUpdate extends plugin {
  constructor () {
    super({
      name: '更新',
      event: 'message',
      priority: 1000,
      rule: [
        {
          reg: '^#?(铃|ling|零|玲)(插件)?(强制)?更新$',
          fnc: 'update',
          permission: 'master',
        },
        {
          reg: '^#?(铃|ling|零|玲)(插件)?更新日志$',
          fnc: 'update_log',
          permission: 'master',
        },
      ],
    })
  }

  async update (e = this.e) {
    if (uping) {
      e.reply(`正在更新${Version.pluginName}，请稍后...`)
      return false
    }
    e.reply(`开始执行更新操作...`)
    uping = true
    setTimeout(() => {
      uping = false
    }, 300 * 1000)

    let [name, cmd] = [Version.pluginName, 'git pull']
    if (e.msg.includes('强制')) cmd = 'git reset --hard && git pull --allow-unrelated-histories'
    try {
      const { data } = await Update.update(Version.pluginPath, cmd)
      const msg = `更新${name}...${_.isObject(data) ? `${data.message}\n${data.stderr}` : data}`
      await this.replyForward(common.makeForward(msg))
      if (!data.includes('更新成功')) return true
      try {
        await this.reply(`\n更新完成，开始重启 本次运行时间：${common.uptime()}`, { at: true })
        const restart = new Restart(e)
        restart.e = e
        await restart.CmdRestart()
        return true
      } catch (error) {
        return e.reply(`${Version.pluginName}重启失败，请手动重启以应用更新！`)
      }
    } catch (error) {
      return e.reply(`更新失败：${error.message}`, { at: true })
    } finally {
      uping = false
    }
  }

  async update_log (e = this.e) {
    try {
      const data = (await Update.getCommit({ path: Version.pluginPath, count: 10 })).replace(/\n\s*\n/g, '\n')
      const commitlist = data
        .split('\n')
        .filter(Boolean)
        .map((item) => item.trimEnd())
      e.reply(await makeForwardMsg(e, commitlist))
      return true
    } catch {
      await e.reply(`\n获取更新日志失败：\n${e.msg}`, { at: true })
      return true
    }
  }
}
