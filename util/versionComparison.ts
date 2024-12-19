type Version = string

function compareVersions(version1: Version, version2: Version): -1 | 0 | 1 {
  // 将版本号拆分成数组，并去除非数字部分
  const parts1 = version1.split('.').map((part) => {
    return part.split(/[a-z]/i)[0] // 忽略非数字部分
  })
  const parts2 = version2.split('.').map((part) => {
    return part.split(/[a-z]/i)[0] // 忽略非数字部分
  })

  // 将拆分后的字符串数组转换为数字数组
  const nums1 = parts1.map(part => Number.parseInt(part, 10))
  const nums2 = parts2.map(part => Number.parseInt(part, 10))

  // 确保两个版本号数组长度相同
  const maxLength = Math.max(nums1.length, nums2.length)
  nums1.length = maxLength
  nums2.length = maxLength

  // 逐位比较版本号
  for (let i = 0; i < maxLength; i++) {
    if (nums1[i] > nums2[i])
      return 1
    if (nums1[i] < nums2[i])
      return -1
  }

  // 如果所有对应的数字都相等，则版本号相等
  return 0
}

/**
 * 是否为支持Sun-Panel当前的版本号，一般比较某些功能是否支持当前的Sun-Panel版本
 * @param supportLowVersion 功能对sun-panel支持的最低版本
 * @param currentSunPanelVersion sun-panel当前版本
 * @returns boolean
 */
export function supportedSunPanelVersion(supportLowVersion: Version, currentSunPanelVersion: Version) {
  return compareVersions(supportLowVersion, currentSunPanelVersion) === -1 || compareVersions(supportLowVersion, currentSunPanelVersion) === 0
}
