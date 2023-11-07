import {Text, StyleSheet, Pressable, View} from 'react-native';
import React from 'react';
import {MyColors, MyDimension, MyStylers} from '../../constants';
import Moment from 'moment';

interface Props {
  date: Date;
  onPress?: () => void;
}

export default function SelectedDateItem({date, onPress}: Props) {
  return (
    <Pressable
      style={({pressed}) => [
        styles.dateContainer,
        (pressed || !onPress) && MyStylers.pressed,
      ]}
      onPress={onPress}>
      <Text>{Moment(date).format('lll')}</Text>
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
