import React, { useState } from "react";
import { StyleSheet, TextInput, TextInputProps } from "react-native";

const PasswordInputComponent: React.FC<TextInputProps> = ({ ...otherProps }) => {
  const [focused, setFocused] = useState<boolean>(false);

  return (
    <TextInput
      secureTextEntry={true}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      placeholderTextColor={"#626262"}
      style={[
        styles.input,
        focused && styles.focusedInput,
      ]}
      {...otherProps}
    />
  );
};

export default PasswordInputComponent;

const styles = StyleSheet.create({
  input: {
    fontSize: 14,
    padding: 10 * 2,
    backgroundColor: "#f1f4ff",
    borderRadius: 10,
    marginVertical: 10,
  },
  focusedInput: {
    borderWidth: 3,
    borderColor: "#1F41BB",
    shadowOffset: { width: 4, height: 10 },
    shadowColor: "#1F41BB",
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
});
