import { useSettingsStore } from '@/stores/settingsStore';

export function useUiStyle() {
  const uiStyle = useSettingsStore((s) => s.uiStyle);
  return {
    uiStyle,
    isClawLens: uiStyle === 'clawlens',
  };
}
