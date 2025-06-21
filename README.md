#  Word Clash App
<img src="https://github.com/user-attachments/assets/6741e807-021e-43a4-90d1-ad5de6e7e1d8" width="360" height="360" alt="app icon" />

---

**Word Clash App** is a real-time, turn-based multiplayer word game developed using **React Native** and **Firebase**. Inspired by classic word board games, players compete by forming valid words on a 15x15 board while avoiding hidden **mines** and earning rewards through strategic placements.

---

##  Game Screenshots
---

<p align="center">
  <img src="https://github.com/user-attachments/assets/b4b7288e-ab97-447f-89c6-be06dfff00ec" width="300" alt="IMG_6454" />
  <img src="https://github.com/user-attachments/assets/b9cddab7-7b7b-48c8-8103-e56299816588" width="300" alt="IMG_6453" />
</p>

<p align="center">
  <img src="https://github.com/user-attachments/assets/a95af12d-6969-4e13-a718-b07deeb52a10" width="300" alt="IMG_6450" />
  <img src="https://github.com/user-attachments/assets/e9a43fe7-daa2-412e-b502-d70c71bb6610" width="300" alt="IMG_6424" />
</p>

<p align="center">
  <img src="https://github.com/user-attachments/assets/c5792ff7-b048-48e2-a0d4-5cdd8f91041f" width="300" alt="IMG_6423" />
  <img src="https://github.com/user-attachments/assets/8f6cd0d7-d68c-437a-8b4c-11f97eaced97" width="300" alt="IMG_6422" />
</p>
---

##  Game Features

-  **Turn-based 2-player gameplay**
-  Multiple match types: 2 min, 5 min, 12h, 24h
-  Word validation from a Turkish word list
-  Hidden **mines** (e.g. point loss, tile reset, score transfer)
-  Hidden **rewards** (e.g. bonus move, letter freeze, zone lock)
-  Strategic scoring with double/triple letter & word tiles
-  Real-time updates with server-client architecture
-  User registration & login
-  Word input validation (green/red)

---

##  Mine Types

| Type                | Effect |
|---------------------|--------|
|  Score Reduction   | Only 30% of the score is earned |
|  Score Transfer    | Your score is transferred to your opponent |
|  Letter Reset      | All remaining letters are reshuffled |
|  Bonus Block       | Word/letter multipliers are disabled |
|  Word Cancellation | No score is gained |

---

##  Reward Types

| Type              | Description |
|-------------------|-------------|
|  Zone Ban       | Opponent can only play in a restricted board area |
|  Letter Freeze  | Freezes 2 of opponent's letters for 1 round |
|  Extra Turn     | Allows player to play 2 words in one turn |

---

##  Board Structure

- 15x15 matrix
- 7 letters per player at start

---

##  Scoring System

- Letter points are based on Turkish usage frequency
- Bonus tiles and word length affect total score
- Mines/bonuses modify score dynamically

---

##  Technologies Used

- React Native
- Firebase (Auth, Firestore, Real-time updates)
- JavaScript
- Custom Word List: [Turkish Word List](https://github.com/CanNuhlar/Turkce-Kelime-Listesi)

---

##  How to Run

1. Clone the repository
2. Add your Firebase config to `.env` file
3. Run the app:
```bash
npx expo start
