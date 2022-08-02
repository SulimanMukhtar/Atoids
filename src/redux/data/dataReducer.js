const initialState = {
  loading: false,
  totalSupply: 0,
  owner: "",
  whitelistEnabled: false,
  paused: true,
  publicCost: 0,
  whitelistCost: 0,
  error: false,
  errorMsg: "",
};

const dataReducer = (state = initialState, action) => {
  switch (action.type) {
    case "CHECK_DATA_REQUEST":
      return {
        ...state,
        loading: true,
        error: false,
        errorMsg: "",
      };
    case "CHECK_DATA_SUCCESS":
      return {
        ...state,
        loading: false,
        totalSupply: action.payload.totalSupply,
        owner: action.payload.Owner,
        whitelistEnabled: action.payload.whitelistEnabled,
        paused: action.payload.paused,
        whitelistCost: action.payload.whitelistCost,
        publicCost: action.payload.publicCost,
        error: false,
        errorMsg: "",
      };
    case "CHECK_DATA_FAILED":
      return {
        ...initialState,
        loading: false,
        error: true,
        errorMsg: action.payload,
      };
    default:
      return state;
  }
};

export default dataReducer;
