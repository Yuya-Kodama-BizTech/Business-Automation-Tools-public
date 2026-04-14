/**
 * Discord × GAS 社内報告活性化 Bot（公開用サンプル）
 * 
 * 概要: Discord Webhook と GAS の時間指定トリガーを連携させ、
 *      朝の予定宣言と夜の成果報告を自動リマインド。
 *      社員の意識づけと管理者のコミュニケーションコスト削減を目的としています。
 */

// Discord Webhook URL（実際は環境変数やプロパティサービスで管理）
const DISCORD_WEBHOOK_URL = "YOUR_DISCORD_WEBHOOK_URL";

/**
 * 朝のリマインド：本日の予定宣言を促す
 */
function sendMorningReminder() {
  const message = {
    "content": "☀️ **【朝の予定宣言】**\n皆さま、おはようございます！\n本日の主なタスクと目標をこちらに宣言しましょう。\n（例：14:00〜 A社商談、資料作成完了 など）",
    "username": "タスク管理Bot",
    "avatar_url": "https://example.com/icon_morning.png"
  };
  
  postToDiscord(message);
}

/**
 * 夜のリマインド：本日の成果報告を促す
 */
function sendEveningReminder() {
  const message = {
    "content": "🌙 **【終業の成果報告】**\n本日もお疲れ様でした！\n本日の成果と、翌日に持ち越すタスクがあれば報告をお願いします。\n良好なチームコミュニケーションを築きましょう！",
    "username": "タスク管理Bot",
    "avatar_url": "https://example.com/icon_evening.png"
  };
  
  postToDiscord(message);
}

/**
 * Discord Webhook へのデータ送信
 */
function postToDiscord(payload) {
  const options = {
    "method": "post",
    "contentType": "application/json",
    "payload": JSON.stringify(payload)
  };
  
  try {
    UrlFetchApp.fetch(DISCORD_WEBHOOK_URL, options);
    console.log("Discordへの通知が完了しました。");
  } catch (e) {
    console.error("Discord送信エラー: " + e.message);
  }
}

/**
 * スプレッドシートへの記録用（任意機能）
 */
function logToSheet(user, content) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName("報告ログ");
  sheet.appendRow([new Date(), user, content]);
}
