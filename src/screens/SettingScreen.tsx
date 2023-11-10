import {
  View,
  useColorScheme,
  ColorSchemeName,
  StyleSheet,
  Appearance,
} from 'react-native';
import React, {useCallback, useEffect, useMemo} from 'react';
import {MyStylers} from '../constants';
import {save} from '../utils';
import {TextBtn} from '../components';
import {Colors} from '../theme';
import {useAppDispatch, useAppSelector} from '../store/store';
import {getTheme} from '../store/homeSlice';

export default function SettingScreen() {
  const dispatch = useAppDispatch();
  const currentTheme = useAppSelector(state => state.todoState.theme);

  var themes = useColorScheme();

  Appearance.addChangeListener(({colorScheme}) => {
    themes = colorScheme;
  });

  const data = [
    {
      label: 'Light Mode',
      value: 'light',
    },
    {
      label: 'Dark Mode',
      value: 'dark',
    },
    {
      label: 'System Default',
      value: 'default',
    },
  ];

  const themeOperations = useCallback(
    (theme: string) => {
      switch (theme) {
        case 'light':
          setTheme(theme, false);
          return;
        case 'dark':
          setTheme(theme, false);
          return;
        case 'default':
          setTheme(themes, true);
          return;
      }
    },
    [themes],
  );

  const setTheme = useCallback(
    async (theme: ColorSchemeName, isDefault: boolean) => {
      if (
        (await save('@theme', theme)) &&
        (await save('@isdefault', isDefault))
      ) {
        dispatch(getTheme());
      }
    },
    [],
  );

  const styles = useMemo(() => styling(currentTheme), [currentTheme]);

  const chooseTheme = useCallback((item: {label: string; value: string}) => {
    themeOperations(item.value);
  }, []);

  return (
    <View style={[MyStylers.rootContainer, styles.container]}>
      {data.map(item => (
        <TextBtn
          key={item.label}
          onPress={() => chooseTheme(item)}
          styleText={styles.text}>
          {item.label}
        </TextBtn>
      ))}
    </View>
  );
}

const styling = (theme: ColorSchemeName) =>
  StyleSheet.create({
    container: {
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor:
        Colors[theme === 'light' ? 'light' : 'dark'].colors.backgroundColor,
    },
    text: {
      color: Colors[theme === 'light' ? 'light' : 'dark'].colors.onBackground,
    },
  });
