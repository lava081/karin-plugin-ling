import { karin, segment } from 'node-karin'
import { Config } from '#components'

export const 续火 = karin.task('续火', Config.Cof.corn || '0 0 0 * * ?', async () => {
  const bots = karin.getBotAll()
  const list = ['group', 'friend']
  for (const type of list) {
    for (const id of Config.Cof.List[type] || '') {
      try {
        const msgs = Config.Cof.msg
        const Random = Math.floor(Math.random() * msgs.length)
        const msg = msgs[Random]
        const elements = [segment.text(msg)]
        const contact = karin[type === 'group' ? 'contactGroup' : 'contactFriend'](id)
        for (const bot of bots) {
          karin.sendMsg(bot.self_id, contact, elements)
        }
      } catch (error) { }
    }
  }
}, { name: '续火' })
