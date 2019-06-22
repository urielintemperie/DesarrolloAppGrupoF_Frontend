import {addEvent} from '_api'
import { dispatch } from 'rxjs/internal/observable/pairs';

export const types = {
    ADD_SUCCESS: "event/add_success",
    ADD_FAILURE: "event/add_failure"

}

export const actions = {
    addSuccess: (event) => ({type: types.ADD_SUCCESS, event}),
    addFailure: () => ({type:types.ADD_FAILURE}),
    add: (event) => {
        addEvent(event)
        .then((event)=>{
            dispatch(actions.addSuccess(event))
        })
        .catch(()=> {
            dispatch(actions.addFailure())
        })

    }
}

const INITIAL_STATE = {}

export default function event(state=INITIAL_STATE,action){
    switch (action.type) {
        default: return state
    }
}



