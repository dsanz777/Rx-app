import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: '#050B1F' },
        headerTintColor: '#F6F8FF',
        contentStyle: { backgroundColor: '#050B1F' }
      }}
    >
      <Stack.Screen name="index" options={{ title: 'Snapshot' }} />
      <Stack.Screen name="playbook" options={{ title: 'Playbooks' }} />
    </Stack>
  );
}
