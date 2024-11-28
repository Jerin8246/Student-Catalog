import './App.css';
import React, {Fragment} from 'react';
import AddStudent from "./components/AddStudent"

function App() {
  return (
    <Fragment>
      <div className="container">
          <AddStudent/>
      </div>
    </Fragment>
  );
}

export default App;
