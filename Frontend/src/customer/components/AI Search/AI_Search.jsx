import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { findProducts } from '../../../State/Product/Action';
import { useNavigate } from 'react-router-dom';
import { WS_BASE_URL } from '../../../config/apiConfig';

const AISearch = () => {
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [serverError, setServerError] = useState('');
  // The socket lives in a ref, not state: handleSearch closed over a stale
  // `socket` value, so after any reconnect it was calling send() on a dead
  // socket - that is the "already in CLOSING or CLOSED state" error.
  const socketRef = useRef(null);
  const pendingRef = useRef(null);
  const searchRef = useRef(null);

  const dispatch = useDispatch();
  const navigation = useNavigate();

  const openSocket = useCallback(() => {
    const ws = new WebSocket(`${WS_BASE_URL}/chat`);

    ws.onopen = () => {
      // A query typed before the socket finished connecting is flushed here
      // instead of being dropped.
      if (pendingRef.current) {
        ws.send(pendingRef.current);
        pendingRef.current = null;
      }
    };

    ws.onmessage = (event) => {
      setIsLoading(false);
      try {
        const data = JSON.parse(event.data);

        // The old guard only caught category === "". Anything else falsy - a
        // missing key, null, or the backend's {"error": "..."} payload, which
        // carries no category at all - fell through to the else branch and
        // navigated to the literal URL /search/undefined.
        const category =
          typeof data.category === "string" ? data.category.trim() : "";

        if (data.error) {
          setServerError(String(data.error));
          setSearchResults([]);
          setShowResults(true);
          return;
        }

        if (!category) {
          setServerError("");
          setSearchResults([]);
          setShowResults(true);
          return;
        }

        setServerError("");
        dispatch(findProducts(data));
        navigation(`/search/${encodeURIComponent(category)}`);
      } catch (error) {
        console.error("Error parsing WebSocket response:", error);
        setServerError("");
        setSearchResults([]);
        setShowResults(true);
      }
    };

    ws.onerror = () => {
      setIsLoading(false);
      pendingRef.current = null;
    };

    // Without this the ref kept pointing at a closed socket forever.
    ws.onclose = () => {
      if (socketRef.current === ws) socketRef.current = null;
    };

    socketRef.current = ws;
    return ws;
  }, [dispatch, navigation]);

  useEffect(() => {
    openSocket();
    return () => {
      const ws = socketRef.current;
      socketRef.current = null;
      if (ws) ws.close();
    };
  }, [openSocket]);

  const handleSearch = () => {
    const query = userInput.trim();
    if (!query) return;

    setShowResults(false);
    setIsLoading(true);

    const ws = socketRef.current;
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(query);
    } else if (ws && ws.readyState === WebSocket.CONNECTING) {
      pendingRef.current = query;            // its onopen will flush it
    } else {
      pendingRef.current = query;            // closed or never opened - reconnect
      openSocket();
    }
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
    setServerError('');
    // Clearing must also cancel the in-flight search, or the button stays
    // stuck on "Searching..." with nothing coming back.
    setIsLoading(false);
    pendingRef.current = null;
  };

  return (
    <div className="relative min-h-[calc(100vh-4rem)] bg-zinc-950">
      {/* Same restrained bloom + grain as the homepage, so search feels like the
          same room rather than a blank utility page. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-50"
        style={{
          background:
            "radial-gradient(50rem 30rem at 50% 0%, rgba(225,29,84,0.10), transparent 65%)",
        }}
      />
      <div aria-hidden className="grain-layer absolute inset-0 opacity-[0.07]" />

      {/* Main Search Section */}
      <div
        className={`relative mx-auto max-w-4xl px-4 ${
          showResults || isLoading ? "py-12" : "flex min-h-[calc(100vh-4rem)] flex-col justify-center py-12"
        }`}
      >
        <div className="text-center mb-10">
          <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-accent-500">
            Natural language search
          </span>
          <h2 className="mt-3 text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tighter leading-[1.02] text-white">
            Find anything with AI
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-[15px] leading-relaxed text-zinc-400">
            Describe what you're after the way you'd say it out loud. No filters, no category tree.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative mb-8" ref={searchRef}>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
              <span className="text-zinc-500 text-lg">🔍</span>
            </div>
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Try 'cotton men's kurta for summer' or 'slim fit jeans under 1500'"
              onKeyPress={handleKeyPress}
              className="w-full rounded-full border border-white/15 bg-white/[0.06] py-5 pl-14 pr-40 text-base text-white placeholder:text-zinc-500 transition-all duration-200 focus:border-accent-500/60 focus:bg-white/[0.09] focus:outline-none focus:ring-4 focus:ring-accent-500/20"
              disabled={isLoading}
            />
            <div className="absolute inset-y-0 right-0 flex items-center space-x-2 pr-2.5">
              {userInput && (
                <button
                  onClick={clearSearch}
                  className="p-1 hover:bg-white/10 rounded-full transition-colors"
                >
                  <span className="text-zinc-500 text-lg">✕</span>
                </button>
              )}
              {/* <button className="p-2 hover:bg-white/10 rounded-full transition-colors">
                <span className="text-zinc-500 text-lg">🎤</span>
              </button> */}
              <button
                onClick={handleSearch}
                disabled={isLoading || !userInput.trim()}
                className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-zinc-950 transition-all hover:bg-zinc-200 active:scale-[0.98] disabled:bg-white/10 disabled:text-white/40 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-zinc-950 border-t-transparent rounded-full animate-spin"></div>
                    <span>Searching...</span>
                  </div>
                ) : (
                  'Search'
                )}
              </button>
            </div>
          </div>
        </div>



        {/* Example prompts double as the empty state - they teach the input's
            grammar instead of leaving half a screen blank. */}
        {!showResults && !isLoading && (
          <div className="mt-8 flex flex-wrap justify-center gap-2.5">
            {[
              "cotton kurta for summer",
              "silk saree under 1000",
              "lehenga for a wedding",
              "womens office wear",
              "slim fit jeans size L",
            ].map((q) => (
              <button
                key={q}
                onClick={() => setUserInput(q)}
                className="rounded-full border border-white/12 bg-white/[0.04] px-4 py-2 text-sm text-zinc-300 transition-all duration-200 hover:border-white/30 hover:bg-white/[0.09] hover:text-white active:scale-[0.98]"
              >
                {q}
              </button>
            ))}
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-accent-500/15 rounded-full mb-4">
              <div className="w-8 h-8 border-2 border-accent-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
            <h3 className="text-lg font-medium text-zinc-200 mb-2">AI is thinking...</h3>
            <p className="text-zinc-400">Finding the best products for you</p>
          </div>
        )}

        {/* Results Section */}
        {showResults && !isLoading && (
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
            {searchResults.length === 0 ? (
              // No products found
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-accent-500/15 rounded-full mb-4">
                  <span className="text-3xl">⚠️</span>
                </div>
                <h3 className="text-xl font-semibold text-zinc-200 mb-2">
                  {serverError ? "Search is unavailable" : "No products found"}
                </h3>
                <p className="text-zinc-400 mb-6 max-w-md mx-auto">
                  {serverError
                    ? serverError
                    : "We couldn't find any products matching your search. Try different keywords or browse our categories."}
                </p>
                <div className="flex justify-center space-x-4">
                  <button
                    onClick={clearSearch}
                    className="rounded-full bg-white px-6 py-2.5 text-sm font-semibold text-zinc-950 transition-all hover:bg-zinc-200 active:scale-[0.98]"
                  >
                    Try another search
                  </button>
                 
                </div>
              </div>
            ) : (
              // Products found
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-zinc-200">
                    Found {searchResults.length} products for "{userInput}"
                  </h3>
                  <button
                    onClick={clearSearch}
                    className="text-accent-500 hover:text-accent-400 font-medium"
                  >
                    New search
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {searchResults.map((product, index) => (
                    <div
                      key={index}
                      className="border border-white/10 rounded-xl p-4 hover:shadow-lg hover:border-white/25 transition-all duration-200 cursor-pointer group"
                    >
                      <div className="bg-white/10 rounded-lg h-48 mb-4 flex items-center justify-center group-hover:bg-white/10 transition-colors">
                        <span className="text-4xl">📦</span>
                      </div>
                      <h4 className="font-semibold text-zinc-200 mb-2 group-hover:text-accent-500 transition-colors">
                        {product.name}
                      </h4>
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold text-accent-400">{product.price}</span>
                        <button className="px-4 py-2 bg-accent-600 text-white rounded-lg hover:bg-accent-700 transition-colors text-sm font-medium">
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