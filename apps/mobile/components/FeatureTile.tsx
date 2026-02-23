import { Link } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export type FeatureTileProps = {
  title: string;
  subtitle: string;
  href: string;
};

export function FeatureTile({ title, subtitle, href }: FeatureTileProps) {
  return (
    <Link href={href} asChild>
      <Pressable style={({ pressed }) => [styles.tile, pressed && styles.pressed]}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
        <Text style={styles.cta}>Open →</Text>
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  tile: {
    backgroundColor: '#102C57',
    borderRadius: 16,
    padding: 16,
    marginBottom: 14
  },
  pressed: {
    opacity: 0.8
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#F5F5F5',
    marginBottom: 6
  },
  subtitle: {
    fontSize: 13,
    color: '#C8D7FF'
  },
  cta: {
    marginTop: 10,
    fontSize: 12,
    fontWeight: '500',
    color: '#9AD0F5'
  }
});
