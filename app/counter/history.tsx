import { StyleSheet, View, Text, FlatList } from 'react-native';
import { theme } from '@/theme';
import { PersistedCountdownState } from './index';
import { getFromStorage } from '@/utils/storage';
import { countdownStorageKey } from './index';
import { useEffect, useState } from 'react';
import { format } from 'date-fns';

const fullDateFormat = "LLL d yyyy, h:mm aaa";

export default function History() {
  const [countdownState, setCountdownState] = useState<PersistedCountdownState>();

  useEffect(() => {
    const init = async () => {
      const value = await getFromStorage(countdownStorageKey);
      setCountdownState(JSON.parse(value));
    };
    init();
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        style={styles.list}
        contentContainerStyle={styles.listContent}
        data={countdownState?.completedAtTimestamps}
        ListEmptyComponent={<Text style={styles.text}>No history yet</Text>}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.text}>{format(item, fullDateFormat)}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    backgroundColor: theme.colors.white,
    justifyContent: 'center',
    padding: 16,
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.black,
    backgroundColor: theme.colors.lightGrey,
    padding: 16,
  },
  list: {
    flex: 1,
    backgroundColor: theme.colors.white,
  },
  listContent: {
    marginTop: 8,
  },
  item: {
    paddingVertical: 8,
  },
});
