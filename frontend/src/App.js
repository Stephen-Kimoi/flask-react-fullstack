import { useState, useEffect} from 'react'; 
import axios from "axios"; 
import { format } from "date-fns"; 

import './App.css';

const baseUrl = 'http://localhost:5000'

function App() {
  const [description, setDescription] = useState(""); 
  const [editDescription, setEditDescription] = useState(""); 
  const [eventsList, setEventsList] = useState([]); 
  const [eventId, setEventId] = useState(null); 

  const fetchEvents = async () => {
    const data = await axios.get(`${baseUrl}/events`); 
    const { events } = data.data; 
    setEventsList(events); 
  }

  const handleChange = (e, field)=> {
    if (field === 'edit') {
      setEditDescription(e.target.value); 
    } else {
      setDescription(e.target.value)
    }
  }

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${baseUrl}/events/${id}`);  
      fetchEvents(); 
    } catch (err) {
      console.error(err.message); 
    }
  }

  const handleEdit = (event) => {
    setEditDescription(event.description); 
    setEventId(event.id); 
  }

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    try {
      if (editDescription) {
        const data = await axios.put(`${baseUrl}/events/${eventId}`, {description: editDescription})
        const updatedEvent = data.data.event; 
        const updatedList = eventsList.map( event => {
          if (event.id === eventId) {
            return event = updatedEvent
          } else {
            return event
          }
        })
        setEventsList(updatedList);  
      } else {
        const data = await axios.post(`${baseUrl}/events`, {description}); 
        setEventsList(...eventsList, data.data); 
      }
      setDescription('');
      setEditDescription(''); 
      setEventId(null); 
    } catch (err) {
      console.error(err.message)
    }
  }

  useEffect( () => {
    fetchEvents(); 
  }, [])

  return (
    <div className="App">
      <header className="App-header">
          <form onSubmit={handleSubmit}>
             <label htmlFor='description'>Description</label>
             <input 
               onChange={handleChange}
               type="text" 
               name="description" 
               id="description"
               placeholder='Describe the event'
               value={description}
             />
             <button type='submit'>Submit</button>
          </form>
          <div className='eventsSection'>
             <ul>
               { eventsList.map( (events) => {
                 if (eventId === events.id) {
                    return (
                      <li>
                        <form onSubmit={handleSubmit} key={events.id}>
                            <input 
                              onChange={ (e) => handleChange(e,'edit')} 
                              type="text" 
                              name="editDescription" 
                              id="editDescription"
                              placeholder={events.description}
                              value={editDescription}
                            /> 
                        <button type='submit'>Submit</button>    
                        </form>
                    </li>
                    )
                 } else {
                  return (
                    <li key={events.id} style={{ display: 'flex'}}>
                      { format(new Date(events.created_at), "MM/dd - p")} : {" "}
                      {events.description}
                      <button onClick={ () => handleEdit(events)}>Edit</button>
                      <button onClick={ () => handleDelete(events.id)}>x</button>
                    </li>
                  )
                 }
               })}
             </ul>
          </div>
      </header>
    </div>
  );
}

export default App;
