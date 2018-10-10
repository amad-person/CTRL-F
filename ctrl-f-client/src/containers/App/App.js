import React, { Component } from 'react';
import Header from '../../components/Header/Header';
import FileDrop from '../FileDrop/FileDrop';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Header/>
        <FileDrop/>
      </div>
    );
  }
}

export default App;
