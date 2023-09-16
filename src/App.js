import { Route, Routes, Link,BrowserRouter } from 'react-router-dom';
import { Home } from './pages/Home';
import { Block } from './pages/Block';
import { Transactions } from './pages/BlockTransactions';
import { Transaction } from './pages/Transaction';
import { Address } from './pages/Address';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Button } from 'react-bootstrap';

import './App.css';

function App() {

  return (
  <BrowserRouter>
    <div>
        <Container>
        <br/>
        <div>
          <Link to={"/"}><Button variant="light"><h1>Ethereum Block Explorer</h1></Button></Link>
        </div>
        </Container>
      
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/block/:id" element={<Block />}/>
          <Route path="/transaction/:id" element={<Transaction />}/>
          <Route path="/address/:id" element={<Address />}/>
          <Route path="/transactions/:id" element={<Transactions />}/>
        </Routes>
    </div>
  </BrowserRouter>
  );
}

export default App;
