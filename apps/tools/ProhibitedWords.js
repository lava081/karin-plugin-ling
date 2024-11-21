import { logger } from 'node-karin'
import { Config } from '#components'

const ProhibitedWords = async (e) => {
  if (!e.isGroup) {
    logger.debug('不在群聊，跳过监听')
    return false
  }
  let type = e.group_id
  const data = Config.GroupYaml
  type = data[`${type}`] ? type : 'default'
  const rules = (data[`${type}`] && data[`${type}`]['enable']) || ''
  if (!rules) return false
  const words = data[`${type}`]['words']
  const match = data[`${type}`]['rule']
  if (match == 0 && words.some(word => e.msg.includes(word))) {
    if ((['owner', 'admin'].includes(e.sender.role) || e.isMaster || e.isAdmin)) {
      return false
    } else {
      await e.bot.RecallMessage(e.contact, e.message_id)
      await e.reply('请不要发布违规内容', { at: true })
      return true
    }
  }
  if (match == 1 && words.some(word => e.msg === word)) {
    if ((['owner', 'admin'].includes(e.sender.role) || e.isMaster || e.isAdmin)) {
      return false
    } else {
      await e.bot.RecallMessage(e.contact, e.message_id)
      await e.reply('请不要发布违规内容', { at: true })
      return true
    }
  }
}

export default {
  ProhibitedWords,
}
