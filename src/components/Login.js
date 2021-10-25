import React, {useState} from 'react'
import { useHistory } from 'react-router-dom';

function Login(props) {
    const host = "http://localhost:8000";
    const [credential, setcredential] = useState({userName: "", password: ""});
    let history = useHistory();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch(`${host}/api/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({userName: credential.userName, password: credential.password})
        });
        const json = await response.json();
        console.log(json);
        if (json.success){
            // Save the auth-token and redirect
            localStorage.setItem('token', json.authToken);
            props.showAlert("LoggedIn Successfully", "success");
            history.push("/");
        }
        else{
            props.showAlert("Invalid Details", "danger")
        }
    }

    const onChange = (e) => {
        // setnote({title: e.target.value, description: e.target.value, tag: e.target.value})
        setcredential({ ...credential, [e.target.name]: e.target.value })
        console.log(credential);
    }

    return (
        <div className="container my-3">
            <h3>Login to continue to MyNoteApp</h3>
            <form onSubmit={handleSubmit}>
                <div className="my-3">
                    <label htmlFor="userName" className="form-label">Username</label>
                    <input type="text" className="form-control" onChange={onChange} id="userName" name="userName" aria-describedby="emailHelp" />
                </div>
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input type="password" className="form-control" onChange={onChange} id="password" name="password" />
                </div>
                <button type="submit" className="btn btn-primary">Submit</button>
            </form>
        </div>
    )
}

export default Login
