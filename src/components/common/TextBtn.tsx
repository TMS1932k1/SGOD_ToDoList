import {Text, Pressable, TextStyle, StyleProp, ViewStyle} from 'react-native';
import {ReactNode} from 'react';
import {MyFonts, MyStylers} from '../../constants';

interface Props {
  children: ReactNode;
  onPress?: () => void;
  styleText?: StyleProp<TextStyle>;
  style?: StyleProp<ViewStyle>;
}

export default function TextBtn({onPress, styleText, style, children}: Props) {
  return (
    <Pressable
      style={({pressed}) => [style, (pressed || !onPress) && MyStylers.pressed]}
      onPress={onPress}>
      <Text style={[MyFonts.body1, styleText]}>{children}</Text>
    </Pressable>
  );
}
