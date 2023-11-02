import {
  View,
  Text,
  ViewStyle,
  StyleProp,
  StyleSheet,
  TextInput,
  KeyboardTypeOptions,
} from 'react-native';
import React from 'react';
import {MyColors, MyDimension, MyFonts} from '../../constants';

interface Props {
  value?: string;
  placeholder?: string;
  numberOfLines?: number;
  keyboardType?: KeyboardTypeOptions;
  style?: StyleProp<ViewStyle>;
  label?: string;
  onChangeText?: (text: string) => void;
  isValid?: boolean;
  mesInvalid?: string;
}

export default function EditInput({
  style,
  label,
  value,
  placeholder,
  keyboardType,
  numberOfLines,
  onChangeText,
  isValid,
  mesInvalid = 'Value is invalid',
}: Props) {
  return (
    <View style={[style]}>
      {label && <Text style={[MyFonts.body1]}>{label}</Text>}
      <View style={styles.bottomContainer}>
        <TextInput
          value={value}
          style={[MyFonts.body1]}
          placeholder={placeholder}
          numberOfLines={numberOfLines}
          keyboardType={keyboardType}
          onChangeText={onChangeText}
        />
      </View>
      {!isValid && (
        <Text style={[MyFonts.body2, styles.error]}>{mesInvalid}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  bottomContainer: {
    width: '100%',
    height: 40,
    borderBottomColor: MyColors.placeholder,
    borderBottomWidth: 1,
  },
  error: {
    marginTop: MyDimension.pandingSmall,
    color: MyColors.error,
  },
});
