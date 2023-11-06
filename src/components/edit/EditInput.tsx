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
import {Control, Controller, RegisterOptions} from 'react-hook-form';
import {InputsEdit} from '../../types';

interface Props {
  name: 'title' | 'content';
  control: Control<InputsEdit, any>;
  placeholder?: string;
  numberOfLines?: number;
  keyboardType?: KeyboardTypeOptions;
  style?: StyleProp<ViewStyle>;
  label?: string;
  isValid?: boolean;
  mesInvalid?: string;
  rules?: Omit<
    RegisterOptions<InputsEdit, 'title' | 'content'>,
    'valueAsNumber' | 'valueAsDate' | 'setValueAs' | 'disabled'
  >;
}

export default function EditInput({
  name,
  style,
  label,
  control,
  placeholder,
  keyboardType,
  numberOfLines,
  isValid,
  mesInvalid = 'Value is invalid',
  rules,
}: Props) {
  return (
    <View style={[style]}>
      {label && <Text style={[MyFonts.body1]}>{label}</Text>}
      <View style={styles.bottomContainer}>
        <Controller
          name={name}
          control={control}
          rules={rules}
          render={({field: {onChange, value}}) => (
            <TextInput
              value={value}
              style={[MyFonts.body1]}
              placeholder={placeholder}
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
