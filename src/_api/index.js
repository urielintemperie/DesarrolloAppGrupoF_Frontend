import axios from 'axios'


export function getTranslations(lang) {
    return (
        axios.get(`/locales/${lang}/translation.json`)
        .then(({ data }) => data))
}

export function addEvent(event) {
    return(
        axios.post('http://localhost:8080/event/new',event)
        .then((response) => console.log(response))
        .catch(()=> console.log("FLASHEASTE"))
            
    )
}