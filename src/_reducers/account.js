import { getAccount } from '_api'

export const types = {
    FETCH_START: "account/FETCH_START",
    FETCH_SUCCESS: "account/FETCH_SUCCESS",
    FETCH_FAILURE: "account/FETCH_FAILURE",
};

export const actions = {
    fetchStart: () => ({ type: types.FETCH_START }),
    fetchSuccess: (account) => ({ type: types.FETCH_SUCCESS, account }),
    fetchFailure: () => ({ type: types.FETCH_FAILURE }),
    fetchAccount: () => (dispatch) => {
        dispatch(actions.fetchStart())
        getAccount()
            .then((account) => {
                dispatch(
                    actions.fetchSuccess(account)
                )
            }).catch(() => {
                dispatch(
                    actions.fetchFailure()
                )
            })
    }

 
}


export const selectors = {
    getBalance: (state) => state.account.balance,
    isFetching: (state) => state.account.fetching,
    getHistory: (state) => state.account.history
}

const INITIAL_STATE = {
    fetching: false,
    balance: "-1000",
    history: []
}

export default function account(state = INITIAL_STATE, action) {
    switch (action.type) {
        case types.FETCH_START: return { ...state, fetching: true }
        case types.FETCH_SUCCESS: return { balance: action.account.balance, history: action.account.history }
        default: return state
    }

}