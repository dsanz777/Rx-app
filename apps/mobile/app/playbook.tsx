import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { playbooks } from '../data/mockData';
import { TagChip } from '../components/TagChip';

export default function PlaybookScreen() {
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        {playbooks.map((playbook) => (
          <View key={playbook.id} style={styles.card}>
            <Text style={styles.title}>{playbook.title}</Text>
            <Text style={styles.summary}>{playbook.summary}</Text>
            <View style={styles.tagRow}>
              {playbook.tags.map((tag) => (
                <TagChip key={`${playbook.id}-${tag}`} label={tag} />
              ))}
            </View>
            <Text style={styles.meta}>Updated {playbook.updated}</Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#050B1F'
  },
  container: {
    padding: 20,
    gap: 16
  },
  card: {
    backgroundColor: '#0F1535',
    borderRadius: 20,
    padding: 18
  },
  title: {
    color: '#F6F8FF',
    fontSize: 17,
    fontWeight: '600'
  },
  summary: {
    color: '#B2BEDC',
    fontSize: 14,
    marginTop: 8,
    lineHeight: 20
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8
  },
  meta: {
    color: '#7C8DB5',
    marginTop: 12,
    fontSize: 12
  }
});
