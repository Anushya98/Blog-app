import { useState } from "react"
export default function Registerpage(){
    const [username,setUsername]=useState('');
    const [password,setPassword]=useState('');
    async function register(ev) {
        ev.preventDefault();
        const response = await fetch('http://localhost:4000/register', {
          method: 'POST',
          body: JSON.stringify({username,password}),
          headers: {'Content-Type':'application/json'},
        });
        if (response.status === 200) {
            alert('registration successful');
          } else {
            alert('registration failed');
          }
    }
    return(
        <form className="Register" onSubmit={register}>
            <h1>REGISTER</h1>
            <input type="text" placeholder="Username"
            value={username}
            onChange={ev => setUsername(ev.target.value)}/>
            <input type="password" placeholder="password" value={password}
             onChange={ev => setPassword(ev.target.value)}/>
            <button>Register</button>
        </form>
    )
}