import React, { useState, useEffect } from "react";
import "./BingoCard.css";
import images, { imageMap } from "../common/images";
import { encodeState, decodeState, fyShuffle } from "../common/shareCode";
import {
  BIASES,
  NEW_FIGHTERS,
  weightByTags,
  sampleWithoutReplacementWeighted,
} from "../common/bingoUtils";

function SettingsModal({
  isOpen,
  onClose,
  includeMiiCharacters,
  setIncludeMiiCharacters,
  includeDashFighters,
  setIncludeDashFighters,
  includeNewFighter,
  setIncludeNewFighter,
  biasId,
  setBiasId,
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
        <label>
          おまかせを含める:
          <input
            type="checkbox"
            checked={includeNewFighter}
            onChange={() => setIncludeNewFighter(!includeNewFighter)}
          />
        </label>
        <label style={{ display: "block", marginTop: 8 }}>
          トッピング:
          <select
            value={biasId}
            onChange={(e) => setBiasId(e.target.value)}
            style={{ marginLeft: 8 }}
          >
            {BIASES.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>
        </label>
        <button onClick={onClose}>閉じる</button>
      </div>
    </div>
  );
}

function BingoCard3({ color, initialCode, onCodeChange }) {
  const [selectedImages, setSelectedImages] = useState([]);
  const [clicked, setClicked] = useState(Array(49).fill(false));
  const [includeMiiCharacters, setIncludeMiiCharacters] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [includeDashFighters, setIncludeDashFighters] = useState(true);
  const [includeNewFighter, setIncludeNewFighter] = useState(true);
  const [biasId, setBiasId] = useState("none");
  const [lastAppliedBias, setLastAppliedBias] = useState(null);

  useEffect(() => {
    if (initialCode) {
      const decodedImages = decodeState(initialCode);
      if (decodedImages.length > 0) {
        setSelectedImages(decodedImages);
        const next = Array(49).fill(false);
        next[24] = true;
        setClicked(next);
        setIsInitialLoad(false);
        return;
      }
    }
    generateBingoCard(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const generateBingoCard = (showAlert = true) => {
    if (showAlert && !isInitialLoad) {
      if (!window.confirm("新しいビンゴカードを生成しますか？進行中のゲームはリセットされます。")) {
        return;
      }
    }

    let pool = [...images];
    if (!includeMiiCharacters) {
      pool = pool.filter(
        (img) => ![imageMap.miifighter, imageMap.miigunner, imageMap.miiswordsman].includes(img)
      );
    }
    if (!includeDashFighters) {
      pool = pool.filter(
        (img) => ![imageMap.daisy, imageMap.pitb, imageMap.samusd, imageMap.richter].includes(img)
      );
    }
    if (!includeNewFighter && NEW_FIGHTERS.length > 0) {
      pool = pool.filter((img) => !NEW_FIGHTERS.includes(img));
    }

    let bias = BIASES.find((b) => b.id === biasId) ?? BIASES[0];
    if (bias.id === "auto") {
      const candidates = BIASES.filter((b) => b.id !== "none" && b.id !== "auto");
      bias = candidates[Math.floor(Math.random() * candidates.length)];
    }

    const picked = fyShuffle(sampleWithoutReplacementWeighted(pool, (img) => weightByTags(img, bias), 49));
    setSelectedImages(picked);

    const initialClicked = Array(49).fill(false);
    initialClicked[24] = true;
    setClicked(initialClicked);

    setLastAppliedBias(bias);
    onCodeChange?.(encodeState(picked));
    setIsInitialLoad(false);
  };

  const handleCellClick = (index) => {
    const newClicked = [...clicked];
    newClicked[index] = !newClicked[index];
    setClicked(newClicked);
  };

  const toggleSettings = () => {
    setShowSettings(!showSettings);
  };

  return (
    <div className="bingo-container" style={{ borderColor: color }}>
      <div
        style={{ textAlign: "center", marginTop: 6, fontSize: 18, color: "#EA3D25" }}
      >
        トッピング（現在）:{" "}
        {lastAppliedBias?.name ?? (BIASES.find((b) => b.id === biasId)?.name || "なし")}
      </div>
      <div className={`bingo-card bingo-card-7x7 ${color}`}>
        {selectedImages.map((image, index) => (
          <div
            key={index}
            className={`bingo-cell bingo-cell-7x7 ${clicked[index] ? "clicked" : ""}`}
            onClick={() => handleCellClick(index)}
            style={{ backgroundImage: `url(${image})` }}
          ></div>
        ))}
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginTop: "10px",
        }}
      >
        <button onClick={() => generateBingoCard(true)}>ビンゴを作る</button>
        <button onClick={toggleSettings} style={{ marginTop: "10px" }}>
          ビンゴのカスタマイズ
        </button>
      </div>
      {showSettings && (
        <SettingsModal
          isOpen={showSettings}
          onClose={toggleSettings}
          includeMiiCharacters={includeMiiCharacters}
          setIncludeMiiCharacters={setIncludeMiiCharacters}
          includeDashFighters={includeDashFighters}
          setIncludeDashFighters={setIncludeDashFighters}
          includeNewFighter={includeNewFighter}
          setIncludeNewFighter={setIncludeNewFighter}
          biasId={biasId}
          setBiasId={setBiasId}
        />
      )}
    </div>
  );
}

export default BingoCard3;
