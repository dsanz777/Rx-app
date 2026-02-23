import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView, StyleSheet, Text } from 'react-native';
import { SnapshotCard } from '../components/SnapshotCard';
import { FeatureTile } from '../components/FeatureTile';
import { DocumentList } from '../components/DocumentList';
import { documents, featureTiles, snapshot } from '../data/mockData';

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <SnapshotCard data={snapshot} />
        <Text style={styles.sectionHeading}>Actions</Text>
        {featureTiles.map((tile) => (
          <FeatureTile key={tile.title} {...tile} />
        ))}
        <DocumentList items={documents} />
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
    padding: 20
  },
  sectionHeading: {
    color: '#F6F8FF',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12
  }
});
