import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Pressable,
} from 'react-native';
import { theme } from '@/theme';
import AntDesign from '@expo/vector-icons/AntDesign';

type Props = {
  name: string;
  isCompleted?: boolean;
  onDelete: () => void;
  onToggleCompleted: () => void;
};

const ShoppingListItem = ({
  name,
  isCompleted = false,
  onDelete,
  onToggleCompleted,
}: Props) => {
  const handleDelete = () => {
    Alert.alert('Delete', `Are you sure you want to delete ${name}?`, [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: onDelete,
      },
    ]);
  };

  return (
    <Pressable
      style={[styles.itemContainer, isCompleted && styles.completedContainer]}
      onPress={onToggleCompleted}
    >
      <Text style={[styles.text, isCompleted && styles.completedText]}>
        {name}
      </Text>
      <TouchableOpacity
        onPress={handleDelete}
        disabled={isCompleted}
        activeOpacity={0.8}
      >
        <AntDesign
          name="closecircle"
          size={24}
          color={isCompleted ? theme.colors.grey : theme.colors.red}
        />
      </TouchableOpacity>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.cerulean,
    paddingHorizontal: 18,
    paddingVertical: 16,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  completedContainer: {
    backgroundColor: theme.colors.lightGrey,
    borderBottomColor: theme.colors.lightGrey,
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: theme.colors.grey,
  },
  completedButton: {
    backgroundColor: theme.colors.grey,
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ShoppingListItem;
