import React, { useState } from "react";
import { View, StyleSheet, Text } from "react-native";
import { Picker } from "@react-native-picker/picker";

interface DropdownProps {
  items: { label: string; value: string }[];
  selectedValue: string;
  onValueChange: (itemValue: string, itemIndex: number) => void;
  placeholder?: string;
}

const DropdownComponent: React.FC<DropdownProps> = ({
  items,
  selectedValue,
  onValueChange,
  placeholder
}) => {
  const [focused, setFocused] = useState<boolean>(false);

  return (
    <View
      style={[
        {backgroundColor: "#f1f4ff",
        borderRadius: 10,
        marginVertical: 10,},
        focused && {borderWidth: 3,
            borderColor: "#1F41BB",
            shadowOffset: { width: 4, height: 10 },
            shadowColor: "#1F41BB",
            shadowOpacity: 0.2,
            shadowRadius: 10,}
      ]}
    >
      <Picker
        selectedValue={selectedValue}
        onValueChange={onValueChange}
        style={{fontSize: 14,
            padding: 10 * 2,
            color: "#626262",}}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        dropdownIconColor={"#1F41BB"}
      >
        {placeholder && <Picker.Item label={placeholder} value="" />}
        {items.map((item, index) => (
          <Picker.Item key={index} label={item.label} value={item.value} />
        ))}
      </Picker>
    </View>
  );
};

const styles = StyleSheet.create({});

export default DropdownComponent;
