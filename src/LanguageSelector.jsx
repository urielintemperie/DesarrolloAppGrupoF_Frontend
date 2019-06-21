import React from 'react'
import Select from 'react-select'
import {connect} from 'react-redux'
import {actions as i18nActions, selectors as i18nSelectors} from '_reducers/i18n' 


function LanguageSelector({setLanguage, languages, currentLanguage, isFetching}) {
    return (
        <Select
            options={languages}
            onChange = {({value}) => setLanguage(value)}
            value = {languages.find(({value}) => value === currentLanguage)}
            isDisabled = {isFetching}
            isLoading = {isFetching}
        />
    );
}

function mapStateToProps(state){
    return {
        isFetching: i18nSelectors.isFetching(state),
        currentLanguage: i18nSelectors.getCurrentLanguage(state),
        languages: i18nSelectors.getLanguages(state)
    }
}

function mapDispatchToProps(dispatch){
    return {
        setLanguage: (lang)=> {dispatch(i18nActions.fetch(lang))}
    }

}

export default connect(mapStateToProps,mapDispatchToProps)(LanguageSelector)