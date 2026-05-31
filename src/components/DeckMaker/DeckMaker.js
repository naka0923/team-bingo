import React, { useState, useEffect } from "react";
import "./DeckMaker.css";
import images from "../common/images";
import { encodeState, decodeState } from "../common/shareCode";

export default function DeckMaker() {
  const [deckImages, setDeckImages] = useState([]);
  const [deckName, setDeckName] = useState("");
  const [savedDecks, setSavedDecks] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);

  useEffect(() => {
    const existing = JSON.parse(localStorage.getItem("myDecks") || "[]");
    setSavedDecks(existing);
  }, []);

  const handleSelectCharacter = (img) => {
    if (deckImages.length >= 25) {
      alert("25枚までしか選べません！");
      return;
    }
    setDeckImages((prev) => [...prev, img]);
  };

  const handleRemoveCharacter = (index) => {
    setDeckImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSaveDeck = () => {
    if (deckImages.length !== 25) {
      alert("25枚選択してください！");
      return;
    }
    const code = encodeState(deckImages);
    const existing = JSON.parse(localStorage.getItem("myDecks") || "[]");

    if (editingIndex !== null) {
      const name = deckName || existing[editingIndex].name;
      const newDecks = existing.map((d, i) =>
        i === editingIndex ? { name, code } : d
      );
      localStorage.setItem("myDecks", JSON.stringify(newDecks));
      setSavedDecks(newDecks);
      alert(`「${name}」を更新しました！`);
      setEditingIndex(null);
    } else {
      const name = deckName || `デッキ ${savedDecks.length + 1}`;
      const newDecks = [...existing, { name, code }];
      localStorage.setItem("myDecks", JSON.stringify(newDecks));
      setSavedDecks(newDecks);
      alert(`「${name}」を保存しました！`);
    }

    setDeckImages([]);
    setDeckName("");
  };

  const handleEditDeck = (index) => {
    const deck = savedDecks[index];
    const decoded = decodeState(deck.code);
    setDeckImages(decoded);
    setDeckName(deck.name);
    setEditingIndex(index);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancelEdit = () => {
    setEditingIndex(null);
    setDeckImages([]);
    setDeckName("");
  };

  const handleCopyCode = async (code) => {
    try {
      await navigator.clipboard.writeText(code);
      alert("コードをコピーしました。ビンゴ画面で貼り付けてください。");
    } catch (e) {
      alert("コピーに失敗しました");
    }
  };

  const handleDeleteDeck = (index) => {
    if (editingIndex === index) handleCancelEdit();
    const next = savedDecks.filter((_, i) => i !== index);
    localStorage.setItem("myDecks", JSON.stringify(next));
    setSavedDecks(next);
  };

  return (
    <div className="deck-maker">
      <h2>デッキメーカー</h2>
      <p>キャラを25枚選んで自分だけのデッキを作成・保存できます。</p>

      {editingIndex !== null && (
        <div className="deck-editing-banner">
          ✏️ 「{savedDecks[editingIndex]?.name}」を編集中
        </div>
      )}

      {/* 25マスプレビュー */}
      <div className="deck-preview">
        {Array.from({ length: 25 }).map((_, i) => (
          <div
            key={i}
            className="deck-cell"
            style={{
              backgroundImage: deckImages[i] ? `url(${deckImages[i]})` : "none",
            }}
            onClick={() => deckImages[i] && handleRemoveCharacter(i)}
            title={deckImages[i] ? "クリックで削除" : ""}
          >
            {!deckImages[i] && <span>{i + 1}</span>}
          </div>
        ))}
      </div>

      {/* キャラ一覧 */}
      <div className="character-grid">
        {images.map((img, i) => (
          <div
            key={i}
            className="character-icon"
            style={{ backgroundImage: `url(${img})` }}
            onClick={() => handleSelectCharacter(img)}
            title="追加する"
          />
        ))}
      </div>

      {/* 保存フォーム */}
      <div className="deck-save">
        <input
          type="text"
          placeholder="デッキ名（任意）"
          value={deckName}
          onChange={(e) => setDeckName(e.target.value)}
        />
        {editingIndex !== null ? (
          <>
            <button onClick={handleSaveDeck}>💾 上書き保存</button>
            <button className="deck-cancel-button" onClick={handleCancelEdit}>
              キャンセル
            </button>
          </>
        ) : (
          <button onClick={handleSaveDeck}>💾 保存する</button>
        )}
      </div>

      {/* 保存済みデッキ一覧 */}
      <div className="deck-list">
        <h3>保存済みデッキ</h3>
        {savedDecks.length === 0 && (
          <p style={{ color: "#aaa" }}>まだ保存されていません。</p>
        )}
        {savedDecks.map((deck, i) => (
          <div
            key={i}
            className={`deck-list-item${editingIndex === i ? " editing" : ""}`}
          >
            <div>
              <strong>{deck.name}</strong>
              <div className="deck-code-preview">{deck.code}</div>
            </div>
            <div className="deck-list-actions">
              <button onClick={() => handleCopyCode(deck.code)}>
                コードをコピー
              </button>
              <button onClick={() => handleEditDeck(i)}>✏️ 編集</button>
              <button onClick={() => handleDeleteDeck(i)}>削除</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
