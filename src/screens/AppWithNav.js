import React from 'react';
import {
  TabNavigator,
  StackNavigator,
  addNavigationHelpers
} from 'react-navigation';

import { bindActionCreators } from 'redux'
import { ActionCreators } from '../redux/actions'
import { connect } from 'react-redux'
import MainNavigator from './AppNavigator'

class AppWithNav extends React.Component {
  render() {
    return (
      <MainNavigator/>
    );
  }
}


function mapDispatchToProps(dispatch) {
    return bindActionCreators(ActionCreators, dispatch);
}

export default connect((state) => { 
    return {}
}, mapDispatchToProps)(AppWithNav);
