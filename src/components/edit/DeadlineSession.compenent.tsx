import {
  View,
  Text,
  StyleProp,
  ViewStyle,
  StyleSheet,
  TextStyle,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {MyFonts} from '../../constants';
import DatePicker from 'react-native-date-picker';
import SelectedDateItem from './SelectedDateItem.component';
import {InputsEdit} from '../../types';
import {Control, Controller} from 'react-hook-form';

interface Props {
  style?: StyleProp<ViewStyle>;
  control: Control<InputsEdit>;
  styleText?: StyleProp<TextStyle>;
}

export default function DeadlineSession({style, control, styleText}: Props) {
  const [isOpen, setOpen] = useState(false);

  const openDatePicker = useCallback(() => {
    setOpen(true);
  }, []);

  const cancleOpen = useCallback(() => {
    setOpen(false);
  }, []);

  const closeDatePicker = useCallback(() => {
    setOpen(false);
  }, []);

  useEffect(() => {}, []);

  const dateItem = useCallback(
    (value: Date) => {
      return (
        <SelectedDateItem
          styleText={styles.deadlineText}
          date={value}
          onPress={openDatePicker}
        />
      );
    },
    [styleText],
  );

  return (
    <Controller
      name={'deadline'}
      control={control}
      render={({field: {onChange, value}}) => (
        <View style={[styles.container, style]}>
          <Text style={[MyFonts.body1, styleText]}>{'Add deadline:'}</Text>
          {dateItem(value!)}
          <DatePicker
            modal
            open={isOpen}
            date={value ?? new Date()}
            onConfirm={date => {
              closeDatePicker();
              onChange(date);
            }}
            onCancel={cancleOpen}
          />
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  deadlineText: {
    color: 'black',
  },
});
