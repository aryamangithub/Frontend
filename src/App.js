import React, { useState, useEffect } from "react";
import SearchTextList from "./components/SearchTextList/SearchTextList";
import PriceHistoryTable from "./components/PriceHistoryTable/PriceHistoryTable";
import axios from "axios";
import TrackedProductList from "./components/TrackedProductList/TrackedProductList";
import ProductDetailsPage from "./components/ProductDetailsPage/ProductDetailsPage";
import './App.css';

const URL = "http://localhost:5000";

function App() {
  const [showPriceHistory, setShowPriceHistory] = useState(false);
  const [priceHistory, setPriceHistory] = useState([]);
  const [searchTexts, setSearchTexts] = useState([]);
  const [newSearchText, setNewSearchText] = useState("");
  const [showProductDetails, setShowProductDetails] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);


  useEffect(() => {
    fetchUniqueSearchTexts();
  }, []);

  const fetchUniqueSearchTexts = async () => {
    try {
      const response = await axios.get(`${URL}/unique_search_texts`);
      const data = response.data;
      setSearchTexts(data);
    } catch (error) {
      console.error("Error fetching unique search texts:", error);
    }
  };

  const handleSearchTextClick = async (searchText) => {
    try {
      let myUrl = URL + "/results?search_text=" + encodeURI(searchText);
      const response = await axios.get(
        // `${URL}/results?search_text=${searchText}`
        // `${URL}/results?search_text=${encodeURI(searchText)}`
        // `${URL}/results?search_text=`+ myUrl
        myUrl
        );

      const data = response.data;
      setPriceHistory(data);
      setShowPriceHistory(true);
    } catch (error) {
      console.error("Error fetching price history:", error);
    }
  };

  const handlePriceHistoryClose = () => {
    setShowPriceHistory(false);
    setPriceHistory([]);
  };

  const handleNewSearchTextChange = (event) => {
    setNewSearchText(event.target.value);
  };

  const handleNewSearchTextSubmit = async (event) => {
    event.preventDefault();

    try {
      await axios.post(`${URL}/start-scraper`, {
        // search_text: newSearchText,
        search_text: encodeURI(newSearchText),
        url: "https://www.flipkart.com",
      });

      alert("Scraper started successfully");
      setSearchTexts([...searchTexts, newSearchText]);
      setNewSearchText("");
    } catch (error) {
      alert("Error starting scraper:", error);
    }
  };

  const toggleProductDetails = (product = null) => {
    setShowProductDetails(!showProductDetails);
    setCurrentProduct(product);
  };
  

  return (
    <div className="main">
      <h1>Price Tracker</h1>
      <form onSubmit={handleNewSearchTextSubmit}>
        <label>Search for a new item:</label>
        <input
          type="text"
          value={newSearchText}
          onChange={handleNewSearchTextChange}
        />
        <button type="submit">Start Scraper</button>
      </form>
      <SearchTextList
        searchTexts={searchTexts}
        onSearchTextClick={handleSearchTextClick}
      />
      <TrackedProductList />
      {showPriceHistory && (
        <PriceHistoryTable
          priceHistory={priceHistory}
          onClose={handlePriceHistoryClose}
        />
      )}
      { showProductDetails && (
        <ProductDetailsPage 
          product={currentProduct} 
          onClose={() => toggleProductDetails()} 
        />
      )}
    </div>
  );
}

export default App;
