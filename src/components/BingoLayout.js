import React, { useState } from "react";
import "./TeamDivision/TeamDivision.css";

function fyShuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function getInitialCode(key) {
  return new URLSearchParams(window.location.search).get(key) || null;
}

function BingoLayout({ CardComponent }) {
  const [members, setMembers] = useState(Array(8).fill(""));
  const [teams, setTeams] = useState([Array(4).fill(""), Array(4).fill("")]);
  const initialRedCode = useState(() => getInitialCode("red"))[0];
  const initialBlueCode = useState(() => getInitialCode("blue"))[0];

  const handleCodeChange = (color, code) => {
    const params = new URLSearchParams(window.location.search);
    params.set(color, code);
    window.history.replaceState(null, "", `${window.location.pathname}?${params.toString()}`);
  };

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(window.location.href).then(
      () => alert("URLをコピーしました。相手に送ると同じカードが再現されます。"),
      () => alert("コピーに失敗しました。")
    );
  };

  const distribute = (pool) => {
    const t1 = Array(4).fill("");
    const t2 = Array(4).fill("");
    pool.forEach((name, idx) => {
      if (idx % 2 === 0) t1[Math.floor(idx / 2)] = name;
      else t2[Math.floor(idx / 2)] = name;
    });
    setTeams([t1, t2]);
  };

  const shuffleMembers = () => {
    distribute(fyShuffle(members.map((m) => m.trim()).filter(Boolean)));
  };

  const displayInOrder = () => {
    distribute(members.map((m) => m.trim()).filter(Boolean));
  };

  const handleMemberChange = (index, value) => {
    const next = [...members];
    next[index] = value;
    setMembers(next);
  };

  const handleTeamChange = (teamIdx, slotIdx, value) => {
    const next = teams.map((t) => [...t]);
    next[teamIdx][slotIdx] = value;
    setTeams(next);
  };

  const handleMemberKeyDown = (e, index) => {
    if (e.key === "Enter" && index < 7) {
      document.getElementById(`member-input-${index + 1}`)?.focus();
    }
  };

  return (
    <div className="bingo-layout">
      <div className="cards-with-teams">
        {/* 赤カード + 赤チーム */}
        <div className="card-col">
          <CardComponent
            color="red"
            initialCode={initialRedCode}
            onCodeChange={(code) => handleCodeChange("red", code)}
          />
          <div className="team-section">
            <h3 className="team-heading team-heading-red">赤チーム</h3>
            {teams[0].map((name, i) => (
              <input
                key={i}
                className="team-input team-input-red"
                value={name}
                onChange={(e) => handleTeamChange(0, i, e.target.value)}
                placeholder={`メンバー ${i + 1}`}
              />
            ))}
          </div>
        </div>

        {/* 青カード + 青チーム */}
        <div className="card-col">
          <CardComponent
            color="blue"
            initialCode={initialBlueCode}
            onCodeChange={(code) => handleCodeChange("blue", code)}
          />
          <div className="team-section">
            <h3 className="team-heading team-heading-blue">青チーム</h3>
            {teams[1].map((name, i) => (
              <input
                key={i}
                className="team-input team-input-blue"
                value={name}
                onChange={(e) => handleTeamChange(1, i, e.target.value)}
                placeholder={`メンバー ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* メンバー入力・ボタン */}
      <div className="member-section">
        <p className="member-section-label">メンバー入力</p>
        <div className="member-inputs">
          {members.map((m, i) => (
            <input
              key={i}
              id={`member-input-${i}`}
              className="member-input"
              value={m}
              onChange={(e) => handleMemberChange(i, e.target.value)}
              onKeyDown={(e) => handleMemberKeyDown(e, i)}
              placeholder={`名前 ${i + 1}`}
            />
          ))}
        </div>
        <div className="td-buttons-row">
          <button className="td-button" onClick={shuffleMembers}>
            シャッフル
          </button>
          <button className="td-button" onClick={displayInOrder}>
            入力順に表示
          </button>
        </div>
        <button className="td-button copy-url-button" onClick={handleCopyUrl}>
          🔗 ビンゴを共有する
        </button>
      </div>
    </div>
  );
}

export default BingoLayout;
