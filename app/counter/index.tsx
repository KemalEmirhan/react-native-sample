import { StyleSheet, View, Text } from 'react-native';
import { theme } from '@/theme';

export default function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Counter</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.white,
    justifyContent: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.black,
    textAlign: 'center',
  },
});
