import * as types from '../types'
import createReducer from '../createReducer'

export const AppState = createReducer('', {
  [types.WELCOME](state, action) {
    return 'Welcome'
  },
});

export const success = createReducer(false, {
  [types.SUCCESS](state, action) {
    return action.data
  },
});

export const yNumber = createReducer(0, {
  [types.SET_Y_NUMBER](state, action) {
    return action.data
  },
});

export const nNumber = createReducer(0, {
  [types.SET_N_NUMBER](state, action) {
    return action.data
  },
});

export const times = createReducer(0, {
  [types.SET_TIMES](state, action) {
    return action.data
  },
});

