import { useEffect, useState } from 'react';
import {
  StyleSheet,
  TextInput,
  FlatList,
  View,
  Text,
  LayoutAnimation,
  ActivityIndicator,
} from 'react-native';
import { theme } from '@/theme';
import ShoppingListItem from '@/components/ShoppingListItem';
import { getFromStorage, saveToStorage } from '@/utils/storage';
import * as Haptics from 'expo-haptics';

const STORAGE_KEY = 'shopping-list';

type ShoppingListItemType = {
  id: string;
  name: string;
  isCompleted: boolean;
};

export default function App() {
  const [value, setValue] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [shoppingList, setShoppingList] = useState<ShoppingListItemType[]>([]);

  useEffect(() => {
    const fetchInitial = async () => {
      const shoppingList = await getFromStorage(STORAGE_KEY);
      if (shoppingList) {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setShoppingList(shoppingList);
        setIsLoading(false);
      }
    };
    fetchInitial();
  }, []);

  const handleSubmit = () => {
    if (value) {
      const newItem = [
        { id: new Date().toTimeString(), name: value, isCompleted: false },
        ...shoppingList,
      ];
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setShoppingList(newItem);
      setValue('');
      saveToStorage(STORAGE_KEY, newItem);
    }
  };

  const handleDelete = (id: string) => {
    const newShoppingList = shoppingList.filter((item) => item.id !== id);
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setShoppingList(newShoppingList);
    saveToStorage(STORAGE_KEY, newShoppingList);
  };

  const handleToggleCompleted = (id: string) => {
    const newShoppingList = shoppingList.map((item) =>
      item.id === id ? { ...item, isCompleted: !item.isCompleted } : item
    );
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    setShoppingList(newShoppingList);
    saveToStorage(STORAGE_KEY, newShoppingList);
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.black} />
      </View>
    );
  }

  return (
    <FlatList
      data={shoppingList}
      contentContainerStyle={styles.contentContainer}
      style={styles.container}
      stickyHeaderIndices={[0]}
      keyExtractor={(item) => item.id}
      ListEmptyComponent={
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Your shopping list is empty</Text>
        </View>
      }
      ListHeaderComponent={
        <TextInput
          style={styles.input}
          placeholder="E.g. Coffee"
          value={value}
          onChangeText={setValue}
          returnKeyType="done"
          onSubmitEditing={handleSubmit}
        />
      }
      renderItem={({ item }) => (
        <ShoppingListItem
          name={item.name}
          isCompleted={item.isCompleted}
          onDelete={() => handleDelete(item.id)}
          onToggleCompleted={() => handleToggleCompleted(item.id)}
        />
      )}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.white,
    paddingVertical: 16,
  },
  contentContainer: {
    paddingBottom: 24,
  },
  input: {
    borderColor: theme.colors.grey,
    borderWidth: 2,
    padding: 12,
    marginHorizontal: 12,
    marginVertical: 12,
    fontSize: 18,
    borderRadius: 6,
    backgroundColor: theme.colors.white,
  },
  emptyContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 18,
  },
  emptyText: {
    fontSize: 18,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.white,
  },
});
