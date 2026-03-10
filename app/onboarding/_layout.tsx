import { Stack } from 'expo-router'

export default function OnboardingLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
      {/* Feature previews */}
      <Stack.Screen name="step-preview-1" />
      <Stack.Screen name="step-preview-2" />
      <Stack.Screen name="step-preview-3" />
      {/* Profile basics */}
      <Stack.Screen name="step-name" />
      <Stack.Screen name="age-gate" />
      <Stack.Screen name="step-position" />
      {/* Soccer identity */}
      <Stack.Screen name="step-playing-style" />
      <Stack.Screen name="step-strengths" />
      {/* Training */}
      <Stack.Screen name="step-training-setup" />
      <Stack.Screen name="step-skill-level" />
      <Stack.Screen name="step-body-type" />
      <Stack.Screen name="step-training-days" />
      {/* Physical */}
      <Stack.Screen name="step-physical" />
      {/* AI processing */}
      <Stack.Screen name="analyzing-nutrition" />
      <Stack.Screen name="step-schedule" />
      <Stack.Screen name="step-goals-input" />
      <Stack.Screen name="analyzing-goals" />
      <Stack.Screen name="step-where-play" />
      <Stack.Screen name="step-pro-player" />
      <Stack.Screen name="projected-growth" />
      <Stack.Screen name="step-video" />
      <Stack.Screen name="profile-ready" />
      {/* Health / COPPA */}
      <Stack.Screen name="step-health" />
      <Stack.Screen name="coppa-parent" />
      <Stack.Screen name="coppa-pending" />
      <Stack.Screen name="generating-plan" />
    </Stack>
  )
}
