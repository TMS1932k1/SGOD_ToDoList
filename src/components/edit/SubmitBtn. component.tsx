import {View, Text} from 'react-native';
import React, {ReactNode} from 'react';
import TextBtn from '../common/TextBtn.component';
import {useAppSelector} from '../../store/store';
import Indicator from '../common/Indicator.component';

interface Props {
  children: ReactNode;
  onPress?: () => void;
}

export default function SubmitBtn({children, onPress}: Props) {
  const isLoading = useAppSelector(state => state.todoState.isLoading);

  if (isLoading) {
    return <Indicator />;
  }

  return <TextBtn onPress={onPress}>{children}</TextBtn>;
}
