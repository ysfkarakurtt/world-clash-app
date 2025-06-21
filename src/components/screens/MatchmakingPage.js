import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { joinMatchQueue, listenWaitingRoom } from '../../services/firebaseService';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

const MatchmakingPage = ({ navigation, route }) => {
  const { timeLimit } = route.params || {};
  const [status, setStatus] = useState('');

  useEffect(() => {
    let unsubscribeRoom = null;
    let unsubscribeAuth = null;

    const auth = getAuth();

    unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      if (user && timeLimit) {
        setStatus('Eşleştiriliyor...');

        try {
          const result = await joinMatchQueue(timeLimit, user.uid);

          if (result.status === 'matched') {
            navigation.replace('Game', {
              gameId: result.gameId,
              myPlayerId: result.myPlayerId,
            });
          } else {
            setStatus('Oyuncu bekleniyor...');
            unsubscribeRoom = listenWaitingRoom(timeLimit, ({ gameId }) => {
              if (unsubscribeRoom) unsubscribeRoom();
              navigation.replace('Game', {
                gameId,
                myPlayerId: 'player1',
              });
            });
          }
        } catch (error) {
          console.error('Matchmaking error:', error);
          setStatus('Eşleştirme sırasında hata oluştu.');
        }
      }
    });

    
    return () => {
      if (unsubscribeAuth) unsubscribeAuth();
      if (unsubscribeRoom) unsubscribeRoom();
    };
  }, [timeLimit, navigation]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" />
      <Text style={styles.status}>{status}</Text>
    </View>
  );
};

export default MatchmakingPage;

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  status: { fontSize: 18, marginTop: 20 },
});

