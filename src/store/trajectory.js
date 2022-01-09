const state = {
  imsiResponse: {},
  imsiTrajectoryList: {},
  trajectoryQuery: {},
  allPoint: [],
}

const mutations = {
  set_imsiResponse(state, payload) {
    state.imsiResponse = payload
  },
  set_imsiTrajectoryList(state, val) {
    state.imsiTrajectoryList = val;
  },
  set_trajectoryQuery(state, val) {
    state.trajectoryQuery = val;
  },
  set_allPoint(state, val) {
    state.allPoint = val;
  },
}
const actions = {}

export default {
  state,
  mutations,
  actions
}