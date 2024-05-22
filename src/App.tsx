import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Switch, Link, useHistory } from 'react-router-dom';
import { getItemData } from './dataLoader';

interface Item {
  auctionHouseId: number;
  itemId: number;
  petSpeciesId: number | null;
  minBuyout: number;
  quantity: number;
  marketValue: number;
  historical: number;
  numAuctions: number;
}

const Home = ({ items }: { items: Item[] }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const history = useHistory();

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    history.push(`/item/${searchTerm}`);
  };

  return (
    <div>
      <h2>Items</h2>
      <form onSubmit={handleSearch} className="mb-3">
        <div className="input-group">
          <input
            type="text"
            className="form-control"
            placeholder="Search by Item ID"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="input-group-append">
            <button className="btn btn-primary" type="submit">
              Search
            </button>
          </div>
        </div>
      </form>
      <div className="list-group">
        {items.map(item => (
          <Link key={item.itemId} to={`/item/${item.itemId}`} className="list-group-item list-group-item-action">
            Item ID: {item.itemId}
          </Link>
        ))}
      </div>
    </div>
  );
};

const ItemDetail = ({ match }: { match: { params: { id: string } } }) => {
  const [item, setItem] = useState<Item | null>(null);

  useEffect(() => {
    const fetchItem = async () => {
      const items = await getItemData();
      const item = items.find((item: Item) => item.itemId === parseInt(match.params.id));
      setItem(item);
    };

    fetchItem();
  }, [match.params.id]);

  if (!item) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>Item ID: {item.itemId}</h2>
      <p>Min Buyout: {item.minBuyout}</p>
      <p>Market Value: {item.marketValue}</p>
      <p>Quantity: {item.quantity}</p>
      <p>Num Auctions: {item.numAuctions}</p>
      <Link to="/">Go back</Link>
    </div>
  );
};

const App = () => {
  const [items, setItems] = useState<Item[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getItemData();
      setItems(data);
    };

    fetchData();
  }, []);

  return (
    <Router>
      <div className="container">
        <h1>TypeScript Webpage</h1>
        <Switch>
          <Route path="/" exact render={() => <Home items={items} />} />
          <Route path="/item/:id" component={ItemDetail} />
        </Switch>
      </div>
    </Router>
  );
};

export default App;
