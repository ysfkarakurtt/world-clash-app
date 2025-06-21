import React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';

const EndTurnButton = ({ onEndTurn }) => {
  return (

    <Pressable style={styles.button} onPress={onEndTurn}>

      <Text style={styles.buttonText}>Hamleyi Bitir</Text>

    </Pressable>
  );
};

export default EndTurnButton;

const styles = StyleSheet.create({
  button: {
    backgroundColor: 'green',
    padding: 10,
    borderRadius: 8,
    marginVertical: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
