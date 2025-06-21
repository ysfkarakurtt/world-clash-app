import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';

const NewGamePage = ({ navigation }) => {
  const handleStartGame = (timeLimit) => {
    navigation.navigate('Matchmaking', { timeLimit });

  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Süre Seçimi</Text>

      {[2, 5, 12 * 60, 24 * 60].map((t) => (
        <Pressable
          key={t}
          style={styles.button}
          onPress={() => handleStartGame(t)}
        >
          <Text style={styles.buttonText}>
            {t < 60 ? `${t} Dakika` : `${t / 60} Saat`}
          </Text>
        </Pressable>
      ))}
    </View>
  );
};

export default NewGamePage;

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 30 },
  button: { backgroundColor: '#3498db', padding: 15, borderRadius: 10, marginVertical: 10, width: '80%' },
  buttonText: { color: 'white', textAlign: 'center', fontSize: 16 },
});
