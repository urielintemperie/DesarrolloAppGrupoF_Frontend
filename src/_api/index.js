import axios from 'axios'


const config = {
    headers: {
        'Authorization': "Bearer " + localStorage.getItem('authToken'),
        'Content-Type': 'application/json',
    }
};

export function getTranslations(lang) {
    return (
        axios.get(`/locales/${lang}/translation.json`)
        .then(({ data }) => data))
}

export function addEvent(event) {
    return(
        console.log(config),
        axios.post('http://localhost:8080/event/new',event, config)
        .then((response) => console.log(response))
        .catch(()=> console.log("FLASHEASTE"))
            
    )
}