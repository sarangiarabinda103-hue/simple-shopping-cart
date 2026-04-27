import { BrowserRouter ,Routes , Route , Link } from "react-router-dom"
import { useState, useCallback } from "react"
import Home from "./pages/Home"
import CardPage from "./pages/CardPage"
import { CartProvider } from "./context/CartContext"
import { useCart } from "./hooks/useCart"
import SearchBar from "./components/SearchBar"
import "./styles.css"

function AppWithSearch() {
  const [searchState, setSearchState] = useState({
    query: '',
    results: [],
    loading: false,
    error: null,
    hasSearched: false,
    isQueryValid: false
  });

  const handleSearchChange = useCallback((searchData) => {
    setSearchState(searchData);
  }, []);

  return (
    <>
      <Navbar onSearchChange={handleSearchChange} />
      <Routes>
        <Route path="/" element={<Home searchState={searchState} />} />
        <Route path="/cart" element={<CardPage />} />
      </Routes>
    </>
  );
}

function Navbar ({ onSearchChange }){
  const { getCartCount } = useCart();
  
  return(
    <nav className="navbar">
      <div className="container">
        <Link className="navbar-brand" to="/">🛒 MyShop</Link>
        <div className="navbar-center">
          <SearchBar placeholder="Search products..." onSearchChange={onSearchChange} />
        </div>
        <div className="navbar-nav">
          <Link className="nav-link me-3" to="/">Home</Link>
          <Link className="nav-link" to="/cart">Cart ({getCartCount()})</Link>
        </div>
      </div>
    </nav>
  )
}


function App(){
  return(
    <CartProvider>
      <BrowserRouter>
        <AppWithSearch />
      </BrowserRouter>
    </CartProvider>
  )
}

export default App
