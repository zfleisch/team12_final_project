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
  const [updateImage, setUpdateImage] = useState(false);
  const [updateCard, setUpdateCard] = useState([]);
  const [newImage, setNewImage] = useState("");
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

  function updateSearch(id) {
    console.log(id);
    if(id >= 1 && id <= 449)
    {
      fetch("http://localhost:8081/Cards/" + id)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setUpdateCard(data);
      })
      setUpdateImage(true);
    }
    else
    {
      console.log("Index out of bounds")
    }
  }

  function updateCardImage()
    {
      const inputCard = {
        colors: updateCard[0].colors,
        identifiers: {
          scryfallId: newImage
        },
        id: updateCard[0].id,
      };
      console.log(updateCard);
      fetch("http://localhost:8081/Cards/image/" + updateCard[0].id, 
      {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(inputCard)
      })
      .then(response => {
        console.log(response.data);
      })
      .catch(error => {
        console.log(error);
      });
      setUpdateImage(false);
      setNewImage("");
      alert("Image updated");
      getCards();
      setViewer(0);
    }

    const showUpdateCard = updateCard.map((el) => (
      <div key={el.id}>
        <img src={el.identifiers.scryfallId} width={200} alt="images"/>
      </div>
    ));

    const handleChange = (e) => {
      setNewImage(e.target.value);
    }

    const updateButton = (
      <div>
        <input className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg
focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700
dark:border-gray-600 dark:placeholder-gray-400 dark:text-white
dark:focus:ring-blue-500 dark:focus:border-blue-500" type="search" value={newImage} onChange={handleChange}/>
        <button onClick={() => updateCardImage()}>Change Image</button>
      </div>
    );

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
        <div>
          <h1>Sometimes we get older images without knowing!!</h1>
          <h2>Use this page to update a specific cards image to the most recent printing</h2>
          <h3>Find card to update</h3>
          <input type="text" id="message" name="message" placeholder="id" onChange={(e) => updateSearch(e.target.value)}/>
          {updateImage && showUpdateCard}
          {updateImage && updateButton}
        </div>
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
