import {
  AppRegistry,
  StatusBar,
} from 'react-native';

import siddur from './siddur';

StatusBar.setBarStyle('light-content', true);

AppRegistry.registerComponent('siddur', () => siddur);
