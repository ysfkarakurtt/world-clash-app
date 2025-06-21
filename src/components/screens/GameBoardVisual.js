import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Rect, Text as SvgText } from 'react-native-svg';

const CELL_SIZE = 24;
const BOARD_SIZE = 15;

const COLORS = {
    normal: '#ffffff',
    '2xLetter': '#cce5ff',
    '3xLetter': '#99ccff',
    '2xWord': '#ffcce0',
    '3xWord': '#ff99cc',
    'puanBolunmesi': '#f4cccc',
    'puanTransferi': '#f6b26b',
    'harfKaybi': '#d9d2e9',
    'ekstraHamleEngeli': '#ead1dc',
    'kelimeIptali': '#f4cccc',
    'bolgeYasagi': '#d9ead3',
    'harfYasagi': '#c9daf8',
    'ekstraHamleJokeri': '#fff2cc',
};

const GameBoardVisual = ({ matrix, selectedCells = [] }) => {
    const width = CELL_SIZE * BOARD_SIZE;
    const height = CELL_SIZE * BOARD_SIZE;

    const isSelected = (row, col) =>
        selectedCells.some(cell => cell.row === row && cell.col === col);

    return (
        <View style={styles.container}>
            <Svg width={width} height={height}>
                {matrix.map((row, rowIndex) =>
                    row.map((cell, colIndex) => {
                        const x = colIndex * CELL_SIZE;
                        const y = rowIndex * CELL_SIZE;
                        const color = COLORS[cell.type] || COLORS.normal;
                        const selected = isSelected(rowIndex, colIndex);

                        return (
                            <React.Fragment key={`${rowIndex}-${colIndex}`}>
                                <Rect
                                    x={x}
                                    y={y}
                                    width={CELL_SIZE}
                                    height={CELL_SIZE}
                                    fill={color}
                                    stroke={selected ? '#ffcc00' : '#444'}
                                    strokeWidth={selected ? 2 : 0.5}
                                />
                                {cell.letter ? (
                                    <SvgText
                                        x={x + CELL_SIZE / 2}
                                        y={y + CELL_SIZE / 2 + 4}
                                        fontSize="12"
                                        fill="black"
                                        textAnchor="middle"
                                    >
                                        {cell.letter}
                                    </SvgText>
                                ) : null}
                            </React.Fragment>
                        );
                    })
                )}
            </Svg>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginTop: 20,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ccc',
    },
});

export default GameBoardVisual;

export const convertFlatMatrixTo2D = (flatMatrix) => {
    const matrix = [];
    for (let i = 0; i < BOARD_SIZE; i++) {
        matrix.push(flatMatrix.slice(i * BOARD_SIZE, (i + 1) * BOARD_SIZE));
    }
    return matrix;
};
