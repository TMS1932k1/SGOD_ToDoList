import {View, ViewStyle, StyleProp, StyleSheet} from 'react-native';
import {Dropdown} from 'react-native-element-dropdown';
import React from 'react';
import {Filter} from '../../types';

interface Props {
  style?: StyleProp<ViewStyle>;
  onChange: (item: {label: Filter; value: Filter}) => void;
  data: {label: Filter; value: Filter}[];
}

export default function DropdownBtn({data, style, onChange}: Props) {
  return (
    <View style={[styles.container, style]}>
      <Dropdown
        style={styles.dropdown}
        data={data}
        labelField="label"
        valueField="value"
        onChange={onChange}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'flex-end',
  },
  dropdown: {
    width: 100,
  },
});
