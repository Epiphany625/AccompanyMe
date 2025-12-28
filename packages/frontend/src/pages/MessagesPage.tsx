import { useState } from "react"
import { Sidebar } from "../components/Sidebar"
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import "./PageLayout.css"


export const MessagesPage = () => {

  const options = ['The Godfather', 'Pulp Fiction'];
  const [selectedMovie, setSelectedMovie] = useState<string | null>(null);


  return (
    <div className="page-shell">
      <Sidebar activePage="messages" />
      <main className="page-content">
        <section className="page-panel">
          <h1>Messages</h1>
          <p>Review your conversations and keep the momentum going. {selectedMovie}</p>

          <Autocomplete
            disablePortal
            options={options}
            value={selectedMovie}
            onChange={(_, newValue) => setSelectedMovie(newValue)}
            sx={{ width: 300 }}
            renderInput={(params) => <TextField {...params} label="Movie" />}
          />
        </section>
      </main>
    </div>
  )
}
