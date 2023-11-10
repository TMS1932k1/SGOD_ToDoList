import {
  Text,
  StyleSheet,
  Pressable,
  View,
  TextStyle,
  StyleProp,
} from 'react-native';
import React from 'react';
import {MyColors, MyDimension, MyStylers} from '../../constants';
import Moment from 'moment';

interface Props {
  date: Date;
  styleText?: StyleProp<TextStyle>;
  onPress?: () => void;
}

export default function SelectedDateItem({date, onPress, styleText}: Props) {
  return (
    <Pressable
      style={({pressed}) => [
        styles.dateContainer,
        (pressed || !onPress) && MyStylers.pressed,
      ]}
      onPress={onPress}>
      <Text style={styleText}>{Moment(date).format('lll')}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
  dateContainer: {
    paddingHorizontal: MyDimension.pandingSmall,
    paddingVertical: 2,
    backgroundColor: MyColors.inputBackgroundColor,
    borderRadius: MyDimension.radiusSmall,
  },
});
