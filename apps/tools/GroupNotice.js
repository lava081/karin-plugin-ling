import { karin } from 'node-karin'
import { Config } from '#components'

const JoinGroupMsg = async (e, group_id, user_id) => {
  const data = Config.Other.accept.BlackGroup
  if (!data.includes(group_id)) {
    if (user_id === e.self_id) {
      switch (Config.Other.welcome?.self.mode) {
        case '0':
        case 0:
          return false
        case '2':
        case 2:
          return await e.reply(Config.Other.welcome?.self.GroupMessage || '\n欢迎加入本群୯(⁠*⁠´⁠ω⁠｀⁠*⁠)୬', { at: true })
      }
    }
    switch (Config.Other.welcome?.default.mode) {
      case '0':
      case 0:
        return false
      default:
        return await e.reply(Config.Other.welcome?.default.GroupMessage || '\n欢迎加入本群୯(⁠*⁠´⁠ω⁠｀⁠*⁠)୬', { at: true })
    }
  }
  return false
}
const ExitGroupMsg = async (e, group_id, user_id) => {
  const data = Config.Other.accept.BlackGroup
  if (data.includes(e.group_id)) return false
  await e.reply(`用户『${user_id}』丢下我们一个人走了`)
  return true
}

export default {
  JoinGroupMsg,
  ExitGroupMsg,
}
