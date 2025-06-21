import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View, Image, Pressable, Alert } from 'react-native';
import { auth, db } from '../../services/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

const RegisterPage = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');


  const validateEmail = (email) =>
    /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email);

  const validatePassword = (password) =>
    password.length >= 8 &&
    /[A-Z]/.test(password) &&
    /[a-z]/.test(password) &&
    /\d/.test(password);

  const handleRegister = async () => {
    if (!email || !password) {
      Alert.alert('Hata', 'Tüm alanlar zorunludur.');
      return;
    }
    if (!validateEmail(email)) {
      Alert.alert('Hatalı E-Posta', 'Geçerli bir e-posta giriniz.');
      return;
    }

    if (!validatePassword(password)) {
      Alert.alert(
        'Zayıf Şifre',
        'Şifre en az 8 karakter, büyük harf, küçük harf ve rakam içermelidir.'
      );
      return;
    }
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(db, 'users', user.uid), {
        email: user.email,
        gamesPlayed: 0,
        gamesWon: 0,
      });

      navigation.replace('Login');
    } catch (error) {
      console.error('Kayıt Hatası:', error);
      Alert.alert('Hata', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require('../../../assets/appIcon.png')} style={styles.appIcon} />
      <Text style={styles.title}>Kayıt Ol</Text>
      <TextInput
        placeholder="E-posta"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        placeholder="Şifre"
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Pressable style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Kayıt Ol</Text>
      </Pressable>
      <Pressable onPress={() => navigation.navigate('Login')}>
        <Text style={styles.link}>Giriş Yap</Text>
      </Pressable>
    </View>
  );
};

export default RegisterPage;

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  appIcon: {
    width: 300,
    height: 300,
    marginBottom: 20,
    resizeMode: 'contain',
    borderRadius: 10,
  },
  input: { borderWidth: 1, marginBottom: 10, padding: 10, borderRadius: 5 },
  button: { backgroundColor: 'green', padding: 15, borderRadius: 5 },
  buttonText: { color: 'white', fontWeight: 'bold', textAlign: 'center' },
  link: { marginTop: 15, color: 'blue', textAlign: 'center' }
});
