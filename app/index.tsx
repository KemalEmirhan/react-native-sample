import { useState } from 'react';
import { StyleSheet, TextInput, FlatList, View, Text } from 'react-native';
import { theme } from '@/theme';
import ShoppingListItem from '@/components/ShoppingListItem';

type ShoppingListItemType = {
  id: string;
  name: string;
  isCompleted: boolean;
};

export default function App() {
  const [value, setValue] = useState('');
  const [shoppingList, setShoppingList] = useState<ShoppingListItemType[]>([]);

  const handleSubmit = () => {
    if (value) {
      const newItem = [
        { id: new Date().toTimeString(), name: value, isCompleted: false },
        ...shoppingList,
      ];
      setShoppingList(newItem);
      setValue('');
    }
  };

  const handleDelete = (id: string) => {
    const newShoppingList = shoppingList.filter((item) => item.id !== id);
    setShoppingList(newShoppingList);
  };

  const handleToggleCompleted = (id: string) => {
    const newShoppingList = shoppingList.map((item) =>
      item.id === id ? { ...item, isCompleted: !item.isCompleted } : item
    );
    setShoppingList(newShoppingList);
  };

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
    padding: 12,
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
});
