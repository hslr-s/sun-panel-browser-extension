import { v4 as uuidv4 } from 'uuid'
import { postRequest } from './request'

const host = 'http://192.168.3.136:3005/beApi/v1'
const version_name = browser.runtime.getManifest().version_name

interface info {
  version: string
  clientId: string
}

function getLocalTimeZone(): string {
  // 使用 Intl 对象的 DateTimeFormat 构造函数来获取时区
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone
  return timeZone
}

// 设置推送时间
function updatePushTimestamp() {
  storage.setItem('local:pushTime', Date.now())
}

async function getLastPushTimestamp() {
  let lastTimestamp = 0
  await storage.getItem<number>('local:pushTime').then((t) => {
    lastTimestamp = t || 0
  })

  return lastTimestamp
}

// 获取clientId，没有自动获取
async function getClientId() {
  let clientId = ''
  await storage.getItem<string>('local:clientId').then((localClientId) => {
    console.log('local:clientId', localClientId)
    clientId = localClientId || ''
  })

  if (clientId === '') {
    console.log('generateUUID', clientId)
    clientId = generateUUID()
    storage.setItem<string>('local:clientId', clientId)
  }
  console.log('clientId1', clientId)
  return clientId
}

function generateUUID() {
  return uuidv4()
}

// 向服务端推送统计数据
export async function push() {
  const clientId = await getClientId()
  const lastTimestamp = await getLastPushTimestamp()
  const currentTimestamp = Date.now()

  const data: info = {
    version: version_name as string,
    clientId,
  }

  // 允许48小时推送一次
  if (currentTimestamp - lastTimestamp > 3600 * 1000 * 48) {
    postRequest({
      url: `${host}/statistics/push`,
      headers: {
        lang: navigator.language,
        timeZone: getLocalTimeZone(),
        ltz: `${lastTimestamp}`,
        tz: `${currentTimestamp}`,
      },
      data,
    }).then(() => {
      // 推送成功更新时间戳
      updatePushTimestamp()
    })
  }
  // else {
  //   console.log('不需要执行', currentTimestamp - lastTimestamp)
  // }
}
