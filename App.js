import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {createRouter, NavigationProvider, StackNavigaion} from '@expo/ex-navigation'
import { Provider } from 'react-redux'
import thunkMiddleware from 'redux-thunk'
import { createStore, applyMiddleware } from 'redux'
import appReducer from './src/redux/reducers/index'
import AppWithNavigationState from './src/screens/AppWithNavigationState'


let store = createStore(appReducer, {}, applyMiddleware(thunkMiddleware))

export default class App extends React.Component {
  render() {
      return <Provider store={store}><AppWithNavigationState/></Provider>;
  }
}


