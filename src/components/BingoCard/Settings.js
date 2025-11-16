import React from "react";
import "./BingoCard.css"; // スタイルシートのパスが正しいことを確認

function Settings() {
  return (
    <div className="settings-container">
      <section aria-labelledby="rules-heading">
        <h2 id="rules-heading">チームビンゴのルール</h2>

        <h3>基本ルール</h3>
        <ol>
          <li>4～6人で遊びます。</li>
          <li>
            各チーム1枚のビンゴカードを使います。チーム戦を行い、勝ったチームが使用したファイターのマスを開けます。
          </li>
          <li>ビンゴを先に2列達成したチームの勝ちです。</li>
        </ol>

        <h3>詳しいルール</h3>
        <ol>
          <li>ビンゴの真ん中のマスは最初に開けます。</li>
          <li>ファイター選択の際、メンバー間での相談は禁止です。</li>
          <li>チーム単位で連続して同じファイターを選ぶことはできません。</li>
        </ol>
      </section>

      <section aria-labelledby="howto-heading">
        <h2 id="howto-heading">チームビンゴツールの使い方</h2>

        <h3>基本的な使い方</h3>
        <ol>
          <li>ビンゴのマスをクリックするとマスを埋めることができます。</li>
          <li>
            チームメンバーを入力し「シャッフル」ボタンでチーム分けを自動化できます。任意のチーム構成にしたいときは「入力順に表示」ボタンを押してください。
          </li>
        </ol>

        <h3>ビンゴの共有の仕方</h3>
        <ol>
          <li>
            ビンゴコードで共有できます。1人が作成した2つのビンゴコードを参加者に共有し、それぞれがそのコードでビンゴをロードします。
          </li>
          <li>Discordなどの画面共有でビンゴを共有できます。</li>
          <li>
            YouTubeやTwitchなどの配信プラットフォームも利用できます。その際、HELPページで配布しているチームビンゴ専用の配信レイアウトをご利用ください。
          </li>
        </ol>

        <h3>オプション</h3>
        <p>・設定ボタンにビンゴのオプションが用意されています。</p>
        <ol>
          <li>Miiファイターをビンゴに表示するを設定できます。</li>
          <li>
            ダッシュファイター(ダークサムス、デイジー、ブラックピット、リヒター)をビンゴに表示するかを設定できます。
          </li>
          <li>おまかせマスをビンゴに表示できるかを設定できます。</li>
        </ol>
      </section>

      <section aria-labelledby="layout-heading">
        <h2 id="layout-heading">配信レイアウト</h2>
        <p>
          チームビンゴの配信用レイアウトを配布しています。下のボタンからダウンロードしてご自由にお使いください。
        </p>

        <h3>配信レイアウト　サンプル</h3>
        <figure className="image-container">
          <img
            src="/icon/sample.jpg"
            alt="チームビンゴ配信用レイアウトのサンプル画像"
            style={{ maxWidth: "100%", height: "auto" }}
            loading="lazy"
          />
          <figcaption
            style={{ marginTop: 8, fontSize: "0.95rem", opacity: 0.9 }}
          >
            配信時の画面構成イメージ
          </figcaption>
        </figure>

        <a
          href="/icon/stream_layout.jpg"
          download="TeamBingoStreamLayout.jpg"
          className="btn-download" // お使いのCSSでボタン風に
          style={{
            display: "inline-block",
            marginTop: 12,
            textDecoration: "none",
          }}
          aria-label="配信レイアウトをダウンロード（JPG）"
        >
          配信レイアウトをダウンロード
        </a>
      </section>
    </div>
  );
}

export default Settings;
