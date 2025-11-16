import React, { useState, useEffect } from "react";
import "./BingoCard.css";
import images, { imageMap } from "../common/images";
import { encodeState, decodeState, fyShuffle } from "../common/shareCode";

function SettingsModal({
  isOpen,
  onClose,
  includeMiiCharacters,
  setIncludeMiiCharacters,
  includeDashFighters,
  setIncludeDashFighters,
}) {
  if (!isOpen) return null;

  return (
    <div className="modal">
      <div className="modal-content">
        <h4>設定</h4>
        <label>
          Miiファイターを含める:
          <input
            type="checkbox"
            checked={includeMiiCharacters}
            onChange={() => setIncludeMiiCharacters(!includeMiiCharacters)}
          />
        </label>
        <label>
          ダッシュファイターを含める:
          <input
            type="checkbox"
            checked={includeDashFighters}
            onChange={() => setIncludeDashFighters(!includeDashFighters)}
          />
        </label>
        <button onClick={onClose}>閉じる</button>
      </div>
    </div>
  );
}

function BingoCard2({ color }) {
  const [selectedImages, setSelectedImages] = useState([]);
  const [clicked, setClicked] = useState(Array(9).fill(false));
  const [includeMiiCharacters, setIncludeMiiCharacters] = useState(true);
  const [roomCode, setRoomCode] = useState("");
  const [inputCode, setInputCode] = useState("");
  const [showSettings, setShowSettings] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [includeDashFighters, setIncludeDashFighters] = useState(true);

  useEffect(() => {
    generateBingoCard(false);
  }, []);

  const generateBingoCard = (showAlert = true) => {
    if (showAlert && !isInitialLoad) {
      if (
        !window.confirm(
          "新しいビンゴカードを生成しますか？進行中のゲームはリセットされます。"
        )
      ) {
        return;
      }
    }

    let shuffled = [...images].sort(() => 0.5 - Math.random());
    if (!includeMiiCharacters) {
      shuffled = shuffled.filter(
        (img) =>
          ![
            imageMap.miifighter,
            imageMap.miigunner,
            imageMap.miiswordsman,
          ].includes(img)
      );
    }
    if (!includeDashFighters) {
      shuffled = shuffled.filter(
        (img) =>
          ![
            imageMap.daisy,
            imageMap.pitb,
            imageMap.samusd,
            imageMap.richter,
          ].includes(img)
      ); // dashFighters は除外したいダッシュファイターのリスト
    }
    setSelectedImages(shuffled.slice(0, 9));

    // ビンゴカードの真ん中をデフォルトで選択
    const initialClicked = Array(9).fill(false);
    initialClicked[4] = true; // 5x5ビンゴで真ん中のマスを選択
    setClicked(initialClicked);

    setRoomCode(encodeState(shuffled.slice(0, 9)));
    setIsInitialLoad(false);
  };

  const handleLoadBingo = () => {
    const decodedImages = decodeState(inputCode);
    setSelectedImages(decodedImages);
    setClicked(Array(9).fill(false));
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(roomCode).then(
      () => {
        alert("コードをコピーしました。");
      },
      () => {
        alert("コピーに失敗しました。");
      }
    );
  };

  const handleCellClick = (index) => {
    const newClicked = [...clicked];
    newClicked[index] = !newClicked[index];
    setClicked(newClicked);
  };

  const toggleSettings = () => {
    setShowSettings(!showSettings);
  };

  const teamLabel =
    color === "red" ? "赤チームのビンゴコード" : "青チームのビンゴコード";

  return (
    <div className="bingo-container" style={{ borderColor: color }}>
      <h3 style={{ textAlign: "center" }}>{teamLabel}</h3>
      <div
        style={{ display: "flex", justifyContent: "center", margin: "10px 0" }}
      >
        <textarea
          readOnly
          value={roomCode}
          style={{
            marginRight: "10px",
            height: "50px",
            resize: "none",
            overflow: "hidden",
          }}
        />
        <button onClick={handleCopyCode}>コピーする</button>
      </div>
      <div
        style={{ display: "flex", justifyContent: "center", margin: "10px 0" }}
      >
        <input
          type="text"
          value={inputCode}
          onChange={(e) => setInputCode(e.target.value)}
          placeholder="ビンゴコードを入力"
          style={{ marginRight: "10px" }}
        />
        <button onClick={handleLoadBingo}>ビンゴをロードする</button>
      </div>
      <div className={`bingo-card bingo-card-3x3 ${color}`}>
        {selectedImages.map((image, index) => (
          <div
            key={index}
            className={`bingo-cell bingo-cell-3x3 ${
              clicked[index] ? "clicked" : ""
            }`}
            onClick={() => handleCellClick(index)}
            style={{ backgroundImage: `url(${image})` }}
          ></div>
        ))}
      </div>
      <div
        style={{ display: "flex", justifyContent: "center", marginTop: "10px" }}
      >
        <button onClick={() => generateBingoCard(true)}>ビンゴを作る</button>
        <button onClick={toggleSettings}>設定</button>
      </div>
      {showSettings && (
        <SettingsModal
          isOpen={showSettings}
          onClose={toggleSettings}
          includeMiiCharacters={includeMiiCharacters}
          setIncludeMiiCharacters={setIncludeMiiCharacters}
          includeDashFighters={includeDashFighters} // 新しいプロパティを渡す
          setIncludeDashFighters={setIncludeDashFighters} // 新しいプロパティを渡す
        />
      )}
    </div>
  );
}

export default BingoCard2;
