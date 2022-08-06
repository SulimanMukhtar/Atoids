// log
import store from "../store";

const fetchDataRequest = () => {
  return {
    type: "CHECK_DATA_REQUEST",
  };
};

const fetchDataSuccess = (payload) => {
  return {
    type: "CHECK_DATA_SUCCESS",
    payload: payload,
  };
};

const fetchDataFailed = (payload) => {
  return {
    type: "CHECK_DATA_FAILED",
    payload: payload,
  };
};

export const fetchData = () => {
  return async (dispatch) => {
    dispatch(fetchDataRequest());

    try {

      let totalSupply = await store
        .getState().
        blockchain.smartContract.totalSupply();
      totalSupply = String(totalSupply)
      let Owner = await store
        .getState()
        .blockchain.smartContract.owner()
        ;
      Owner = String(Owner)
      let whitelistEnabled = await store
        .getState()
        .blockchain.smartContract.whitelistEnabled()
        ;
      let paused = await store
        .getState()
        .blockchain.smartContract.paused()
        ;
      let publicCost = await store
        .getState()
        .blockchain.smartContract.publicCost()
        ;
      publicCost = String(publicCost)
      let whitelistCost = await store
        .getState()
        .blockchain.smartContract.whitelistCost()
        ;
      whitelistCost = String(whitelistCost)

      dispatch(
        fetchDataSuccess({
          totalSupply,
          whitelistEnabled,
          paused,
          publicCost,
          whitelistCost,
          Owner
        })
      );
    } catch (err) {
      console.log(err);
      dispatch(fetchDataFailed("Could not load data from contract."));
    }
  };
};



