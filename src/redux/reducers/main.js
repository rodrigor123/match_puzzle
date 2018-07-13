import createReducer from '../createReducer'
import * as types from '../types'

export const goal = createReducer('', {
  [types.SET_GOAL_NUMBER](state, action) {
    return action.data
  },
});

export const inProg = createReducer(false , {
  [types.SET_GOAL_NUMBER](state, action) {
    return false
  },
  [types.SET_TIMES](state, action) {
    if(action.data == 0) return false
    else return true
  },
});

export const history = createReducer([], {
  [types.SET_HISTORY](state, action) {
    return action.data
  },
});

export const level = createReducer(4, {
  [types.SET_LEVEL](state, action) {
    return action.data
  },
});

export const isComplex = createReducer(false, {
  [types.SET_COMPLEXITY](state, action) {
    return action.data
  },
});

export const userInfo = createReducer({userId: '', trophy: 0, username: '', email: ''}, {
  [types.USER_INFO](state, action) {
    return action.data
  },
});



