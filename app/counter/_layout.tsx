import { Link, Stack } from 'expo-router';
import { Pressable, Text } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { theme } from '@/theme';

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: 'Counter',
          headerRight: () => (
            <Link href="/counter/history" asChild>
              <Pressable hitSlop={20}>
                <MaterialIcons
                  name="history"
                  size={32}
                  color={theme.colors.black}
                />
              </Pressable>
            </Link>
          ),
        }}
      />
      <Stack.Screen
        name="history"
        options={{
          title: 'History',
        }}
      />
    </Stack>
  );
}
