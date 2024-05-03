import React, {useState, useEffect} from "react";
import { useForm } from "react-hook-form";
import './App.css';

var displayIndex = 0;

function App() {
  const [cards, setCards] = useState([]);
  const [deck, setDeck] = useState([]);

  useEffect(() =>{
    getCards();
  }, []);

  function getCards() {
    fetch("http://localhost:8081/Cards/" + displayIndex)
    .then(response => response.json())
    .then((data) => {
      console.log(data);
      setCards(data);
    });
  }

  function addToDeck(id)
  {
    return;
  }

  const showCards = cards.map((el) => (
    <div key={el.id}>
      <img src={el.identifiers.scryfallId} width={200} alt="images"/>
      <button class="btn btn-green" onClick={addToDeck(el.id)}>Add to Deck</button>
    </div>
  ));

  return (
    <div>
      <div class="flex flex-row">
        {showCards}
      </div>
    </div>
  );
}

export default App;
