import { useState, useEffect} from 'react'; 
import axios from "axios"; 
import { format } from "date-fns"; 

import './App.css';

const baseUrl = 'http://localhost:5000'

function App() {
  const [description, setDescription] = useState(""); 
  const [eventsList, setEventsList] = useState([]); 

  const fetchEvents = async () => {
    const data = await axios.get(`${baseUrl}/events`); 
    const { events } = data.data; 
    setEventsList(events); 
  }

  const handleChange = e => {
    setDescription(e.target.value); 
  }

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${baseUrl}/events/${id}`);  
      fetchEvents(); 
    } catch (err) {
      console.error(err.message); 
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    try {
      const data = await axios.post(`${baseUrl}/events`, {description}); 
      setEventsList(...eventsList, data.data); 
      setDescription(''); 
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
               value={description}
             />
             <button type='submit'>Submit</button>
          </form>
          <div className='eventsSection'>
             <ul>
               { eventsList.map( events => {
                  return (
                    <li key={events.id} style={{ display: 'flex'}}>
                      {events.description}
                      <button onClick={ () => handleDelete(events.id)}>x</button>
                    </li>
                  )
               })}
             </ul>
          </div>
      </header>
    </div>
  );
}

export default App;
