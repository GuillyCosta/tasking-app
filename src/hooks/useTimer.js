'use client';

import { useState, useEffect, useRef } from 'react';
import { useLocalStorage } from './useLocalStorage';

export function useTimer(initialSeconds) {
  const [seconds, setSeconds] = useLocalStorage('tasking_timerSeconds', initialSeconds);
  const [isRunning, setIsRunning] = useLocalStorage('tasking_timerRunning', false);
  const intervalRef = useRef(null);
  
  // Iniciar o timer
  const startTimer = () => {
    if (!isRunning) {
      setIsRunning(true);
    }
  };
  
  // Pausar o timer
  const pauseTimer = () => {
    if (isRunning) {
      setIsRunning(false);
    }
  };
  
  // Resetar o timer
  const resetTimer = (newSeconds = initialSeconds) => {
    pauseTimer();
    setSeconds(newSeconds);
  };
  
  // Formatar o tempo para exibição (MM:SS)
  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const remainingSeconds = timeInSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };
  
  // Efeito para controlar o timer
  useEffect(() => {
    if (isRunning && seconds > 0) {
      intervalRef.current = setInterval(() => {
        setSeconds(prevSeconds => {
          if (prevSeconds <= 1) {
            clearInterval(intervalRef.current);
            setIsRunning(false);
            return 0;
          }
          return prevSeconds - 1;
        });
      }, 1000);
    } else if (seconds === 0) {
      setIsRunning(false);
    }
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, seconds, setSeconds]);
  
  return {
    seconds,
    isRunning,
    startTimer,
    pauseTimer,
    resetTimer,
    formatTime
  };
}


