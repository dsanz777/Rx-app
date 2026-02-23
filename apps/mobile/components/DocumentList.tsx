import { StyleSheet, Text, View } from 'react-native';

type Document = {
  id: string;
  title: string;
  category: string;
  updated: string;
};

type DocumentListProps = {
  items: Document[];
};

export function DocumentList({ items }: DocumentListProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Recent References</Text>
      {items.map((doc) => (
        <View key={doc.id} style={styles.docRow}>
          <View>
            <Text style={styles.docTitle}>{doc.title}</Text>
            <Text style={styles.docMeta}>{doc.category} • {doc.updated}</Text>
          </View>
          <Text style={styles.docAction}>View</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#0F1535',
    borderRadius: 20,
    padding: 18,
    marginTop: 4
  },
  heading: {
    color: '#F6F8FF',
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 12
  },
  docRow: {
    paddingVertical: 12,
    borderBottomColor: 'rgba(255,255,255,0.08)',
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  docTitle: {
    color: '#F6F8FF',
    fontSize: 14,
    fontWeight: '500'
  },
  docMeta: {
    color: '#8893B5',
    fontSize: 12,
    marginTop: 4
  },
  docAction: {
    color: '#9AD0F5',
    fontWeight: '600'
  }
});
