import { StyleSheet, Text, View } from 'react-native';

type SnapshotCardProps = {
  data: {
    patient: string;
    updatedAt: string;
    primaryConcern: string;
    vitals: Record<string, string>;
    notes: string[];
  };
};

export function SnapshotCard({ data }: SnapshotCardProps) {
  const vitalEntries = Object.entries(data.vitals);
  return (
    <View style={styles.card}>
      <Text style={styles.label}>Snapshot</Text>
      <Text style={styles.patient}>{data.patient}</Text>
      <Text style={styles.updated}>Updated {data.updatedAt}</Text>
      <Text style={styles.concern}>{data.primaryConcern}</Text>
      <View style={styles.vitalRow}>
        {vitalEntries.map(([label, value]) => (
          <View key={label} style={styles.vitalBlock}>
            <Text style={styles.vitalLabel}>{label}</Text>
            <Text style={styles.vitalValue}>{value}</Text>
          </View>
        ))}
      </View>
      <View style={styles.notes}>
        {data.notes.map((note) => (
          <Text key={note} style={styles.noteLine}>• {note}</Text>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#0B1F3A',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20
  },
  label: {
    color: '#9AD0F5',
    fontSize: 12,
    letterSpacing: 1,
    textTransform: 'uppercase'
  },
  patient: {
    color: '#F6F8FF',
    fontSize: 22,
    fontWeight: '600',
    marginTop: 6
  },
  updated: {
    color: '#B2BEDC',
    fontSize: 12,
    marginTop: 2
  },
  concern: {
    color: '#E1E6F9',
    marginTop: 12,
    fontSize: 15,
    lineHeight: 20
  },
  vitalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16
  },
  vitalBlock: {
    flex: 1
  },
  vitalLabel: {
    color: '#7C8DB5',
    textTransform: 'uppercase',
    fontSize: 10,
    letterSpacing: 0.5
  },
  vitalValue: {
    color: '#F6F8FF',
    fontSize: 16,
    fontWeight: '500'
  },
  notes: {
    marginTop: 16,
    gap: 4
  },
  noteLine: {
    color: '#C3CFEF',
    fontSize: 13,
    lineHeight: 18
  }
});
