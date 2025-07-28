import { StyleSheet, Text, TextStyle, View } from "react-native";

type Props = {
  number: number;
  unit: string;
  textStyle?: TextStyle;
}

export default function TimeSegment({ number, unit, textStyle = {} }: Props) {
  return (
    <View style={styles.container}>
      <Text style={[styles.number, textStyle]}>{number}</Text>
      <Text style={styles.unit}>{unit}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 12,
    margin: 4,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  number: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  unit: {
    fontSize: 24,
    fontWeight: 'bold',
    fontVariant: ['tabular-nums'],
  },
});