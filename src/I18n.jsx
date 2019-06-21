import React from 'react'
import { connect } from 'react-redux'
import { selectors as i18nSelectors } from '_reducers/i18n'

const I18n = ({ id, translations }) => (
    translations[id] || id
)

const mapStateToProps = (state) => ({
    translations: i18nSelectors.getCurrentTranslations(state)

})


export default connect(mapStateToProps)(I18n) 