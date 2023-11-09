import {View, Text, StyleSheet} from 'react-native';
import React from 'react';
import {MyStylers} from '../constants';

export default function InfoUpdateScreen() {
  return (
    <View style={[MyStylers.rootContainer, styles.container]}>
      <Text>InfoUpdate</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
