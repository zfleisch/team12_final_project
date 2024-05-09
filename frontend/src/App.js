import './App.css';
import React, {useState, useEffect} from "react";
import {Products} from "./Products";
import logo from './logo.png';

function App() {
  const [viewer, setViewer] = useState(0);

  const updateHooks = (e) => {
    setViewer(e);
  }

  function Cart() {
    return (
      <div>
        Cart View
      </div>
    );
  }
  function Shop() {
    const [cart, setCart] = useState([]);
    const [cartTotal, setCartTotal] = useState(0);
    const [query, setQuery] = useState('');
    const [ProductsCategory, setProductsCategory] = useState(Products);

    const handleChange = (e) => {
      setQuery(e.target.value);
      console.log("Step 6: in handleChange, Target value: ", e.target.value, " Query Value: ", query);
      const results = Products.filter(eachProduct => {
        if(e.target.value === "") return ProductsCategory;
        return eachProduct.title.toLowerCase().includes(e.target.value.toLowerCase())
      });
      setProductsCategory(results);
    }

    useEffect(() => {
        total();
    }, [cart]);

    const total = () => {
        let totalVal = 0;
        for(let i = 0; i < cart.length; i++) {
            totalVal += cart[i].price;
        }
        setCartTotal(totalVal);
    }

    const addToCart = (el) => {
        setCart([...cart, el]);
    }

    const removeFromCart = (el) => {
      let itemFound = false;
      const updatedCart = cart.filter((cartItem) => {
        if(cartItem.id === el.id && !itemFound)
        {
          itemFound = true;
          return false;
        }
        return true;
      });
        if(itemFound)
        {
          setCart(updatedCart);
        }
    }

    const cartItems = cart.map((el) => (
        <div key={el.id}>
            <img class="img-fluid" src={el.image} width={150} />
            {el.title}
            ${el.price}
        </div>
    ));

    function howManyofThis(id) {
        let hmot = cart.filter((cartItem) => cartItem.id === id);
        return hmot.length;
    }

    const listItems = ProductsCategory.map((el) =>(
        // PRODUCT
        <div class="row border-top border-bottom" key={el.id}>
            <div class="group relative shadow-lg">
                <div className=" min-h-80 bg-gray-200 aspect-w-1 aspect-h-1 rounded-md overflow-hidden group-hover:opacity-75 lg:h-60 lg:aspect-none">
                    <img className="w-full h-full object-center object-cover lg:w-full lg:h-full" src={el.image} width={200}/>
                </div>
                <div className="flex justify-between p-3">
                  <div>
                    <h3 className="text-sm text-gray-700">
                    <div class="row text-muted"><strong>{el.title}</strong></div>
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">Rating: {el.rating.rate}</p>
                    <p className="text-sm font-medium text-green-600">${el.price}</p>
                  </div>
                </div>
                <div class="col">
                    <button class="bg-gray-500 text-white py-2 px-6 rounded-md" type="button" onClick={() => removeFromCart(el)} > - </button>{" "}
                    <button class="bg-gray-500 text-white py-2 px-6 rounded-md" type="button" onClick={() => addToCart(el)}> + </button>
                   
                </div>
            </div>
        </div>
    ));
    return <div className="flex fixed flex-row">
        <div className="h-screen  bg-slate-800 p-3 xl:basis-1/5" style={{ minWidth: '65%' }}>
          <img className="w-full" src={logo} alt="Sunset in the mountains" width={200}/>
          <div className="px-6 py-4">
            <h1 className="text-3xl mb-2 font-bold text-white"> Product Catalog App </h1>
            <p className="text-gray-700 text-white">
              by - <b style={{ color: 'orange' }}>Zak Fleischman, John Lavigne</b>
            </p>
            <div className="py-10">
              <input className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg
  focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700
  dark:border-gray-600 dark:placeholder-gray-400 dark:text-white
  dark:focus:ring-blue-500 dark:focus:border-blue-500" type="search" value={query} onChange={handleChange}/>
            </div>
            <h3 className="text-lg text-gray-700">Items in cart: {cart.length}</h3>
            <button class="bg-red-500 text-white py-2 px-6 rounded-md" onClick={() => updateHooks(1)}>CHECKOUT </button>
          </div>
        </div>
        <div className="ml-5  p-10 xl:basis-4/5">
          <div className='category-section fixed'>
      <h2 className="text-3xl font-extrabold tracking-tight text-gray-600 category-title">Products (6)</h2>
      <div className="m-6 p-3 mt-10 ml-0 grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-6 xl:gap-x-10" style={{ maxHeight: '800px', overflowY: 'scroll' }}>
        {/* Loop Products */}
        {listItems}
      </div>
    </div>
        </div>
      </div>
    
    
    
    
    
    
    
    
    ;
  };
  /*For activity 12 I did a return statement like: 
  if(viewer === 0)
  {
    return (<div><Checkout/></div>)
  }
  else if(viewer === 1)
  {
    return (<div><Shop/></div>)
  }
  etc...
  */
 if(viewer === 0)
 {
  return (
    <div>
        <Shop/>
    </div>
    );
 }
 else if (viewer === 1)
 {
  return (
    <div>
        <Cart/>
    </div>
    );
 }

} //end App

export default App;
