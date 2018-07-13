import createReducer from '../createReducer'
import * as types from '../types'

export const top_players = createReducer([], {
  [types.TOP_PLAYERS](state, action) {
    return action.data
  },
});