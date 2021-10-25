import React, {useContext, useState} from 'react';
import NoteContext from '../context/notes/NoteContext';

function AddNote(props) {
    const context = useContext(NoteContext);
    const { addNote } = context;
    const [note, setnote] = useState({title: "", description: "", tag: ""})
    const handleClick = (e)=>{
        e.preventDefault()
        addNote(note.title, note.description, note.tag);
        setnote({title: "", description: "", tag: ""});
        props.showAlert("Added Successfully", "success")
    }
    const onChange = (e)=>{
        // setnote({title: e.target.value, description: e.target.value, tag: e.target.value})
        setnote({...note, [e.target.name]: e.target.value})
        console.log(note);
    }
    return (
        <div className="container my-3">
            <h2>Add a Note</h2>
            <form>
                <div className="mb-3">
                    <label htmlFor="title" className="form-label">Title</label>
                    <input type="text" className="form-control" id="title" name="title" aria-describedby="emailHelp" value={note.title} onChange={onChange} minLength={3} required />
                </div>
                <div className="mb-3">
                    <label htmlFor="description" className="form-label">Description</label>
                    <input type="text" className="form-control" id="description" name="description" value={note.description} onChange={onChange} minLength={5} required />
                </div>
                <div className="mb-3">
                    <label htmlFor="tag" className="form-label">Tag</label>
                    <input type="text" className="form-control" id="tag" name="tag" value={note.tag} onChange={onChange} />
                </div>
                <button disabled={note.title.length<3 || note.description.length<5} type="submit" className="btn btn-primary" onClick={handleClick}>Add Note</button>
            </form>
        </div>

    )
}

export default AddNote
