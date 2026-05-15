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
  // ★ 追加：新キャラクターON/OFF
  includeNewFighter,
  setIncludeNewFighter,
  // ★ 追加
  biasId,
  setBiasId,
  biasIntensity,
  setBiasIntensity,
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

        {/* ★ 追加：Bias選択 */}
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

function BingoCard({ color, initialCode, onCodeChange }) {
  const [selectedImages, setSelectedImages] = useState([]);
  const [clicked, setClicked] = useState(Array(25).fill(false));
  const [includeMiiCharacters, setIncludeMiiCharacters] = useState(true);
  const [inputCode, setInputCode] = useState("");
  const [showSettings, setShowSettings] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [includeDashFighters, setIncludeDashFighters] = useState(false);
  const [includeNewFighter, setIncludeNewFighter] = useState(true);
  const [biasId, setBiasId] = useState("none");
  const [lastAppliedBias, setLastAppliedBias] = useState(null);

  useEffect(() => {
    if (initialCode) {
      const decodedImages = decodeState(initialCode);
      if (decodedImages.length > 0) {
        setSelectedImages(decodedImages);
        const next = Array(25).fill(false);
        next[12] = true;
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
      if (
        !window.confirm(
          "新しいビンゴカードを生成しますか？進行中のゲームはリセットされます。"
        )
      ) {
        return;
      }
    }

    // 1) プール作成
    let pool = [...images];

    // 2) 設定に応じてフィルタ
    if (!includeMiiCharacters) {
      pool = pool.filter(
        (img) =>
          ![
            imageMap.miifighter,
            imageMap.miigunner,
            imageMap.miiswordsman,
          ].includes(img)
      );
    }
    if (!includeDashFighters) {
      pool = pool.filter(
        (img) =>
          ![
            imageMap.daisy,
            imageMap.pitb,
            imageMap.samusd,
            imageMap.richter,
          ].includes(img)
      );
    }
    if (!includeNewFighter && NEW_FIGHTERS.length > 0) {
      pool = pool.filter((img) => !NEW_FIGHTERS.includes(img));
    }

    // 2) バイアスを決定（auto の場合は “なし以外” からランダム選択）
    let bias = BIASES.find((b) => b.id === biasId) ?? BIASES[0];
    if (bias.id === "auto") {
      const candidates = BIASES.filter(
        (b) => b.id !== "none" && b.id !== "auto"
      );
      bias = candidates[Math.floor(Math.random() * candidates.length)];
    }

    // 4) 重み付き・非復元で25枚抽出（poolが少なければある分だけ）
    const pick25 = sampleWithoutReplacementWeighted(
      pool,
      (img) => weightByTags(img, bias), // ← intensity 引数を削除
      25
    );

    // 5) 位置バイアスを消すために均等シャッフルしてから配置
    const arranged = fyShuffle(pick25);

    setSelectedImages(arranged);

    // 中央マスをデフォルトで選択
    const initialClicked = Array(25).fill(false);
    initialClicked[12] = true; // 5x5 中央
    setClicked(initialClicked);

    // 共有コードを更新
    const code = encodeState(arranged);
    onCodeChange?.(code);
    // 実際に適用したBiasを記録（UI表示用）
    setLastAppliedBias(bias);
    setIsInitialLoad(false);
  };

  const handleLoadDeck = () => {
    const decodedImages = decodeState(inputCode);
    if (decodedImages.length === 0) return;
    setSelectedImages(decodedImages);
    const next = Array(25).fill(false);
    next[12] = true;
    setClicked(next);
    onCodeChange?.(inputCode);
    setInputCode("");
  };

  const handleCellClick = (index) => {
    const newClicked = [...clicked];
    newClicked[index] = !newClicked[index];
    setClicked(newClicked);
  };

  const toggleSettings = () => {
    setShowSettings(!showSettings);
  };

  const reshuffleLayout = () => {
    // 並びだけ入れ替える
    const reshuffled = fyShuffle(selectedImages);
    setSelectedImages(reshuffled);

    // マスのON/OFFは初期化（中央だけON）
    const nextClicked = Array(25).fill(false);
    nextClicked[12] = true;
    setClicked(nextClicked);

    // roomCodeは更新しない
    // → こうすることで「保存したコードは固定」「並びは遊ぶたびシャッフル」という状態になる
  };

  return (
    <div className="bingo-container" style={{ borderColor: color }}>
      <div
        style={{
          textAlign: "center",
          marginTop: 6,
          fontSize: 18,
          color: "#EA3D25",
        }}
      >
        トッピング（現在）:{" "}
        {lastAppliedBias?.name ??
          (BIASES.find((b) => b.id === biasId)?.name || "なし")}
      </div>

      <div style={{ position: "relative", display: "inline-block" }}>
        <div className={`bingo-card ${color}`}>
          {selectedImages.map((image, index) => (
            <div
              key={index}
              className={`bingo-cell ${clicked[index] ? "clicked" : ""}`}
              onClick={() => handleCellClick(index)}
              style={{ backgroundImage: `url(${image})` }}
            />
          ))}
        </div>
        <button
          onClick={reshuffleLayout}
          title="並べ替え"
          style={{
            position: "absolute",
            bottom: "4px",
            right: "4px",
            padding: "4px 8px",
            fontSize: "12px",
            background: "#5c5c5c",
            border: "none",
            color: "#ccc",
            borderRadius: "4px",
            cursor: "pointer",
            marginTop: "0",
            lineHeight: 1,
          }}
        >
          🔁 並べ替え
        </button>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginTop: "10px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <button onClick={() => generateBingoCard(true)}>ビンゴを作る</button>
        </div>

        <button onClick={toggleSettings} style={{ marginTop: "10px" }}>
          ビンゴのカスタマイズ
        </button>
        <div style={{ display: "flex", gap: "6px", marginTop: "10px" }}>
          <input
            type="text"
            value={inputCode}
            onChange={(e) => setInputCode(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLoadDeck()}
            placeholder="デッキコードを入力"
            style={{ padding: "6px 8px", borderRadius: "4px", border: "1px solid #666", background: "#4a4a4a", color: "#eaeaea", fontSize: "13px", width: "160px" }}
          />
          <button
            onClick={handleLoadDeck}
            style={{ marginTop: "0", padding: "6px 10px", fontSize: "13px" }}
          >
            ロード
          </button>
        </div>
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
          // ★ 追加
          biasId={biasId}
          setBiasId={setBiasId}
        />
      )}
    </div>
  );
}

export default BingoCard;
