import './App.css';
import { Route, Routes } from 'react-router-dom';
import Layout from './layout';
import Indexpage from './Pages/Indexpage';
import Loginpage from './Pages/Loginpage';
import Registerpage from './Pages/Registerpage';
import { UserContextProvider } from './userContext';
import Createpost from "./Pages/createpost.js";
import Postpage from './Pages/Postpage';
import Editpost from './Pages/Editpost';
function App() {
  return (
    <UserContextProvider>
      <Routes>
      <Route path={"/"} element={<Layout />}>
      <Route index element= {<Indexpage/>} />
      <Route path={"/login"} element ={<Loginpage/> }/>
      <Route path ={"/register"} element={<Registerpage/>}/>
      <Route path={"/create"} element={<Createpost/>} />
      <Route path="/post/:id" element={<Postpage />} />
      <Route path="/edit/:id" element={<Editpost />} />
      </Route>
    </Routes>
    </UserContextProvider>
    
  );
}

export default App;
