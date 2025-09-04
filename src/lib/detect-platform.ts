import { TargetPlatform } from '@/types'

export function detectPlatform(): TargetPlatform {
  if (typeof navigator === 'undefined') {
    // In case this is called during SSR
    return TargetPlatform.WINDOWS
  }

  const userAgent = navigator.userAgent.toLowerCase()

  if (userAgent.includes('windows')) {
    return TargetPlatform.WINDOWS
  }

  if (userAgent.includes('android')) {
    return TargetPlatform.ANDROID
  }

  if (userAgent.includes('linux')) {
    return TargetPlatform.LINUX
  }

  return TargetPlatform.NEUTRAL
}
