/**
 * 用户偏好 Store
 * 负责用户口味、难度偏好设置
 */
import { ref } from 'vue'
import { preferencesApi } from '@/api'

export function usePreferencesStore() {
  const preferences = ref({ taste: '不限', difficulty: '不限' })

  // 加载用户偏好
  const loadPreferences = async () => {
    try {
      const res = await preferencesApi.get()
      if (res.data.success && res.data.data) {
        preferences.value = {
          taste: res.data.data.taste_preference || '不限',
          difficulty: res.data.data.difficulty_preference || '不限'
        }
      }
    } catch (e) {
      // 加载偏好失败
    }
  }

  // 保存用户偏好
  const savePreferences = async (newPrefs) => {
    try {
      await preferencesApi.update({
        taste_preference: newPrefs.taste,
        difficulty_preference: newPrefs.difficulty
      })
      preferences.value = newPrefs
    } catch (e) {
      throw e
    }
  }

  return {
    preferences,
    loadPreferences,
    savePreferences
  }
}