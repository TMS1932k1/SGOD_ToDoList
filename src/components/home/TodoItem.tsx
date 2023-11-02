import {View, StyleSheet, Text, Pressable} from 'react-native';
import React, {memo} from 'react';
import {ToDo} from '../../types';
import CheckBox from '@react-native-community/checkbox';
import {MyDimension, MyFonts, MyStylers} from '../../constants';
import TextBtn from '../common/TextBtn';

interface Props {
  todo: ToDo;
  onPress?: () => void;
  onDelete?: (id: string) => void;
  onDone?: (isDone: boolean, id: string) => void;
}

const TodoItem = memo(({todo, onPress, onDelete, onDone}: Props) => {
  return (
    <Pressable
      style={({pressed}) => [
        styles.container,
        (pressed || !onPress) && MyStylers.pressed,
      ]}
      onPress={onPress}>
      <CheckBox
        value={todo.isDone}
        onValueChange={newValue => {
          if (onDone) onDone(newValue, todo.id);
        }}
      />
      <View style={styles.infoContainer}>
        <Text style={[MyFonts.body1]}>{todo.title}</Text>
        <Text style={[MyFonts.body2]}>{todo.content}</Text>
      </View>
      <TextBtn
        onPress={() => {
          if (onDelete) onDelete(todo.id);
        }}>
        Delete
      </TextBtn>
    </Pressable>
  );
});
export {TodoItem};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    marginVertical: MyDimension.pandingSmall,
    alignItems: 'center',
  },
  infoContainer: {
    marginLeft: MyDimension.pandingMedium,
    flex: 1,
  },
});
