export default {
  setChoice(state, payload) {
    state[Object.keys(payload)[0]] = payload[Object.keys(payload)[0]];
  }
};
