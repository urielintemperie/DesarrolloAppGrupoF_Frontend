import axios from 'axios';

const server = 'http://localhost:8080';

const request = (type, path, body) => axios
  .request({ url: `${server}${path}`, method: type, data: body })
  .then(req => req.data);

const getEvento = (eventoId) => request('get', `/event/${eventoId}`);
const getTodosEventos = () => request('get', `/events`);
const deleteEventById = (id) => request('delete', `/event/delete/${id}`);
const newEvent = (body) => request('post', '/event/new', body);
const editEvent = id => body => request('put', `/event/edit/${id}`, body);

export { getEvento, getTodosEventos, deleteEventById, newEvent, editEvent };