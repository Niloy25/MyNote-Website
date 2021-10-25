import React,{useState} from 'react';
import { useHistory } from 'react-router-dom';

function Signup(props) {
    const host = "http://localhost:8000";
    const [credential, setcredential] = useState({name: "", email: "", phone: "", userName: "", password: "", cPassword: ""});
    let history = useHistory();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const {name, email, phone, userName, password} = credential
        const response = await fetch(`${host}/api/auth/createuser`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({name, email, phone, userName, password})
        });
        const json = await response.json();
        console.log(json);
        if (json.success){
            // Save the auth-token and redirect
            localStorage.setItem('token', json.authToken);
            props.showAlert("Account Created Successfully", "success");
            history.push("/")
        }
        else{
            props.showAlert("Invalid Credentials", "danger")
        }
    }

    const onChange = (e) => {
        // setnote({title: e.target.value, description: e.target.value, tag: e.target.value})
        setcredential({ ...credential, [e.target.name]: e.target.value })
        console.log(credential);
    }
    return (
        <div className="container my-3">
            <h3>Create an Account to use MyNoteApp</h3>
            <form onSubmit={handleSubmit}>
                <div className="my-3">
                    <label htmlFor="name" className="form-label">Name</label>
                    <input type="text" className="form-control" onChange={onChange} id="name" name="name" aria-describedby="emailHelp" minLength={5} required />
                </div>
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email Address</label>
                    <input type="email" className="form-control" onChange={onChange} id="email" name="email" aria-describedby="emailHelp" required />
                </div>
                <div className="mb-3">
                    <label htmlFor="phone" className="form-label">Phone Number</label>
                    <input type="text" className="form-control" onChange={onChange} id="phone" name="phone" aria-describedby="emailHelp" required />
                </div>
                <div className="mb-3">
                    <label htmlFor="userName" className="form-label">Username</label>
                    <input type="text" className="form-control" onChange={onChange} id="userName" name="userName" aria-describedby="emailHelp" minLength={5} required />
                </div>
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input type="password" className="form-control" onChange={onChange} id="password" name="password" minLength={8} required />
                </div>
                <div className="mb-3">
                    <label htmlFor="cPassword" className="form-label">Confirm Password</label>
                    <input type="password" className="form-control" onChange={onChange} id="cPassword" name="cPassword" />
                </div>
                <button type="submit" className="btn btn-primary">Submit</button>
            </form>
        </div>
    )
}

export default Signup
