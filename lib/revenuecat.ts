import Purchases, { LOG_LEVEL } from 'react-native-purchases'
import { Platform } from 'react-native'

const REVENUECAT_IOS_API_KEY = process.env.EXPO_PUBLIC_REVENUECAT_IOS_KEY || ''
const REVENUECAT_ANDROID_API_KEY = process.env.EXPO_PUBLIC_REVENUECAT_ANDROID_KEY || ''
const PREMIUM_ENTITLEMENT_ID = 'premium'

export function initRevenueCat(userId: string) {
  Purchases.setLogLevel(LOG_LEVEL.DEBUG)

  if (Platform.OS === 'ios') {
    Purchases.configure({ apiKey: REVENUECAT_IOS_API_KEY, appUserID: userId })
  } else if (Platform.OS === 'android') {
    Purchases.configure({ apiKey: REVENUECAT_ANDROID_API_KEY, appUserID: userId })
  }
}

export async function checkSubscription(): Promise<boolean> {
  try {
    const customerInfo = await Purchases.getCustomerInfo()
    return customerInfo.entitlements.active[PREMIUM_ENTITLEMENT_ID] !== undefined
  } catch {
    return false
  }
}
