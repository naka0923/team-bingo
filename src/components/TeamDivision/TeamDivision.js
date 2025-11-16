import React, { useState } from "react";
import "./TeamDivision.css";

function fyShuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function TeamDivision() {
  const [members, setMembers] = useState(["", "", "", "", "", ""]);
  const [teams, setTeams] = useState([[], []]);

  const normalizedMembers = () => members.map((m) => m.trim()).filter(Boolean); // 空欄や空白だけを除外

  const shuffleMembers = () => {
    const pool = fyShuffle(normalizedMembers());
    const t1 = [];
    const t2 = [];
    pool.forEach((name, idx) => {
      (idx % 2 === 0 ? t1 : t2).push(name);
    });
    setTeams([t1, t2]);
  };

  const displayInOrder = () => {
    const ordered = normalizedMembers();
    const t1 = [];
    const t2 = [];
    ordered.forEach((name, idx) => {
      (idx % 2 === 0 ? t1 : t2).push(name);
    });
    setTeams([t1, t2]);
  };

  const handleInputChange = (index, value) => {
    const newMembers = [...members];
    newMembers[index] = value;
    setMembers(newMembers);
  };

  return (
    <div className="team-division-container">
      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          margin: "20px 0",
        }}
      >
        <div>
          <h3>赤チーム</h3>
          {teams[0].map((member, index) => (
            <p key={index}>{member}</p>
          ))}
        </div>
        <div>
          <h3>青チーム</h3>
          {teams[1].map((member, index) => (
            <p key={index}>{member}</p>
          ))}
        </div>
      </div>
      {/* 入力欄（UIはそのまま） */}
      <div>
        {members.map((member, index) => (
          <input
            key={index}
            type="text"
            value={member}
            onChange={(e) => handleInputChange(index, e.target.value)}
            placeholder={`メンバー ${index + 1}`}
          />
        ))}
      </div>
      {/* ボタン（UIもそのまま） */}
      <div style={{ marginTop: "10px" }}>
        <button onClick={shuffleMembers}>シャッフル</button>
        <button onClick={displayInOrder}>入力順に表示</button>
      </div>
    </div>
  );
}

export default TeamDivision;
