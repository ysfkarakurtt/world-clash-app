import { db } from './firebase';
import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  collection,
  addDoc,
  onSnapshot,
  query,
  where,
  getDocs,
  Timestamp
} from 'firebase/firestore';
import { generateMatrix, getRandomLetters } from './matrixHelper';

export const joinMatchQueue = async (timeLimit, userId) => {

  const queueRef = doc(db, 'matchRooms', String(timeLimit));
  const queueSnap = await getDoc(queueRef);

  if (queueSnap.exists() && queueSnap.data().userId !== userId) {
    const otherUserId = queueSnap.data().userId;

    const rawMatrix = generateMatrix();
    const flatMatrix = rawMatrix.flat();

    const gameRef = await addDoc(collection(db, 'games'), {
      matrix: flatMatrix,
      turnPlayerId: Math.random() < 0.5 ? 'player1' : 'player2',
      player1: { userId: otherUserId, score: 0, letters: getRandomLetters(7) },
      player2: { userId, score: 0, letters: getRandomLetters(7) },
      timeLimit,
      status: 'active',
      passCount: 0,  
      createdAt: Timestamp.now(),
      deadline: Timestamp.fromDate(new Date(Date.now() + timeLimit * 60 * 1000)),
    });

    await updateDoc(queueRef, {
      gameId: gameRef.id,
      isMatched: true
    });

    return { status: 'matched', gameId: gameRef.id, myPlayerId: 'player2' };
  }

  await setDoc(queueRef, {
    userId,
    isMatched: false,
    createdAt: Timestamp.now()
  });
  return { status: 'waiting' };
};

export const listenWaitingRoom = (timeLimit, callback) => {
  const queueRef = doc(db, 'matchRooms', String(timeLimit));
  return onSnapshot(queueRef, (snap) => {
    const data = snap.data();
    if (data?.isMatched && data.gameId) {
      callback({ gameId: data.gameId });
    }
  });
};

export const getGame = async (gameId) => {
  const ref = doc(db, 'games', gameId);
  const snap = await getDoc(ref);
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
};

export const updateGame = async (gameId, fields) => {
  const ref = doc(db, 'games', gameId);
  await updateDoc(ref, { ...fields, lastMoveAt: Timestamp.now() });
};

export const getActiveGames = async (userId) => {
  const gamesRef = collection(db, 'games');
  const q1 = query(
    gamesRef,
    where('status', '==', 'active'),
    where('player1.userId', '==', userId)
  );
  const q2 = query(
    gamesRef,
    where('status', '==', 'active'),
    where('player2.userId', '==', userId)
  );
  const [snap1, snap2] = await Promise.all([getDocs(q1), getDocs(q2)]);
  const list = [];
  snap1.forEach(d => list.push({ id: d.id, ...d.data() }));
  snap2.forEach(d => list.push({ id: d.id, ...d.data() }));
  return list;
};


export const getFinishedGames = async (userId) => {
  const gamesRef = collection(db, 'games')
  const q1 = query(
    gamesRef,
    where('status', '==', 'finished'),
    where('player1.userId', '==', userId)
  )
  const q2 = query(
    gamesRef,
    where('status', '==', 'finished'),
    where('player2.userId', '==', userId)
  )
  const [snap1, snap2] = await Promise.all([getDocs(q1), getDocs(q2)])
  const list = []
  snap1.forEach(doc => list.push({ id: doc.id, ...doc.data() }))
  snap2.forEach(doc => list.push({ id: doc.id, ...doc.data() }))
  return list
}