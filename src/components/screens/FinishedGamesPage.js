import React, { useEffect, useState } from 'react'
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    ActivityIndicator
} from 'react-native'
import { getFinishedGames } from '../../services/firebaseService'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../../services/firebase'

export default function FinishedGamesPage({ route }) {
    const { userId } = route.params
    const [games, setGames] = useState([])
    const [userMap, setUserMap] = useState({})
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchGames()
    }, [])

    const fetchGames = async () => {
        let finished = await getFinishedGames(userId);

        const getTime = g => {
            const ts = g.finishedAt || g.updatedAt || g.createdAt
            return ts?.toMillis?.() ?? ts?.seconds * 1000 ?? 0
        }
        finished.sort((a, b) => getTime(b) - getTime(a))

        setGames(finished);   
        const uids = new Set()
        finished.forEach(g => {
            uids.add(g.player1.userId)
            uids.add(g.player2.userId)
        })
        const map = {}
        await Promise.all(
            Array.from(uids).map(async uid => {
                const snap = await getDoc(doc(db, 'users', uid))
                map[uid] = snap.exists()
                    ? snap.data().email.split('@')[0]
                    : uid.slice(0, 6)
            })
        )
        setUserMap(map)
        setLoading(false)
    }

    const formatDate = ts => {
        const d = ts.toDate()
        return `${d.getDate()}.${d.getMonth() + 1}.${d.getFullYear()} ${d.getHours()}:${String(d.getMinutes()).padStart(2, '0')}`
    }

    const getResultText = game => {
        return game.winner === userId ? 'Kazandın!' : 'Kaybettin!'
    }

    if (loading) {
        return <ActivityIndicator style={{ marginTop: 20 }} />
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Biten Oyunlar</Text>
            {games.length === 0 ? (
                <Text style={{ marginTop: 20 }}>Henüz bitmiş bir oyun bulunmuyor.</Text>
            ) : (
                <FlatList
                    data={games}
                    keyExtractor={item => item.id}
                    renderItem={({ item }) => {
                        const p1 = userMap[item.player1.userId]
                        const p2 = userMap[item.player2.userId]
                        const whenTs = item.finishedAt || item.updatedAt || item.createdAt
                        const when = whenTs ? formatDate(whenTs) : '-'
                        const isWin = item.winner === userId

                        return (
                            <View style={[styles.gameItem, isWin ? styles.winItem : styles.loseItem]}>
                                <Text style={styles.gameText}>
                                    {p1} vs {p2} ➔ {getResultText(item)}
                                </Text>
                                <Text style={styles.tsText}>{when}</Text>
                            </View>
                        )
                    }}
                />
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, marginTop: 75 },
    title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
    gameItem: {
        padding: 15,
        borderRadius: 10,
        marginBottom: 10
    },
    winItem: { backgroundColor: '#2ecc71' },
    loseItem: { backgroundColor: '#e74c3c' },
    gameText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16
    },
    tsText: {
        color: 'rgba(255,255,255,0.8)',
        marginTop: 4,
        textAlign: 'right',
        fontSize: 12
    }
})
