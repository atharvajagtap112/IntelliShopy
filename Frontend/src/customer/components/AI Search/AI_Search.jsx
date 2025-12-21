import React, { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { findProducts } from '../../../State/Product/Action';
import { useNavigate } from 'react-router-dom';

const AISearch = () => {
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [socket, setSocket] = useState(null);
  const searchRef = useRef(null);
  
  const dispatch = useDispatch();
  const navigation = useNavigate();

  useEffect(() => {
    const connectWebSocket = () => {
      const ws = new WebSocket("ws://localhost:3333/chat");

      ws.onopen = () => {
        console.log("✅ WebSocket connection established.");
      };

      ws.onmessage = (event) => {
        console.log("🔹 Received WebSocket Message: ", event.data);
        setIsLoading(false);
        
        try {
          let data = JSON.parse(event.data);

          console.log("🔹 Parsed WebSocket Data: ", data);

          if (data.category === "") {
            setSearchResults([]);
            setShowResults(true);
          } else {
            dispatch(findProducts(data));
            navigation(`/search/${data.category}`);
          }

        } catch (error) {
          console.error("❌ Error parsing WebSocket response:", error);
          setSearchResults([]);
          setShowResults(true);
        }
      };

      ws.onerror = (error) => {
        console.error("❌ WebSocket Error: ", error);
        setIsLoading(false);
      };

      return ws;
    };

    const newSocket = connectWebSocket();
    setSocket(newSocket);

    return () => {
      if (newSocket) {
        newSocket.close();
      }
    };
  }, [dispatch, navigation]);

  const handleSearch = () => {
    if (userInput.trim() === "" || !socket) return;

    setShowResults(false);
    setIsLoading(true);
    socket.send(userInput);
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  const clearSearch = () => {
    setUserInput('');
    setShowResults(false);
    setSearchResults([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-2xl">🛒</span>
              <h1 className="text-2xl font-bold text-gray-800">IntelliShop</h1>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <span className="text-lg">✨</span>
              <span>AI-Powered Search</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Search Section */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            Find anything with <span className="text-blue-600">AI</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Describe what you're looking for in natural language. Our AI will find the perfect products for you.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative mb-8" ref={searchRef}>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <span className="text-gray-400 text-lg">🔍</span>
            </div>
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Try 'cotton men's kurta for summer' or 'slim fit jeans under 1500'"
              onKeyPress={handleKeyPress}
              className="w-full pl-12 pr-20 py-4 text-lg border-2 border-gray-200 rounded-2xl focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all duration-200 shadow-lg"
              disabled={isLoading}
            />
            <div className="absolute inset-y-0 right-0 flex items-center space-x-2 pr-4">
              {userInput && (
                <button
                  onClick={clearSearch}
                  className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <span className="text-gray-400 text-lg">✕</span>
                </button>
              )}
              {/* <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <span className="text-gray-400 text-lg">🎤</span>
              </button> */}
              <button
                onClick={handleSearch}
                disabled={isLoading || !userInput.trim()}
                className="px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Searching...</span>
                  </div>
                ) : (
                  'Search'
                )}
              </button>
            </div>
          </div>
        </div>



        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
              <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
            <h3 className="text-lg font-medium text-gray-800 mb-2">AI is thinking...</h3>
            <p className="text-gray-600">Finding the best products for you</p>
          </div>
        )}

        {/* Results Section */}
        {showResults && !isLoading && (
          <div className="bg-white rounded-2xl shadow-lg border p-6">
            {searchResults.length === 0 ? (
              // No products found
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 rounded-full mb-4">
                  <span className="text-3xl">⚠️</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">No products found</h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  We couldn't find any products matching your search. Try different keywords or browse our categories.
                </p>
                <div className="flex justify-center space-x-4">
                  <button
                    onClick={clearSearch}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Try another search
                  </button>
                 
                </div>
              </div>
            ) : (
              // Products found
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-gray-800">
                    Found {searchResults.length} products for "{userInput}"
                  </h3>
                  <button
                    onClick={clearSearch}
                    className="text-blue-600 hover:text-blue-700 font-medium"
                  >
                    New search
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {searchResults.map((product, index) => (
                    <div
                      key={index}
                      className="border border-gray-200 rounded-xl p-4 hover:shadow-lg hover:border-blue-300 transition-all duration-200 cursor-pointer group"
                    >
                      <div className="bg-gray-100 rounded-lg h-48 mb-4 flex items-center justify-center group-hover:bg-gray-200 transition-colors">
                        <span className="text-4xl">📦</span>
                      </div>
                      <h4 className="font-semibold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">
                        {product.name}
                      </h4>
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold text-green-600">{product.price}</span>
                        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                          View Details
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}


      </div>
    </div>
  );
};

export default AISearch;