import React, { useContext, useEffect, useRef, useState } from 'react';
import NoteContext from '../context/notes/NoteContext';
import Noteitem from './Noteitem';
import AddNote from './AddNote';
import { useHistory } from 'react-router';
const Notes = (props) => {
    const context = useContext(NoteContext);
    let history = useHistory();
    const { notes, getNotes, editNote } = context;
    useEffect(() => {
        if (localStorage.getItem('token')) {
            getNotes()
        }
        else{
            history.push("/login")
        }
    }, [])
    const ref = useRef(null)
    const refClose = useRef(null)
    const [note, setnote] = useState({ id: "", editTitle: "", editDescription: "", editTag: "" })

    const updateNote = (currentNote) => {
        ref.current.click()
        setnote({ id: currentNote._id, editTitle: currentNote.title, editDescription: currentNote.description, editTag: currentNote.tag })
    }

    const handleClick = () => {
        editNote(note.id, note.editTitle, note.editDescription, note.editTag)
        refClose.current.click();
        props.showAlert("Updated Successfully", "success")
    }
    const onChange = (e) => {
        // setnote({title: e.target.value, description: e.target.value, tag: e.target.value})
        setnote({ ...note, [e.target.name]: e.target.value })
        console.log(note);
    }
    return (
        <>
            <AddNote showAlert={props.showAlert} />
            <button type="button" className="btn btn-primary d-none" data-bs-toggle="modal" ref={ref} data-bs-target="#exampleModal">
                Launch demo modal
            </button>
            <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">Edit Note</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <form>
                                <div className="mb-3">
                                    <label htmlFor="editTitle" className="form-label">Title</label>
                                    <input type="text" className="form-control" id="editTitle" name="editTitle" value={note.editTitle} aria-describedby="emailHelp" onChange={onChange} minLength={3} required />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="editDescription" className="form-label">Description</label>
                                    <input type="text" className="form-control" id="editDescription" name="editDescription" value={note.editDescription} onChange={onChange} minLength={5} required />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="editTag" className="form-label">Tag</label>
                                    <input type="text" className="form-control" id="editTag" name="editTag" value={note.editTag} onChange={onChange} />
                                </div>
                            </form>
                        </div>
                        <div className="modal-footer">
                            <button type="button" ref={refClose} className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button disabled={note.editTitle.length < 3 || note.editDescription.length < 5} type="button" className="btn btn-primary" onClick={handleClick} >Update Note</button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="container g-0 my-3">
                <h2>Your Notes</h2>
                <div className="container mx-2">
                    {notes.length === 0 && 'No notes to Display'}
                </div>
                <div className="row">
                    {notes.map((note) => {
                        return <Noteitem key={note._id} updateNote={updateNote} note={note} showAlert={props.showAlert} />
                    })}
                </div>
            </div>
        </>
    )
}

export default Notes
