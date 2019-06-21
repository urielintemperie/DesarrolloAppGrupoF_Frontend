import { getTranslations } from "_api";


export const types = {
    FETCH_START: "i18n/FETCH_START",
    FETCH_SUCCESS: "i18n/FETCH_SUCCESS",
    FETCH_FAILURE: "i18n/FETCH_FAILURE",
};

export const actions = {
    fetchStart: () => ({type: types.FETCH_START}),
    fetchSuccess: (lang, translations) => ({type: types.FETCH_SUCCESS, lang, translations}),
    fetchFailure: () => ({type: types.FETCH_FAILURE}),
    fetch: (lang = "es") => (dispatch) => {
        dispatch(actions.fetchStart())
        getTranslations(lang)
            .then((translations) => {
                dispatch(
                    actions.fetchSuccess(lang, translations)
                )
            }).catch(() => {
                dispatch(
                    actions.fetchFailure()
                )
            })
    }
}

export const selectors = { getCurrentTranslations: (state) => state.i18n.translations,
isFetching: (state) => state.i18n.fetching,
getCurrentLanguage: (state) => state.i18n.lang,
getLanguages: (state) => ([{value: 'es', label:'Español'},{value: 'en', label:'Ingles'}])
}

const INITIAL_STATE = {
    fetching: false,
    lang: "es",
    translations: {
    }
}

export default function i18n(state = INITIAL_STATE, action) {
    switch (action.type) {
        case types.FETCH_START: return {...state, fetching: true}
        case types.FETCH_SUCCESS: return {lang: action.lang, translations: action.translations}
        default: return state
    }
}