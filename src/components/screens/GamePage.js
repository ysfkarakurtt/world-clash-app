import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  FlatList,
  Alert,
  ActivityIndicator,
  Modal,
  TouchableOpacity,
  Image
} from 'react-native'
import { doc, onSnapshot, updateDoc } from 'firebase/firestore'
import { db } from '../../services/firebase'
import {
  evaluateMove,
  isValidWord,
  areCellsAligned
} from '../../services/gameLogic'
import PassButton from '../ui/PassButton'
import EndTurnButton from '../ui/EndTurnButton'
import GiveUpButton from '../ui/GiveUpButton'
import GamePageTimer from '../ui/Timer'
import jokerImg from '../../../assets/joker.png'

const GRID_SIZE = 15
const CENTER = { row: 7, col: 7 }

export default function GamePage({ route, navigation }) {
  const { gameId, myPlayerId } = route.params
  const [gameData, setGameData] = useState(null)
  const [word, setWord] = useState('')
  const [selected, setSelected] = useState([])
  const [loading, setLoading] = useState(true)
  const [evaluated, setEvaluated] = useState(null)
  const [jokerModalVisible, setJokerModalVisible] = useState(false)
  const [jokerMap, setJokerMap] = useState({})
  const [jokerIndex, setJokerIndex] = useState(null)

  useEffect(() => {
    const ref = doc(db, 'games', gameId)
    const unsub = onSnapshot(ref, snap => {
      if (!snap.exists()) return
      const data = { id: snap.id, ...snap.data() }
      if (data.status === 'finished') {
        navigation.replace('FinishedGames', { userId: myPlayerId })
        return
      }
      setGameData(data)
      setLoading(false)
    })
    return () => unsub()
  }, [gameId])

  const handleCell = (row, col) => {
    if (!gameData || gameData.turnPlayerId !== myPlayerId) return
    const exists = selected.find(c => c.row === row && c.col === col)
    setSelected(exists
      ? selected.filter(c => !(c.row === row && c.col === col))
      : [...selected, { row, col }]
    )
  }

  const handleRackPress = (letter, idx) => {
    if (letter !== 'JOKER' || gameData.turnPlayerId !== myPlayerId) return
    setJokerIndex(idx)
    setJokerModalVisible(true)
  }

  const handleWordChange = txt => {
    const u = txt.toUpperCase()
    setWord(u)
    if (
      gameData &&
      u.length === selected.length &&
      areCellsAligned(selected) &&
      isValidWord(u)
    ) {
      setEvaluated(evaluateMove(u, gameData.matrix, selected, jokerMap))
    } else {
      setEvaluated(null)
    }
  }

  const chooseJokerLetter = ch => {
    setJokerMap(m => ({ ...m, [jokerIndex]: ch }))
    setJokerModalVisible(false)
  }

  const handleSubmit = async () => {
    if (!gameData) return
    if (!word) {
      return Alert.alert('Hata', 'Önce bir kelime girin.')
    }
    if (word.length !== selected.length) {
      return Alert.alert('Hata', 'Kelime uzunluğu kadar hücre seçmelisiniz.')
    }
    if (!areCellsAligned(selected)) {
      return Alert.alert('Hata', 'Seçilen hücreler düz hatta olmalı.')
    }
    if (!isValidWord(word)) {
      return Alert.alert('Hata', 'Geçerli bir kelime girin!')
    }

    const flat = gameData.matrix
    const hasPlays = flat.some(c => c.letter !== '')
    if (!hasPlays) {
      if (!selected.find(c => c.row === CENTER.row && c.col === CENTER.col)) {
        return Alert.alert('Hata', 'İlk hamle ortadan başlamalı.')
      }
    } else {
      const offs = [
        -GRID_SIZE - 1, -GRID_SIZE, -GRID_SIZE + 1,
        -1, 1, GRID_SIZE - 1, GRID_SIZE, GRID_SIZE + 1
      ]
      const touches = selected.some(({ row, col }) => {
        const idx = row * GRID_SIZE + col
        return offs.some(off => {
          const ni = idx + off
          return ni >= 0 && ni < GRID_SIZE * GRID_SIZE && flat[ni].letter !== ''
        })
      })
      if (!touches) {
        return Alert.alert('Hata', 'Yeni kelime en az bir mevcut harfe komşu olmalı.')
      }
    }

    const { userScore, opponentScore, effects } =
      evaluateMove(word, gameData.matrix, selected, jokerMap)
    const updates = {}

    updates[`${myPlayerId}.score`] = gameData[myPlayerId].score + userScore
    if (effects.transfer) {
      const other = myPlayerId === 'player1' ? 'player2' : 'player1'
      updates[`${other}.score`] = gameData[other].score + opponentScore
    }
    const newMat = gameData.matrix.map(c => ({ ...c }))
    selected.forEach(({ row, col }, i) => {
      const idx = row * GRID_SIZE + col
      newMat[idx].letter = word[i]
      newMat[idx].used = true
    })

    updates.matrix = newMat
    updates.turnPlayerId = myPlayerId === 'player1' ? 'player2' : 'player1'

    await updateDoc(doc(db, 'games', gameId), updates)

    setWord('')
    setSelected([])
    setEvaluated(null)
    setJokerMap({})
  }

  const handlePass = async () => {
    if (!gameData) return;

    const currentPasses = gameData.passCount || 0;
    const newPasses = currentPasses + 1;

    if (newPasses >= 2) {

      const otherKey = myPlayerId === 'player1' ? 'player2' : 'player1';
      const myScore = gameData[myPlayerId].score;
      const otherScore = gameData[otherKey].score;
      const winnerUid = myScore >= otherScore
        ? gameData[myPlayerId].userId
        : gameData[otherKey].userId;

      await updateDoc(doc(db, 'games', gameId), {
        status: 'finished',
        winner: winnerUid
      });
      navigation.replace('FinishedGames', { userId: myPlayerId });

    } else {
      const nextPlayer = myPlayerId === 'player1' ? 'player2' : 'player1';
      await updateDoc(doc(db, 'games', gameId), {
        turnPlayerId: nextPlayer,
        passCount: newPasses
      });

      setWord('');
      setSelected([]);
      setEvaluated(null);
      setJokerMap({});
    }
  };

  const handleSurrender = async () => {
    if (!gameData) return
    const otherKey = myPlayerId === 'player1' ? 'player2' : 'player1'
    await updateDoc(doc(db, 'games', gameId), {
      status: 'finished',
      winner: gameData[otherKey].userId
    })
    navigation.replace('FinishedGames', { userId: myPlayerId })
  }

  if (loading || !gameData) {
    return <ActivityIndicator style={{ marginTop: 50 }} size="large" />
  }

  const otherKey = myPlayerId === 'player1' ? 'player2' : 'player1'
  const isMyTurn = gameData.turnPlayerId === myPlayerId

  return (
    <View style={styles.container}>
      <Text style={styles.scoreHeader}>
        {'Senin Puan:'} ({gameData[myPlayerId].score})
        {'  |  Kalan Harf: ' + (gameData.remainingLetters?.length || 0) + '  |  ' + 'Rakip Puan:'}
        {gameData[otherKey].username} ({gameData[otherKey].score})
      </Text>
      <Text style={styles.turnInfo}>
        {isMyTurn ? 'Senin sıran' : 'Rakibin sırası'}
      </Text>
      <GamePageTimer timeLimit={gameData.timeLimit * 60}
        isMyTurn={gameData.turnPlayerId === myPlayerId}
        onTimeout={handleSurrender} />
      <FlatList
        data={gameData.matrix}
        keyExtractor={(_, i) => i.toString()}
        numColumns={GRID_SIZE}
        renderItem={({ item, index }) => {
          const row = Math.floor(index / GRID_SIZE)
          const col = index % GRID_SIZE
          const sel = !!selected.find(x => x.row === row && x.col === col)
          return (
            <Pressable
              onPress={() => handleCell(row, col)}
              style={[styles.cell, sel && styles.selectedCell]}
            >
              <Text style={styles.cellText}>{item.letter}</Text>
            </Pressable>
          )
        }}
      />

      <View style={styles.lettersContainer}>
        {gameData[myPlayerId].letters.map((l, i) => (
          <Pressable
            key={i}
            style={styles.letterBox}
            onPress={() => handleRackPress(l, i)}
          >
            {l === 'JOKER'
              ? (jokerMap[i]
                ? <Text style={styles.letterText}>{jokerMap[i]}</Text>
                : <Image source={jokerImg} style={styles.jokerIcon} />
              )
              : <Text style={styles.letterText}>{l}</Text>
            }
          </Pressable>
        ))}
      </View>

      <Modal
        visible={jokerModalVisible}
        transparent animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>JOKER için harf seçin</Text>
            <View style={styles.modalGrid}>
              {'ABCÇDEFGĞHIİJKLMNOÖPRSŞTUÜVYZ'.split('').map(ch => (
                <TouchableOpacity
                  key={ch}
                  style={styles.modalLetter}
                  onPress={() => chooseJokerLetter(ch)}
                >
                  <Text style={styles.modalLetterText}>{ch}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <Pressable
              style={styles.modalClose}
              onPress={() => setJokerModalVisible(false)}
            >
              <Text style={styles.modalCloseText}>İptal</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      <TextInput
        style={[styles.input, evaluated ? { color: 'green' } : { color: 'red' }]}
        placeholder="Kelime"
        value={word}
        onChangeText={handleWordChange}
        editable={isMyTurn}
      />
      {evaluated && (
        <Text style={styles.scoreInfo}>
          Bu hamle: {evaluated.userScore} puan
        </Text>
      )}

      <EndTurnButton onEndTurn={handleSubmit} disabled={!isMyTurn} />
      <PassButton onPass={handlePass} disabled={!isMyTurn} />
      <GiveUpButton onSurrender={handleSurrender} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10, marginTop: 40, marginBottom: 50 },
  scoreHeader: { fontSize: 14, textAlign: 'center', marginBottom: 5, fontWeight: 'bold' },
  turnInfo: { fontSize: 16, textAlign: 'center', marginBottom: 10 },

  cell: {
    width: 22, height: 22, borderWidth: 0.5,
    borderColor: '#ccc', margin: 1,
    justifyContent: 'center', alignItems: 'center',
  },
  selectedCell: { backgroundColor: '#ffd700' },
  cellText: { fontSize: 10 },

  lettersContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    marginVertical: 10
  },
  letterBox: {
    margin: 4,
    padding: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4
  },
  letterText: { fontSize: 18, fontWeight: 'bold' },
  jokerIcon: { width: 24, height: 24 },

  input: {
    borderWidth: 1, borderColor: '#ccc',
    padding: 10, marginBottom: 10,
    borderRadius: 5, textAlign: 'center'
  },
  scoreInfo: { textAlign: 'center', marginBottom: 10 },

  modalOverlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center', alignItems: 'center'
  },
  modalContent: {
    width: '90%', backgroundColor: 'white',
    borderRadius: 8, padding: 16
  },
  modalTitle: {
    fontSize: 18, fontWeight: 'bold',
    marginBottom: 12, textAlign: 'center'
  },
  modalGrid: {
    flexDirection: 'row', flexWrap: 'wrap',
    justifyContent: 'center'
  },
  modalLetter: {
    width: 32, height: 32, margin: 4,
    borderWidth: 1, borderColor: '#888',
    borderRadius: 4,
    justifyContent: 'center', alignItems: 'center'
  },
  modalLetterText: { fontSize: 16, fontWeight: 'bold' },
  modalClose: {
    marginTop: 12, padding: 10,
    backgroundColor: '#ddd', borderRadius: 4,
    alignSelf: 'center'
  },
  modalCloseText: { fontSize: 16 }
})
