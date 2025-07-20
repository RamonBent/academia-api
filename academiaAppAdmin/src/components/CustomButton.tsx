import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

export default function CustomButton({ 
  title, 
  onPress, 
  containerStyle,  
  textStyle,      
  disabled = false 
}) {
  return (
    <TouchableOpacity 
      style={[
        styles.button, 
        containerStyle, 
        disabled && styles.disabledButton
      ]} 
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.85}
    >
      <Text style={[styles.buttonText, textStyle]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)', 
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginVertical: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
            
    height: 100, 
  },
  buttonText: {
    color: '#FFFF2',
    fontSize: 20,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  disabledButton: {
    backgroundColor: 'rgba(133, 124, 141, 0.6)', 
  },
});