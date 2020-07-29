
const getDefaultState = () => {
  return {
    value: ""
  }
}

const state = getDefaultState()

const mutations = {
  getValue: (state , data ) => {
    state.value = data
  }
}

const actions = {
  // user login
  valueX({ commit }, data) {
    commit('getValue', data)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

