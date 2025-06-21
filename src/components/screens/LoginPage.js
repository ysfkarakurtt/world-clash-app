import { StyleSheet, Text, TextInput, Image,View, Pressable, Alert } from 'react-native';
import React, { useState } from 'react';
import { auth } from '../../services/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';

const LoginPage = ({ navigation }) => {
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('Hata', 'Tüm alanlar zorunludur.');
            return;
        }
        try {
            await signInWithEmailAndPassword(auth, email, password);
            navigation.replace('Home');
        } catch (error) {
            Alert.alert('Hata', error.message);
        }
    };

    return (
        <View style={styles.container}>

            <Image source={require('../../../assets/appIcon.png')} style={styles.appIcon} />

            <Text style={styles.title}>Giriş Yap</Text>
            <TextInput placeholder="E-posta" style={styles.input} value={email} onChangeText={setEmail} />
            <TextInput placeholder="Şifre" style={styles.input} value={password} onChangeText={setPassword} secureTextEntry />
            <Pressable style={styles.button} onPress={handleLogin}>
                <Text style={styles.buttonText}>Giriş Yap</Text>
            </Pressable>
            <Pressable onPress={() => navigation.navigate('Register')}>
                <Text style={styles.link}>Kayıt Ol</Text>
            </Pressable>
        </View>
    );
};

export default LoginPage;

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
    button: { backgroundColor: 'blue', padding: 15, borderRadius: 5 },
    buttonText: { color: 'white', fontWeight: 'bold', textAlign: 'center' },
    link: { marginTop: 15, color: 'blue', textAlign: 'center' }
});
