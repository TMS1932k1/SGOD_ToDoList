import {View, Text, StyleSheet} from 'react-native';
import React, {useCallback, useEffect, useLayoutEffect, useState} from 'react';
import {MyDimension, MyStylers} from '../constants';
import {RootNavigatorParams} from '../navigator';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RouteProp} from '@react-navigation/native';
import {EditInput, TextBtn} from '../components';
import {regexEditInput} from '../utils';

interface Props {
  navigation: NativeStackNavigationProp<RootNavigatorParams, 'EditScreen'>;
  route: RouteProp<RootNavigatorParams, 'EditScreen'>;
}

export default function EditScreen({navigation, route}: Props) {
  const [titleText, setTitleText] = useState({value: '', isValid: false});
  const [contentText, setContentText] = useState({value: '', isValid: false});

  useLayoutEffect(() => {
    navigation.setOptions({
      title: route.params.todo ? 'Edit ToDo' : 'Add ToDo',
      headerRight: () => (
        <TextBtn
          onPress={route.params.todo ? handlerEditToDo : handlerSaveToDo}>
          {route.params.todo ? 'EDIT' : 'SAVE'}
        </TextBtn>
      ),
    });
  }, [navigation, route]);

  useEffect(() => {
    if (route.params.todo) {
      let title = route.params.todo.title!;
      let content = route.params.todo.content!;
      setTitleText({value: title, isValid: regexEditInput(title)});
      setContentText({value: content, isValid: regexEditInput(content)});
    }
  }, [route]);

  // Handle save new todo
  const handlerSaveToDo = useCallback(() => {
    if (titleText.isValid && contentText.isValid) {
    }
  }, [titleText, contentText]);

  // Handler edit todo
  const handlerEditToDo = () => {};

  // Set new title value
  const onChangeTitle = useCallback((value: string) => {
    setTitleText({
      value: value,
      isValid: regexEditInput(value),
    });
  }, []);

  // Set new content value
  const onChangeContent = useCallback((value: string) => {
    setContentText({
      value: value,
      isValid: regexEditInput(value),
    });
  }, []);

  return (
    <View style={[MyStylers.rootContainer, styles.container]}>
      <EditInput
        value={titleText.value}
        label="Title"
        placeholder="Input todo's title"
        isValid={titleText.isValid}
        onChangeText={onChangeTitle}
        mesInvalid="Please input todo's title"
      />
      <EditInput
        value={contentText.value}
        style={styles.inputContent}
        label="Content"
        placeholder="Input todo's content"
        isValid={contentText.isValid}
        onChangeText={onChangeContent}
        mesInvalid="Please input todo's content"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: MyDimension.pandingSmall,
  },
  inputContent: {
    marginTop: MyDimension.pandingMedium,
  },
});
