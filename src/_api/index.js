import axios from 'axios'
import auth0Client from '../authorization/auth';

export function getTranslations(lang) {
    return (
        axios.get(`/locales/${lang}/translation.json`, { headers: 
            { 
                Authorization: `Bearer ${auth0Client.getIdToken}` 
            } 
        })
        .then(({ data }) => data))
}