import * as types from './mutation-types'
import * as api from '../api'

function generateErrorHandler (commit, catchAndThrowError) {
  return function (err) {
    if (catchAndThrowError) {
      throw err
    }
  }
}

export const fetchUserInfo = function ({ state, commit, rootState }) {
  return api.fetchUserInfo().then(userInfo => {
    commit(types.UPDATE_USERINFO, userInfo)
  }).catch(generateErrorHandler(commit))
}

export const fetchHomeInfo = function ({ state, commit, rootState }) {
  return api.fetchHomeInfo().then(homeInfo => {
    commit(types.FETCH_HOME_INFO, homeInfo)
  })
}

export const fetchCalendarList = function ({ commit }) {
  return api.fetchCalendarList().then(data => {
    // console.log(123321, data)
    commit(types.FETCH_CALENDAR_LIST, data)
  }).catch(generateErrorHandler(commit))
}

export const updateCalendarList = function ({ commit }, data) {
  return api.updateCalendarList(data).then(data => {
    return data
  }).catch(generateErrorHandler(commit))
}

export const fetchPreachList = function ({ commit }, data) {
  return api.fetchPreachList(data).then(data => {
    // console.log(454, data)
    commit(types.FETCH_PREACH_LIST, data)
  }).catch(generateErrorHandler(commit))
}

export const updatePreachList = function ({ commit }, data) {
  return api.updatePreachList(data).then(data => {
    return data
  }).catch(generateErrorHandler(commit))
}

export const fetchDiscussInfo = function ({ state, commit, rootState }, data) {
  return api.fetchDiscussInfo(data).then(discussInfo => {
    commit(types.FETCH_DISCUSS_INFO, discussInfo)
  })
}

export const fetchPositionList = function ({ commit }, data) {
  return api.fetchPositionList(data).then(data => {
    console.log(555, data)
    commit(types.FETCH_POSITION_LIST, data)
  }).catch(generateErrorHandler(commit))
}

export const updatePositionList = function ({ commit }, data) {
  return api.updatePositionList(data).then(data => {
    return data
  }).catch(generateErrorHandler(commit))
}

export const fetchPositionDetailList = function ({ commit }, data) {
  return api.fetchPositionDetailList(data).then(data => {
    commit(types.FETCH_POSITION_DETAIL_LIST, data)
  }).catch(generateErrorHandler(commit))
}

export const addAccount = function ({ commit }, data) {
  return api.addAccount(data).then(data => {
    console.info(data)
    return data
  }).catch(generateErrorHandler(commit))
}

export const findTel = function ({ commit }, data) {
  return api.findTel(data).then(data => {
    return data
  }).catch(generateErrorHandler(commit))
}

export const findAccount = function ({ commit }, data) {
  return api.findAccount(data).then(data => {
    commit(types.FIND_ACCOUNT, data)
    return data
  }).catch(generateErrorHandler(commit))
}

export const getUserInfo = function ({ commit }, data) {
  return api.getUserInfo(data).then(data => {
    console.info('---getUserInfo---')
    console.info(data)
    return data
  }).catch(generateErrorHandler(commit))
}
