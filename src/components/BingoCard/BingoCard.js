import React, { useState, useEffect } from "react";
import "./BingoCard.css";
import images, { imageMap } from "../common/images";

import { encodeState, decodeState, fyShuffle } from "../common/shareCode";

const TRAITS = new Map([
  [imageMap.buddy, ["projectile"]],
  [imageMap.koopajr, ["difficult"]],
  [imageMap.daisy, ["difficult"]],
  [imageMap.bayonetta, ["difficult"]],
  [imageMap.brave, ["sword"]],
  [imageMap.captain, ["power"]],
  [imageMap.chrom, ["sword"]],
  [imageMap.cloud, ["sword"], ["simple"]],
  [imageMap.dedede, ["power"]],
  [imageMap.demon, ["power"]],
  [imageMap.diddy, ["difficult"]],
  [imageMap.dolly, ["power"]],
  [imageMap.donkey, ["power"], ["simple"]],
  [imageMap.duckhunt, ["projectile"], ["difficult"]],
  [imageMap.edge, ["sword"]],
  [imageMap.eflame, ["sword"], ["power"]],
  [imageMap.falco, ["simple"]],
  [imageMap.fox, ["difficult"]],
  [imageMap.gamewatch, ["difficult"]],
  [imageMap.ganon, ["power"], ["simple"]],
  [imageMap.gaogaen, ["power"]],
  [imageMap.gekkouga, ["difficult"]],
  [imageMap.ice_climber, ["difficult"]],
  [imageMap.ike, ["sword"], ["power"]],
  [imageMap.inkling, ["difficult"]],
  [imageMap.jack, ["diffcult"]],
  [imageMap.kamui, ["sword"]],
  [imageMap.ken, ["difficult"]],
  [imageMap.kirby, ["power"], ["simple"]],
  [imageMap.koopa, ["power"], ["simple"]],
  [imageMap.krool, ["power"]],
  [imageMap.link, ["sword"]],
  [imageMap.littlemac, ["power"]],
  [imageMap.lucario, ["projectile"]],
  [imageMap.lucas, ["projectile"], ["difficult"]],
  [imageMap.lucina, ["sword"], ["simple"]],
  [imageMap.luigi, ["difficult"]],
  [imageMap.mario, ["simple"]],
  [imageMap.mariod, ["power"]],
  [imageMap.marth, ["sword"], ["difficult"]],
  [imageMap.master, ["sword"]],
  [imageMap.metaknight, ["sword"], ["difficult"]],
  [imageMap.mewtwo, ["projectile"]],
  [imageMap.miifighter, ["difficult"]],
  [imageMap.miigunner, ["projectile"]],
  [imageMap.miiswordsman, ["sword"]],
  [imageMap.murabito, ["projectile"], ["difficult"]],
  [imageMap.ness, ["simple"]],
  [imageMap.packun, ["difficult"]],
  [imageMap.pacman, ["projectile"], ["difficult"]],
  [imageMap.palutena, ["simple"]],
  [imageMap.peach, ["difficult"]],
  [imageMap.pichu, ["difficult"]],
  [imageMap.pickel, ["difficult"]],
  [imageMap.pikachu, ["difficult"]],
  [imageMap.pikmin, ["projectile"]],
  [imageMap.pit, ["sword"], ["simple"]],
  [imageMap.pitb, ["sword"], ["simple"]],
  [imageMap.ptrainer, ["power"]],
  [imageMap.purin, ["difficult"]],
  [imageMap.reflet, ["sword"], ["projectile"]],
  [imageMap.richter, ["projectile"], ["difficult"]],
  [imageMap.ridley, ["sword"], ["power"]],
  [imageMap.robot, ["projectile"]],
  [imageMap.rockman, ["projectile"], ["difficult"]],
  [imageMap.rosetta, ["difficult"]],
  [imageMap.roy, ["sword"], ["power"]],
  [imageMap.ryu, ["difficult"]],
  [imageMap.samus, ["projectile"]],
  [imageMap.samusd, ["projectile"]],
  [imageMap.sheik, ["difficult"]],
  [imageMap.shizue, ["projectile"]],
  [imageMap.shulk, ["sword"]],
  [imageMap.simon, ["projectile"], ["difficult"]],
  [imageMap.snake, ["projectile"]],
  [imageMap.sonic, ["difficult"]],
  [imageMap.szerosuit, ["difficult"]],
  [imageMap.tantan, ["difficult"]],
  [imageMap.toonlink, ["sword"]],
  [imageMap.trail, ["sword"]],
  [imageMap.wario, ["difficult"]],
  [imageMap.wiifit, ["projectile"], ["difficult"]],
  [imageMap.wolf, ["simple"]],
  [imageMap.yoshi, ["simple"], ["power"]],
  [imageMap.younglink, ["sword"], ["projectile"]],
  [imageMap.zelda, ["power"]],
  [imageMap.random, ["difficult"]],
]);

