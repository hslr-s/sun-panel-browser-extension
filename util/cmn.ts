export function removeTrailingSlash(str: string) {
  if (!str)
    return str // 如果字符串为空或未定义，直接返回
  return str.replace(/\/+$/, '')
}
