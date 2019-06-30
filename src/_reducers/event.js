import { fetchOngoingEvents, fetchPopularEvents, fetchLastEvents } from '_api'

export const types = {
    FETCH_ONGOING_SUCCESS: "event/FETCH_ONGOING_SUCCESS",
    FETCH_ONGOING_FAILURE: "event/FETCH_ONGOING_FAILURE",
    FETCH_POPULAR_SUCCESS: "event/FETCH_POPULAR_SUCCESS",
    FETCH_POPULAR_FAILURE: "event/FETCH_POPULAR_FAILURE",
    FETCH_LAST_SUCCESS:"event/FETCH_LAST_SUCCESS",    
    FETCH_LAST_FAILURE:"event/FETCH_LAST_FAILURE",
}

export const actions = {
    fetchOngoingSuccess: (page, events) => ({type:types.FETCH_ONGOING_SUCCESS, page, events}),
    fetchOngoingFailure: () => ({type:types.FETCH_ONGOING_FAILURE}),
    fetchOngoingEvents: (page, size) => (dispatch) => {
        fetchOngoingEvents(page,size)
        .then((page)=> {
            dispatch(
                actions.fetchOngoingSuccess(page, page.content)
            )
        }).catch(()=>{
            dispatch(
                actions.fetchOngoingFailure()
            )
        })
    
    },
    fetchPopularSuccess: (page, events) => ({type:types.FETCH_POPULAR_SUCCESS,page,events}),
    fetchPopularFailure: () => ({type:types.FETCH_POPULAR_FAILURE}),
    fetchPopularEvents: (page, size) => (dispatch) => {
        fetchPopularEvents(page,size)
        .then((page)=> {
            dispatch(
                actions.fetchPopularSuccess(page, page.content)
            )
        }).catch(()=>{
            dispatch(
                actions.fetchPopularFailure()
            )
        })
    
    },
    fetchLastSuccess: (page, events) => ({type:types.FETCH_LAST_SUCCESS,page,events}),
    fetchLastFailure: () => ({type:types.FETCH_LAST_FAILURE}),
    fetchLastEvents: (page, size) => (dispatch) => {
        fetchLastEvents(page,size)
        .then((page)=> {
            dispatch(
                actions.fetchLastSuccess(page, page.content)
            )
        }).catch(()=>{
            dispatch(
                actions.fetchLastFailure()
            )
        })
    
    }
}

export const selectors = {
    getOngoingEvents: (state) => state.event.ongoingEvents,
    getOngoingTotalPages: (state) => state.event.pageOngoing.totalPages,
    getPopularTotalPages: (state) => state.event.pagePopular.totalPages,
    getPopularEvents: (state) => state.event.popularEvents,
    getLastEvents: (state) => state.event.lastEvents,
    getLastTotalPages: (state) => state.event.pageLast.totalPages,

}

const INITIAL_STATE = {
    pagePopular:{},
    pageOngoing:{},
    pageLast:{},
    popularEvents:[],
    ongoingEvents:[],
    lastEvents:[]
}

export default function event(state = INITIAL_STATE, action) {
    switch (action.type) {
        case types.FETCH_POPULAR_SUCCESS: return {...state, pagePopular: action.page, popularEvents: action.events}
        case types.FETCH_ONGOING_SUCCESS: return {...state, pageOngoing: action.page, ongoingEvents: action.events}
        case types.FETCH_LAST_SUCCESS: return {...state, pageLast: action.page, lastEvents: action.events}
        default: return state
    }
}


// addSuccess: (event) => ({type: types.ADD_SUCCESS, event}),
//     addFailure: () => ({type:types.ADD_FAILURE}),
//     add: (event) => {
//         addEvent(event)
//         .then((event)=>{
//             dispatch(actions.addSuccess(event))
//         })
//         .catch(()=> {
//             dispatch(actions.addFailure())
//         })
//     }