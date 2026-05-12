import { useNavigation } from '@react-navigation/native'
import React from 'react'
import { Button, FlatList, StyleSheet, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useHabitStore } from '../src/store/useHabitStore'

export default function Home() {
	const habits = useHabitStore((s: any) => s.habits)
	const navigation = useNavigation()
	return (
		<SafeAreaView style={styles.container}>
			<Text style={styles.header}>Meus Hábitos</Text>

			<FlatList
				data={habits}
				keyExtractor={(item) => item.id}
				renderItem={({ item }) => (
					<View style={styles.habitItem}>
						<Text style={styles.habitText}>{item.icon} {item.title}</Text>
					</View>
				)}
				ListEmptyComponent={<Text style={styles.empty}>Nenhum hábito ainda.</Text>}
			/>
	<Button title="+ Novo Hábito" onPress={() => navigation.navigate('CreateHabit' as never)} />
		</SafeAreaView>
	)
}

const styles = StyleSheet.create({
	container: { flex: 1, padding: 20, backgroundColor: '#fff' },
	header: { fontSize: 24, fontWeight: '700', marginBottom: 12 },
	habitItem: { padding: 12, borderBottomWidth: 1, borderBottomColor: '#eee' },
	habitText: { fontSize: 16 },
	empty: { textAlign: 'center', marginTop: 20, color: '#666' },
	addButton: { marginTop: 16, padding: 14, backgroundColor: '#007AFF', borderRadius: 8, alignItems: 'center' },
	addButtonText: { color: '#fff', fontWeight: '600' },
	form: { marginTop: 16 },
	input: { borderWidth: 1, borderColor: '#ddd', padding: 10, borderRadius: 6, marginBottom: 8 },
	formButtons: { flexDirection: 'row', justifyContent: 'space-between' },
	modalBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', padding: 20 },
	modalContent: { backgroundColor: '#fff', borderRadius: 8, overflow: 'hidden' },
})
