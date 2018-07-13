import * as types from '../types'

export const setGoalNumber = (gn) => {
    return {
        type: types.SET_GOAL_NUMBER,
        data: gn
    }
}

export const resetGoalNumber = (level, isComplex) => {
    return (dispatch, getState) => {
        let gNumber = ''
        if(isComplex){
            gNumber = String(Math.random()).substring(2, 2 + level)
        } 
        else{
            let temp = String(Math.random())
            let index = 2
            while(gNumber.length < level){
                if(gNumber.indexOf(temp.substr(index, 1)) < 0){
                    gNumber += temp.substr(index, 1)
                }
                else{
                    index++
                }
            }
        }
        //alert(gNumber)
        dispatch(setGoalNumber(gNumber))
        dispatch(setTimes(0))
        dispatch(setHistory([]))
        dispatch(setSuccess(false))
    }
}

export const setUserInfo = (info) => {
    return (dispatch, getState) => {
        //alert(JSON.stringify(info))
        dispatch(setUserData(info))
    }
}

export const setUserData = (data) => {
    return {
        type: types.USER_INFO,
        data
    }
}

export const check = (num, goal, times, history) => {
    return (dispatch, getState) => {
        let Y = 0, N = 0
        for (i = 0; i < num.length; i++) { 
            if(num.substr(i, 1) == goal.substr(i, 1)){
                Y++
            }
            else if(num.indexOf(goal.substr(i, 1)) > -1){
                N++
            }
        }
        dispatch(setY(Y))
        dispatch(setN(N))
        dispatch(setTimes(times + 1))
        if(Y == 4) dispatch(setSuccess(true))
        let temp = {
            number: num,
            state: 'Y' + Y + ', ' + 'N' + N
        }
        history.push(temp)
        dispatch(setHistory(history))
    }
}

export const setY = (y) => {
    return {
        type: types.SET_Y_NUMBER,
        data: y
    }
}

export const setN = (n) => {
    return {
        type: types.SET_N_NUMBER,
        data: n
    }
}

export const setTimes = (t) => {
    return {
        type: types.SET_TIMES,
        data: t
    }
}

export const setSuccess = (state) => {
    return {
        type: types.SUCCESS,
        data: state
    }
}

export const setHistory = (h) => {
    return {
        type: types.SET_HISTORY,
        data: h
    }
}

export const setLevel = (level) => {
    return {
        type: types.SET_LEVEL,
        data: level
    }
}

export const setComplexity = (complexity) => {
    return {
        type: types.SET_COMPLEXITY,
        data: complexity
    }
}