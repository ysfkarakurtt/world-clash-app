const getBonusType = () => {
  const r = Math.random();
  if (r < 0.03) return '3xWord';
  if (r < 0.06) return '2xWord';
  if (r < 0.10) return '3xLetter';
  if (r < 0.16) return '2xLetter';
  return 'normal';
};

export const generateMatrix = () => {
  const matrix = [];
  for (let i = 0; i < 15; i++) {
    const row = [];
    for (let j = 0; j < 15; j++) {
      row.push({
        letter: '',
        type: getBonusType(),
        used: false
      });
    }
    matrix.push(row);
  }

  placeEntities(matrix);
  return matrix;
};

const placeEntities = (matrix) => {
  const mineDefs = [
    { type: 'puanBolunmesi', count: 5 },
    { type: 'puanTransferi', count: 4 },
    { type: 'harfKaybi', count: 3 },
    { type: 'ekstraHamleEngeli', count: 2 },
    { type: 'kelimeIptali', count: 2 }
  ];
  const rewardDefs = [
    { type: 'bolgeYasagi', count: 2 },
    { type: 'harfYasagi', count: 3 },
    { type: 'ekstraHamleJokeri', count: 2 }
  ];

  const place = (defs) => {
    defs.forEach(({ type, count }) => {
      let placed = 0;
      while (placed < count) {
        const i = Math.floor(Math.random() * 15);
        const j = Math.floor(Math.random() * 15);
        if (matrix[i][j].type === 'normal' && matrix[i][j].letter === '') {
          matrix[i][j].type = type;
          placed++;
        }
      }
    });
  };

  place(mineDefs);
  place(rewardDefs);
};


export const getRandomLetters = (count) => {
  const pool = [];
  const distribution = {
    A: 12, B: 2, C: 2, Ç: 2, D: 2, E: 8, F: 1, G: 1, Ğ: 1, H: 1,
    I: 4, İ: 7, J: 1, K: 7, L: 7, M: 4, N: 5, O: 3, Ö: 1, P: 1,
    R: 6, S: 3, Ş: 2, T: 5, U: 3, Ü: 2, V: 1, Y: 2, Z: 2, JOKER: 2
  };
  Object.entries(distribution).forEach(([ltr, qty]) => {
    for (let k = 0; k < qty; k++) pool.push(ltr);
  });
  const hand = [];
  for (let i = 0; i < count && pool.length; i++) {
    const idx = Math.floor(Math.random() * pool.length);
    hand.push(pool.splice(idx, 1)[0]);
  }
  return hand;
};