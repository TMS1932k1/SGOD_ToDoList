import {
  View,
  StyleSheet,
  TextInput,
  KeyboardTypeOptions,
  ViewStyle,
  StyleProp,
  TextStyle,
  ColorValue,
} from 'react-native';
import React from 'react';
import {MyColors, MyDimension, MyFonts} from '../../constants';

interface Props {
  value?: string;
  placeholder?: string;
  numberOfLines?: number;
  keyboardType?: KeyboardTypeOptions;
  style?: StyleProp<ViewStyle>;
  colorPlaceHolder?: ColorValue;
  onChangeText?: (text: string) => void;
}

export default function InputText({
  value,
  placeholder,
  numberOfLines = 1,
  keyboardType,
  style,
  colorPlaceHolder,
  onChangeText,
}: Props) {
  return (
    <View style={[styles.container, style]}>
      <TextInput
        value={value}
        style={[MyFonts.body1]}
        placeholder={placeholder}
        placeholderTextColor={colorPlaceHolder}
        numberOfLines={numberOfLines}
        keyboardType={keyboardType}
        onChangeText={onChangeText}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 40,
    backgroundColor: MyColors.inputBackgroundColor,
    borderRadius: MyDimension.radiusSmall,
  },
});
