/**
 * X (Twitter) 自動投稿システム（公開用サンプル）
 * 
 * 概要: Google Spreadsheets に保存された投稿内容を、X API を介してランダムな時間帯に自動投稿します。
 * 機能:
 * - bot判定対策として、投稿末尾に不可視のランダム文字列（透明文字）を付与。
 * - 全投稿完了後、自動でリストの先頭から再開する永久ループ運用が可能。
 * - 時間ベースのトリガーにより、24時間365日の稼働を実現。
 */

// X API 認証情報（公開用のためダミー。実際はプロパティサービス等で管理）
const API_KEY = "YOUR_API_KEY";
const API_SECRET = "YOUR_API_SECRET";
const ACCESS_TOKEN = "YOUR_ACCESS_TOKEN";
const ACCESS_TOKEN_SECRET = "YOUR_ACCESS_TOKEN_SECRET";

/**
 * メインの投稿処理
 */
function postToX() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName("投稿リスト");
  const data = sheet.getDataRange().getValues();
  
  // ヘッダー（1行目）を除いた投稿データの取得
  const posts = data.slice(1);
  
  // 未投稿のものをフィルタリング（B列が '未' のもの）
  let pendingPosts = posts.filter(row => row[1] === "未");
  
  // 全て投稿済みの場合は、全てを '未' にリセットして再開（永久運用モード）
  if (pendingPosts.length === 0) {
    sheet.getRange(2, 2, posts.length, 1).setValue("未");
    pendingPosts = posts;
    console.log("全投稿が完了したため、リストをリセットしました。");
  }
  
  // ランダムに1件選択
  const randomIndex = Math.floor(Math.random() * pendingPosts.length);
  const targetPost = pendingPosts[randomIndex];
  const postContent = targetPost[0];
  const originalRowIndex = posts.indexOf(targetPost) + 2;

  // bot判定対策：不可視のランダム文字を付与 (Zero Width Spaces など)
  const invisibleChar = "\u200C"; // ゼロ幅非接合子
  const randomSuffix = Array(Math.floor(Math.random() * 5) + 1).fill(invisibleChar).join("");
  const finalTweet = postContent + randomSuffix;

  // X API へのリクエスト処理（OAuth1.0a）
  try {
    const response = sendTweet(finalTweet);
    if (response.getResponseCode() === 201) {
      // 投稿成功時にステータスを '済' に更新
      sheet.getRange(originalRowIndex, 2).setValue("済");
      console.log("投稿成功: " + postContent);
    }
  } catch (e) {
    console.error("投稿エラー: " + e.message);
  }
}

/**
 * X API (v2) を叩くための補助関数
 * ※実際には OAuth ライブラリが必要です。
 */
function sendTweet(text) {
  // ここに OAuth 認証と API リクエストのロジックが入ります。
  // ポートフォリオ用サンプルのため、構造のみ示しています。
  return { getResponseCode: () => 201 }; // ダミーの成功レスポンス
}
