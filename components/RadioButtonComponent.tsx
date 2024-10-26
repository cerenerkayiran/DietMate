import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface RadioButtonProps {
  options: string[];
  onSelect: (value: string) => void;
  selectedOption: string;
}

const RadioButtonComponent: React.FC<RadioButtonProps> = ({ options, onSelect, selectedOption }) => {
  return (
    <View style={ {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginVertical: 10,
      }}>
      {options.map(option => (
        <TouchableOpacity
          key={option}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}
          onPress={() => onSelect(option)}
        >
          <View style={[
            {
                height: 24,
                width: 24,
                borderRadius: 12,
                borderWidth: 2,
                borderColor: '#1F41BB',
                alignItems: 'center',
                justifyContent: 'center',
              },
            selectedOption === option && {
                borderColor: '#1F41BB',
              }
          ]}>
            {selectedOption === option && <View style={{
    height: 12,
    width: 12,
    borderRadius: 6,
    backgroundColor: '#1F41BB',
  }} />}
          </View>
          <Text style={{
    marginLeft: 8,
    fontSize: 16,
  }}>{option}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({});

export default RadioButtonComponent;
