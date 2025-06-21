import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import { auth, db } from '../../services/firebase';
import { doc, getDoc } from 'firebase/firestore';

const HomePage = ({ navigation }) => {
  const userId = auth.currentUser.uid;
  const [emailPrefix, setEmailPrefix] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      const userDoc = await getDoc(doc(db, 'users', userId));
      if (userDoc.exists()) {
        const email = userDoc.data().email || '';
        setEmailPrefix(email.split('@')[0]);
      }

      setLoading(false);
    };

    init();
  }, [userId]);

  const handleSignOut = async () => {
    await auth.signOut();
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };

  if (loading) {
    return <ActivityIndicator style={{ marginTop: 50 }} size="large" />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hoşgeldin, {emailPrefix}</Text>


      <Pressable
        style={styles.button}
        onPress={() => navigation.navigate('NewGame')}
      >
        <Text style={styles.buttonText}>Yeni Oyun</Text>
      </Pressable>

      <Pressable
        style={styles.button}
        onPress={() => navigation.navigate('ActiveGames', { userId })}
      >
        <Text style={styles.buttonText}>Aktif Oyunlar</Text>
      </Pressable>

      <Pressable
        style={styles.button}
        onPress={() => navigation.navigate('FinishedGames', { userId })}
      >
        <Text style={styles.buttonText}>Biten Oyunlar</Text>
      </Pressable>

      <Pressable
        style={[styles.button, styles.signOutButton]}
        onPress={handleSignOut}
      >
        <Text style={styles.buttonText}>Çıkış Yap</Text>
      </Pressable>
    </View>
  );
};

export default HomePage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 20
  },
  button: {
    backgroundColor: 'purple',
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
    width: '80%'
  },
  signOutButton: {
    backgroundColor: '#e74c3c',
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16
  },
});
