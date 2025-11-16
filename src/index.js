import React from 'react'; // Reactをインポート
import ReactDOM from 'react-dom'; // ReactDOMをインポート
import './index.css'; // アプリケーション全体のスタイルシートをインポート
import App from './components/App'; // Appコンポーネントをインポート

// Appコンポーネントをidが'root'のDOM要素にレンダリングする
ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
