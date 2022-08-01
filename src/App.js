import { Route, Routes } from 'react-router-dom';
import Mint from './Mint.js';
import Manage from './Manage.js';


function App() {
  return (
    <div>
      <Routes>
        <Route exact path="/" element={<Mint />} />
        <Route exact path="/Manage" element={<Manage />} />
      </Routes>
    </div>


  );
}

export default App;
