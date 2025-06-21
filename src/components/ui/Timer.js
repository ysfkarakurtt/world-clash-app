import React, { useState, useEffect, useRef } from 'react'
import { Text, StyleSheet } from 'react-native'

export default function Timer({ timeLimit, isMyTurn, onTimeout }) {
    const [remaining, setRemaining] = useState(timeLimit)
    const intervalRef = useRef(null)

    useEffect(() => {

        if (isMyTurn) {
            setRemaining(timeLimit)
            intervalRef.current = setInterval(() => {
                setRemaining(x => {
                    if (x <= 1) {
                        clearInterval(intervalRef.current)
                        onTimeout()
                        return 0
                    }
                    return x - 1
                })
            }, 1000)
        } else {

            clearInterval(intervalRef.current)

        }
        return () => clearInterval(intervalRef.current)
    }, [isMyTurn])


    const mm = String(Math.floor(remaining / 60)).padStart(2, '0')
    const ss = String(remaining % 60).padStart(2, '0')

    return (
        <Text style={styles.timer}>

            {`Kalan Süre: ${mm}:${ss}`}

        </Text>
    )
}

const styles = StyleSheet.create({
    timer: {
        fontSize: 16,
        textAlign: 'center',
        marginVertical: 8,
        fontWeight: 'bold',
        color: '#e74c3c'
    }
})
