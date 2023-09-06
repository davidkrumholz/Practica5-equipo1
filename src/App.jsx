import { useEffect } from "react";
import { useState } from "react";
import "./App.css";

function App() {

  const [user, setUser] = useState({});
  const [token, setToken] = useState("");
  const [getUsers, setGetUsers] = useState([]);
  const [update, setUpdate] = useState(false);
  const [friendsOfUser, setFriendsOfUser] = useState([]); 


  const userHandler = (event) => {
    const property = event.target.name;
    const value = event.target.value;
    setUser({...user, [property]: value});
  }

  const saveUser = async () => {
    const response = await fetch("https://javascript27g-default-rtdb.firebaseio.com/equipo1/.json", {
      method: "POST",
      body: JSON.stringify(user)
    });
    const data = await response.json();
    setToken(data.name);
    localStorage.setItem("token", data.name);
  }

  useEffect(() => {
    const token = localStorage.getItem("token");
    if(token) {
      setToken(token);
    }
  }, []);

  useEffect(() => {
    const getFriends = async () => {
      const response = await fetch("https://javascript27g-default-rtdb.firebaseio.com/equipo1/.json");
      const data = await response.json();
      setGetUsers(data);
    }
    getFriends();
  }, []);

  const addFriend = async (key) => {
    const userKey = Object.keys(getUsers).filter(keyUser => keyUser == key);
    const ObjectUser = [{
      id: userKey[0],
      name: getUsers[userKey].name,
      email: getUsers[userKey].email
    }]

    setFriendsOfUser(ObjectUser);

    console.log("friends of user");
    console.log(friendsOfUser);
    const response = await fetch(`https://javascript27g-default-rtdb.firebaseio.com/equipo1/${token}/friends.json`, {
      method: "PATCH",
      headers: { 'Content-Type': 'application/json' },
      body: await JSON.stringify(friendsOfUser)
    });
    const data = await response.json();
    console.log(data);
  }
  return (
    <>
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="card">
              <div className="card-body">
              <form>
            <div className="form-group">
                <label htmlFor="name">Nombre</label>
                <input
                  type="text"
                  className="form-control"
                  id="name"
                  placeholder="Nombre"
                  name="name"
                  onChange={(event) => userHandler(event)}
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">Correo</label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  aria-describedby="emailHelp"
                  placeholder="Correo"
                  name="email"
                  onChange={(event) => userHandler(event)}
                />
              </div>
              <button type="button" className="btn btn-primary mt-3" onClick={saveUser}>
                Iniciar sesión
              </button>
            </form>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <h1>Lista de amigos</h1>
            <ul className="list-group">
              {getUsers && Object.keys(getUsers).filter(user => user != token).map((key) => {
                return (
                  <li key={key} className="list-group-item">
                  <p>Nombre: {getUsers[key].name}</p>
                  <p>Correo: {getUsers[key].email}</p>
                  <button className="btn btn-success" onClick={() => addFriend(key)}>Añadir como amigo</button>
                </li>
                )
              })}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
