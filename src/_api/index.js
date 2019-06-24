import axios from 'axios'
import { getUserEmail } from 'authorization/auth'

const config = {
    headers: {
        'Authorization': "Bearer " + localStorage.getItem('authToken'),
        'Content-Type': 'application/json',
    }
};

const email = getUserEmail()

export function getTranslations(lang) {
    return (
        axios.get(`/locales/${lang}/translation.json`)
            .then(({ data }) => data))
}

export function addEvent(event) {
    return (
        axios.post('http://localhost:8080/event/new', event, config)
            .then((response) => console.log(response))
            .catch(() => console.log("FLASHEASTE"))
    )
}


export function getAccount() {
    return (
        axios.get('http://localhost:8080/account/' + email)
            .then(({ data }) => data))
        .catch(() => console.log("FALLO EL GET! "))

}

export function makeTransference(transference) {
    transference.emailSender = email
    return (
        axios.put('http://localhost:8080/account/new/transfer', transference)
            .then(({ data }) => console.log(data))
            .catch(() => console.log("FALLA LA TRANSFERENCIA"))
    )
}

