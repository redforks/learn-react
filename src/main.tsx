import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

// biome-ignore lint/style/noNonNullAssertion: 这里的 root 元素在 index.html 中静态存在，确定非空
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
