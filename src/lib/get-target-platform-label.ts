import { TargetPlatform } from '@/types'

export default function getPlatformLabel(platform: TargetPlatform): string {
  switch (platform) {
    case TargetPlatform.WINDOWS:
      return 'Windows'
    case TargetPlatform.LINUX:
      return 'Linux'
    case TargetPlatform.ANDROID:
      return 'Android'
    case TargetPlatform.NEUTRAL:
      return 'Neutral'
  }
}
