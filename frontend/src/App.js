import React, {useState, useEffect} from "react";
import { useForm } from "react-hook-form";
import './App.css';

//Global variables to aid in displaying cards
var displayIndex = 0;
var lowerBoundEstablished = false;
var lowerBound;
var filter = "all";

function App() {
  const [cards, setCards] = useState([]);
  const [deck, setDeck] = useState([]);
  const [viewer, setViewer] = useState(0);
  //const [filter, setFilter] = useState("");

  useEffect(() =>{
    getCards();
  }, []);

  function getCards() {
    fetch("http://localhost:8081/Cards/display/" + filter + "/" + displayIndex)
    .then(response => response.json())
    .then((data) => {
      console.log(data);
      setCards(data);
      if(!lowerBoundEstablished)
      {
        lowerBound = data[0].id - 1;
        displayIndex = lowerBound;
        lowerBoundEstablished = true;
      }
    });
  }

  function addToDeck(object)
  {
    if(deck.length == 100)
    {
      alert("Your deck is full");
      return;
    }
    console.log(object);
    var index = (object.id - 1) % 20;
    console.log("Card at index");
    console.log(cards[index]);
    const deckPost = {
      colors: cards[index].colors,
      identifiers: cards[index].identifiers,
      id: cards[index].id
    };
    console.log("POST Data");
    console.log(deckPost);
    fetch("http://localhost:8081/Deck", 
    {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(deckPost)
    })
    .then(response => {
      console.log(response.data);
    })
    .catch(error => {
      console.log(error);
    });
    alert("Card Added");
    return;
  }

  const showCards = cards.map((el) => (
    <div key={el.id}>
      <img src={el.identifiers.scryfallId} width={200} alt="images"/>
      <button key={el.id} class="btn btn-green" onClick={() => addToDeck(el)}>Add to Deck</button>
    </div>
  ));

  function deleteFromDeck(object)
  {
    const id = object.id;
    console.log(id);
    fetch("http://localhost:8081/Deck/" + id, 
    {
      method: 'DELETE'
    })
    .then(response => {
      console.log(response.data);
    })
    .catch(error => {
      console.log(error);
    });
    alert("Card Removed");
    getDeck();
    return;
  }

  const showDeck = deck.map((el) => (
    <div key={el.id}>
      <img src={el.identifiers.scryfallId} width={200} alt="images"/>
      <button key={el.id} class="btn btn-red" onClick={() => deleteFromDeck(el)}>Remove Card</button>
    </div>
  ));

  function getDeck() {
    fetch("http://localhost:8081/Deck")
    .then(response => response.json())
    .then((data) => {
      console.log(data);
      setDeck(data);
    });
    setViewer(1);
  }

  const navBar = (
    <div>
      <button class="btn-nav" onClick={() => setViewer(0)}>Home</button>
      <button class="btn-nav" onClick={() => getDeck()}>Deck</button>
      <button class="btn-nav" onClick={() => setViewer(2)}>Change Image</button>
      <button class="btn-nav" onClick={() => setViewer(3)}>Student Information</button>
    </div>
  );

  function changePage(i)
  {
    if(i === 0)
    {
      if((displayIndex - 20) >= lowerBound)
      {
        displayIndex = displayIndex - 20;
        getCards();
      }
      else
      {
        alert("Viewing first page");
        return;
      }
    }
    else
    {
      if(cards.length === 20)
      {
        displayIndex = displayIndex + 20;
        getCards();
      }
      else
      {
        alert("Viewing last page");
        return;
      }
    }
  }

  const prevnext = (
    <div>
      <button class="btn-nav" onClick={() => changePage(0)}>Prev</button>
      <button class="btn-nav" onClick={() => changePage(1)}>Next</button>
    </div>
  );

  function deleteDeck()
  {
    fetch("http://localhost:8081/Deck", 
    {
      method: 'DELETE'
    })
    .then(response => {
      console.log(response.data);
    })
    .catch(error => {
      console.log(error);
    });
    alert("Deck Cleared");
    getDeck();
    return;
  }

  const handleCheckBoxChange = (char) =>
  {
    filter = char;
    lowerBoundEstablished = false;
    displayIndex = 0;
    getCards();
    return;
  }

  if(viewer === 0)
  {
    return (
      <div>
        {navBar}
        <div>
          <label>
            <input type="checkbox" checked={filter === "all"} onChange={() => handleCheckBoxChange("all")}/>
            All Cards
          </label>
          <label>
            <input type="checkbox" checked={filter === "W"} onChange={() => handleCheckBoxChange("W")}/>
            White
          </label>
          <label>
            <input type="checkbox" checked={filter === "B"} onChange={() => handleCheckBoxChange("B")}/>
            Black
          </label>
          <label>
            <input type="checkbox" checked={filter === "R"} onChange={() => handleCheckBoxChange("R")}/>
            Red
          </label>
          <label>
            <input type="checkbox" checked={filter === "U"} onChange={() => handleCheckBoxChange("U")}/>
            Blue
          </label>
          <label>
            <input type="checkbox" checked={filter === "G"} onChange={() => handleCheckBoxChange("G")}/>
            Green
          </label>
        </div>
        <div class="flex flex-row">
          {showCards}
        </div>
        {prevnext}
      </div>
    );
  }
  else if(viewer === 1)
  {
    return (
      <div>
        {navBar}
        <div>
          <h1>Cards in deck: {deck.length}/100</h1>
          <button class="btn btn-orange" onClick={() => deleteDeck()}>Clear Deck</button>
        </div>
        <div>
          {showDeck}
        </div>
      </div>
    );
  }
  else if(viewer === 2)
  {
    return (
      <div>
        {navBar}
      </div>
    );
  }
  else if(viewer === 3)
  {
    return (
      <div>
        {navBar}
      </div>
    );
  }
  
}

export default App;
