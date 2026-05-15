import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import BingoCard from "./BingoCard/BingoCard";
import Settings from "./BingoCard/Settings";
import BingoCard2 from "./BingoCard/BingoCard33";
import BingoCard3 from "./BingoCard/BingoCard77";
import BingoLayout from "./BingoLayout";

// ★ 追加：デッキメーカー
import DeckMaker from "./DeckMaker/DeckMaker";

import "../App.css";

function App() {
  const [showRules, setShowRules] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleRules = () => {
    setShowRules(!showRules);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (!event.target.closest(".nav, .hamburger")) {
        if (isMenuOpen) setIsMenuOpen(false);
      }
    };

    document.addEventListener("click", handleOutsideClick);

    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, [isMenuOpen]);

  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <div className="header-content">
            <h1>チームビンゴツール</h1>

            <button
              className="hamburger"
              onClick={toggleMenu}
              aria-label="メニュー"
              aria-haspopup="true"
              aria-expanded={isMenuOpen}
              aria-controls="global-nav"
            >
              {isMenuOpen ? "✕" : "☰"}
            </button>

            <nav
              id="global-nav"
              className={`nav ${isMenuOpen ? "open" : ""}`}
              role="menu"
              onClick={(e) => e.stopPropagation()}
            >
              <ul>
                <li>
                  <Link to="/" onClick={toggleMenu}>
                    チームビンゴツール
                  </Link>
                </li>
                <li>
                  <Link to="/bingo2" onClick={toggleMenu}>
                    チームビンゴ3×3
                  </Link>
                </li>
                <li>
                  <Link to="/bingo3" onClick={toggleMenu}>
                    チームビンゴ7×7
                  </Link>
                </li>

                {/* ★ 追加：デッキメーカーへの導線 */}
                <li>
                  <Link to="/deck" onClick={toggleMenu}>
                    デッキメーカー
                  </Link>
                </li>

                {/* 区切り線っぽく入れたいならCSS側でli+li { border-top:1px ...}してもOK */}
                <li>
                  <Link to="/settings" onClick={toggleMenu}>
                    HELP
                  </Link>
                </li>
              </ul>
            </nav>

            {isMenuOpen && (
              <div className="backdrop" onClick={() => setIsMenuOpen(false)} />
            )}
          </div>
        </header>

        <Routes>
          <Route path="/" element={<BingoLayout CardComponent={BingoCard} />} />
          <Route path="/bingo2" element={<BingoLayout CardComponent={BingoCard2} />} />
          <Route path="/bingo3" element={<BingoLayout CardComponent={BingoCard3} />} />

          {/* ★ 追加：デッキメーカーのルーティング */}
          <Route path="/deck" element={<DeckMaker />} />

          <Route path="/settings" element={<Settings />} />
        </Routes>

        <footer className="App-footer">X:@misodare_chan</footer>
      </div>
    </Router>
  );
}

export default App;
