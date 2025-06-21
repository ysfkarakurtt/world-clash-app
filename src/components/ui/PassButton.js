import React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';

const PassButton = ({ onPass }) => {
    return (
        <Pressable style={styles.button} onPress={onPass}>

            <Text style={styles.buttonText}>Pas Geç</Text>
            
        </Pressable>
    );
};

export default PassButton;

const styles = StyleSheet.create({
    button: {
        backgroundColor: 'orange',
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
