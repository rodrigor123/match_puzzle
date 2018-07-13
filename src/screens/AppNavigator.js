import React from 'react';

import {
  TabNavigator,
  StackNavigator,
  StackRouter
} from 'react-navigation';

import Main from './main'
import Check from './check'
import Setting from './setting'
import TrophyList from './trophies'

const AppNavigator = StackNavigator({
  main: {
    screen: Main,
    navigationOptions: () => ({
      title: 'Main Page',
    }),
  },
  check: {
    screen: Check,
    title: 'Check page'
  },  
  setting: {
    screen: Setting,
    title: 'setting page'
  }
},{
  headerMode: 'none',
});

const MainNavigator = StackNavigator(
  {
    mainnavigator: { screen: AppNavigator },
    trophylist: { screen: TrophyList },
  },
  {
    mode: 'modal',
    headerMode: 'none',
  },
);

export default MainNavigator;
