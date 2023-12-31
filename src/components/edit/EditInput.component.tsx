import {
  View,
  Text,
  ViewStyle,
  StyleProp,
  StyleSheet,
  TextInput,
  KeyboardTypeOptions,
  TextStyle,
  ColorValue,
} from 'react-native';
import React from 'react';
import {MyColors, MyDimension, MyFonts} from '../../constants';
import {Controller, UseControllerProps} from 'react-hook-form';
import {InputsEdit} from '../../types';

interface Props {
  controllerProps: UseControllerProps<Omit<InputsEdit, 'deadline'>>;
  placeholder?: string;
  numberOfLines?: number;
  keyboardType?: KeyboardTypeOptions;
  style?: StyleProp<ViewStyle>;
  label?: string;
  isValid?: boolean;
  mesInvalid?: string;
  styleText?: StyleProp<TextStyle>;
  placehoderColor?: ColorValue;
}

export default function EditInput({
  controllerProps: {control, name, rules},
  style,
  label,
  placeholder,
  keyboardType,
  numberOfLines,
  isValid,
  mesInvalid = 'Value is invalid',
  styleText,
  placehoderColor,
}: Props) {
  return (
    <View style={[style]}>
      {label && <Text style={[MyFonts.body1, styleText]}>{label}</Text>}
      <View style={styles.bottomContainer}>
        <Controller
          name={name}
          control={control}
          rules={rules}
          render={({field: {onChange, value}}) => (
            <TextInput
              value={value}
              style={[MyFonts.body1, styleText]}
              placeholder={placeholder}
              placeholderTextColor={placehoderColor}
              numberOfLines={numberOfLines}
              keyboardType={keyboardType}
              onChangeText={onChange}
            />
          )}
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
