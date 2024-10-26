import {
    StyleSheet,
    Text,
    TextInput,
    TextInputProps,
    View,
  } from "react-native";
  import React, { useState } from "react";

  const TextInputComponent: React.FC<TextInputProps> = ({ ...otherProps }) => {
    const [focused, setFocused] = useState<boolean>(false);
    return (
      <TextInput
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholderTextColor={"#626262"}
        style={[
          {
            fontSize: 14,
            padding: 10 * 2,
            backgroundColor: "#f1f4ff",
            borderRadius: 10,
            marginVertical: 10,
          },
          focused && {
            borderWidth: 3,
            borderColor: "#1F41BB",
            shadowOffset: { width: 4, height: 10 },
            shadowColor: "#1F41BB",
            shadowOpacity: 0.2,
            shadowRadius: 10,
          },
        ]}
        {...otherProps}
      />
    );
  };
  
  export default TextInputComponent;
  
  const styles = StyleSheet.create({});