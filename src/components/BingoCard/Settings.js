import React from "react";
import "./BingoCard.css"; // スタイルシートのパスが正しいことを確認

function Settings() {
  return (
    <div className="settings-container">
      <section aria-labelledby="rules-heading">
        <h2 id="rules-heading">チームビンゴのルール</h2>

        <h3>基本ルール</h3>
        <ol>
          <li>4～8人で遊びます。</li>
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

        <h3>ビンゴサイズ</h3>
        <p>メニューから3つのサイズを選べます。</p>
        <ol>
          <li>5×5（標準）：メインモード</li>
          <li>3×3：短時間・少人数向け</li>
          <li>7×7：大人数・長期戦向け</li>
        </ol>

        <h3>基本的な使い方</h3>
        <ol>
          <li>「ビンゴを作る」ボタンでカードを生成します。</li>
          <li>ビンゴのマスをクリックするとマスを開けることができます。</li>
          <li>
            チームメンバーを入力し「シャッフル」ボタンでチーム分けを自動化できます。シャッフル後もチーム欄を直接編集できます。任意のチーム構成にしたいときは「入力順に表示」ボタンを使ってください。
          </li>
        </ol>

        <h3>ビンゴの共有の仕方</h3>
        <ol>
          <li>
            「ビンゴを共有する」ボタンでURLをコピーできます。そのURLを参加者に送ると、同じビンゴカードが自動的に再現されます。
          </li>
          <li>Discordなどの画面共有でビンゴを共有できます。</li>
          <li>
            YouTubeやTwitchなどの配信プラットフォームも利用できます。その際、HELPページで配布しているチームビンゴ専用の配信レイアウトをご利用ください。
          </li>
        </ol>

        <h3>カスタマイズ</h3>
        <p>「ビンゴのカスタマイズ」ボタンで以下の設定ができます。</p>
        <ol>
          <li>Miiファイターをビンゴに含めるかを設定できます。</li>
          <li>
            ダッシュファイター（ダークサムス・デイジー・ブラックピット・リヒター）をビンゴに含めるかを設定できます。
          </li>
          <li>おまかせマスをビンゴに含めるかを設定できます。</li>
          <li>
            トッピングで特定カテゴリ（剣・飛び道具・パワー・高難度・シンプル）のファイターを出やすくできます。「おまかせ」を選ぶとランダムに選択されます。
          </li>
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
