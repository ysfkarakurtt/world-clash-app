import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  FlatList,
  Pressable,
  StyleSheet,
  ActivityIndicator
} from 'react-native'
import { getActiveGames } from '../../services/firebaseService'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../../services/firebase'

const DATE_FORMAT = ts => {
  const d = ts.toDate()
  return `${d.getDate()}.${d.getMonth() + 1}.${d.getFullYear()} ${d.getHours()}:${String(d.getMinutes()).padStart(2, '0')}`
}

export default function ActiveGamesPage({ navigation, route }) {
  const { userId } = route.params
  const [games, setGames] = useState([])
  const [userMap, setUserMap] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchGames()
  }, [])

  const fetchGames = async () => {
    let active = await getActiveGames(userId)
    active.sort((a, b) => {
      const ta = a.createdAt?.toMillis?.() ?? a.createdAt?.seconds * 1000 ?? 0
      const tb = b.createdAt?.toMillis?.() ?? b.createdAt?.seconds * 1000 ?? 0
      return tb - ta
    })

    setGames(active)
    const uids = new Set()
    active.forEach(g => {
      uids.add(g.player1.userId)
      uids.add(g.player2.userId)
    })
    const map = {}
    await Promise.all(Array.from(uids).map(async uid => {
      try {
        const snap = await getDoc(doc(db, 'users', uid))
        if (snap.exists()) {
          const email = snap.data().email || ''
          map[uid] = email.split('@')[0]
        } else {
          map[uid] = uid.slice(0, 6)
        }
      } catch {
        map[uid] = uid.slice(0, 6)
      }
    }))
    setUserMap(map)
    setLoading(false)
  }

  const handleSelectGame = game => {
    navigation.navigate('Game', {
      gameId: game.id,
      myPlayerId: game.player1.userId === userId ? 'player1' : 'player2'
    })
  }

  if (loading) {
    return <ActivityIndicator style={{ marginTop: 20 }} />
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Aktif Oyunlar</Text>
      {games.length === 0 ? (
        <Text style={{ marginTop: 20 }}>Şu anda aktif bir oyununuz yok.</Text>
      ) : (
        <FlatList
          data={games}
          keyExtractor={item => item.id}
          renderItem={({ item }) => {
            const p1 = userMap[item.player1.userId]
            const p2 = userMap[item.player2.userId]
            const when = item.createdAt ? DATE_FORMAT(item.createdAt) : '-'
            return (
              <Pressable
                style={styles.gameItem}
                onPress={() => handleSelectGame(item)}
              >
                <View style={styles.infoRow}>
                  <Text style={styles.gameText}>{p1} vs {p2}</Text>
                  <Text style={styles.tsText}>{when}</Text>
                </View>
              </Pressable>
            )
          }}
        />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, marginTop: 75 },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20
  },
  gameItem: {
    padding: 15,
    backgroundColor: '#3498db',
    borderRadius: 10,
    marginBottom: 10,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  gameText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16
  },
  tsText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12
  }
})
