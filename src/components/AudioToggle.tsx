import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { useAudio } from '../contexts/AudioContext';
import { styles } from './styles/AudioToggle';

export const AudioToggle: React.FC = () => {
  const { isMuted, toggleMute } = useAudio();

  return (
    <TouchableOpacity
      onPress={toggleMute}
      style={styles.container}
      activeOpacity={0.7}
    >
      <Text style={styles.icon}>
        {isMuted ? '🔇' : '🔊'}
      </Text>
    </TouchableOpacity>
  );
};