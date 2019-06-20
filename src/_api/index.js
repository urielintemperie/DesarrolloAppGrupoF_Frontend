import axios from 'axios'

export function getTranslations(lang) {
    return (
        axios.get(`/locales/${lang}/translation.json`).then(({data}) => data))
}