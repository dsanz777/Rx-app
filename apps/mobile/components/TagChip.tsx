import { StyleSheet, Text, View } from 'react-native';

type TagChipProps = {
  label: string;
};

export function TagChip({ label }: TagChipProps) {
  return (
    <View style={styles.chip}>
      <Text style={styles.text}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    backgroundColor: 'rgba(154, 208, 245, 0.15)',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginRight: 8,
    marginTop: 6
  },
  text: {
    color: '#9AD0F5',
    fontSize: 12,
    fontWeight: '500'
  }
});
