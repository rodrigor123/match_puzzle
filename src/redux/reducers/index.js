import { combineReducers } from 'redux';
import * as checkReducer from './check'
import * as mainReducer from './main'
import * as trophyReducer from './trophies'

const appReducer = combineReducers(Object.assign(
  checkReducer,
  mainReducer,
  trophyReducer
));

export default appReducer

