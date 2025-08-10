import { createStore } from 'vuex';
import { getSwaggerData } from '@/services/getSwaggerData';


export default createStore({
  state: {
    swaggerData: null,
    sendRequest: false,
  },
  mutations: {
    setSwaggerData(state, data) {
      state.swaggerData = data;
    },
    setSendRequest(state, value) {
      state.sendRequest = !state.sendRequest;
    },
  },
  actions: {
    async loadSwaggerData({ commit }) {
      if (this.state.swaggerData) {
        return;
      }
      try {
        const data = await getSwaggerData();
        commit('setSwaggerData', data);
      } catch (error) {
        console.error('Error loading swagger data:', error);
      }
    },
    sendAllRequests({ commit }) {
      commit('setSendRequest', true);
    }
  },
});