// 出やすくするテーマ
const BIASES = [
  { id: "none", name: "なし", wanted: [] },
  { id: "sword", name: "剣キャラ増し", wanted: ["sword"] },
  { id: "projectile", name: "飛び道具増し", wanted: ["projectile"] },
  { id: "power", name: "パワー増し", wanted: ["power"] },
  { id: "difficult", name: "高難度増し", wanted: ["difficult"] },
  { id: "simple", name: "シンプル増し", wanted: ["simple"] },
  { id: "auto", name: "おまかせ（ランダム増し）", wanted: [] },
];

const NEW_FIGHTERS = [imageMap.random]; // 必要に応じて他も足せる

function weightByTags(img, bias) {
  if (!bias || bias.id === "none" || !bias.wanted || bias.wanted.length === 0)
    return 1;
  const traits = TRAITS.get(img) ?? [];
  const matches = traits.filter((t) => bias.wanted.includes(t)).length;
  // 一致していれば1.5倍、そうでなければ1倍
  return matches > 0 ? 30.0 : 1;
}
// --- 重み付き・非復元サンプリング（ルーレット選択で1枚ずつ引く） ---
function sampleWithoutReplacementWeighted(items, getWeight, k) {
  const pool = items.slice();
  const picked = [];
  for (let i = 0; i < k && pool.length > 0; i++) {
    const weights = pool.map(getWeight);
    let sum = 0;
    for (const w of weights) sum += w;

    if (sum <= 0) {
      picked.push(pool.splice(Math.floor(Math.random() * pool.length), 1)[0]);
      continue;
    }
    let r = Math.random() * sum;
    let idx = 0;
    for (let j = 0; j < pool.length; j++) {
      r -= weights[j];
      if (r <= 0) {
        idx = j;
        break;
      }
    }
    picked.push(pool.splice(idx, 1)[0]);
  }
  return picked;
}

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

function BingoCard({ color }) {
  const [selectedImages, setSelectedImages] = useState([]);
  const [clicked, setClicked] = useState(Array(25).fill(false));
  const [includeMiiCharacters, setIncludeMiiCharacters] = useState(true);
  const [roomCode, setRoomCode] = useState("");
  const [inputCode, setInputCode] = useState("");
  const [showSettings, setShowSettings] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [includeDashFighters, setIncludeDashFighters] = useState(true);
  const [includeNewFighter, setIncludeNewFighter] = useState(true);
  const [biasId, setBiasId] = useState("none"); // 単一選択
  const [lastAppliedBias, setLastAppliedBias] = useState(null); // 実際に使われたBias（おまかせ解決後）

  useEffect(() => {
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
    setRoomCode(encodeState(arranged));
    // 実際に適用したBiasを記録（UI表示用）
    setLastAppliedBias(bias);
    setIsInitialLoad(false);
  };

  const handleLoadBingo = () => {
    const decodedImages = decodeState(inputCode);
    setSelectedImages(decodedImages);

    // ロード時も中央ON（仕様に合わせる場合）
    const next = Array(25).fill(false);
    next[12] = true;
    setClicked(next);
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
      <h3 style={{ textAlign: "center" }}>
        {color === "red" ? "赤チームのビンゴコード" : "青チームのビンゴコード"}
      </h3>

      <div
        style={{ display: "flex", justifyContent: "center", margin: "10px 0" }}
        className="bingo-code-display"
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
        className="bingo-code-input"
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

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginTop: "10px",
        }}
      >
        {/* 新しく追加：並び替えボタン */}
        <button onClick={reshuffleLayout} style={{ marginBottom: "10px" }}>
          ならべかえ 🔁
        </button>

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
          // ★ 追加
          biasId={biasId}
          setBiasId={setBiasId}
        />
      )}
    </div>
  );
}

export default BingoCard;
