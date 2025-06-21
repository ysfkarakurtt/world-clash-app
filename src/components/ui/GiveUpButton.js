import React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';

const GiveUpButton = ({ onSurrender }) => {
  return (

    <Pressable style={styles.button} onPress={onSurrender}>

      <Text style={styles.buttonText}>Teslim Ol</Text>

    </Pressable>
  );
};

export default GiveUpButton;

const styles = StyleSheet.create({
  button: {
    backgroundColor: 'red',
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
