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
  const [members, setMembers] = useState(Array(8).fill(""));
  const [teams, setTeams] = useState([Array(4).fill(""), Array(4).fill("")]);

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
    <div className="team-division-container">
      <div className="team-layout">
        <div className="team-column">
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
        </div>

        <div className="team-column">
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
  );
}

export default TeamDivision;
