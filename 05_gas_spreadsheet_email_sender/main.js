/**
 * スプレッドシート連携 営業メール自動送信ツール（GAS版）
 * 
 * 概要: スプレッドシート上のリストから会社名、担当者名、メールアドレスを抽出し、
 *      Gmailを介して自動送信します。
 * 特徴: 
 * - 環境構築不要。Googleアカウントのみで即座に運用可能。
 * - 1日の送信上限（無料版100件、Google Workspace 2,000件）を考慮した、
 *   少部数・高頻度のアプローチに適した設計。
 */

function sendSalesEmailsFromSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName("送信リスト");
  const data = sheet.getDataRange().getValues();
  
  // ヘッダー（1行目）を除いたデータ
  const rows = data.slice(1);
  
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const company = row[0];   // A列: 会社名
    const name = row[1];      // B列: 担当者名
    const email = row[2];     // C列: メールアドレス
    const status = row[3];    // D列: 送信ステータス
    
    // 未送信のものだけ処理
    if (status !== "済" && email) {
      const subject = `【ご提案】${company}様の業務効率化を支援する新サービスのご案内`;
      const body = `
${company}
${name} 様

突然のご連絡失礼いたします。
株式会社サンプル、営業部の〇〇です。

本日は、業界内で注目を集めている「業務自動化ツール」のご案内でご連絡いたしました。
貴社のさらなる発展に貢献できる内容かと存じます。

ご興味をお持ちいただけましたら、ぜひ一度オンラインにて詳細をご説明させていただけますでしょうか。
何卒よろしくお願い申し上げます。
      `;
      
      try {
        // GmailAppを使用して送信
        GmailApp.sendEmail(email, subject, body);
        
        // 送信完了ステータスを書き込み
        sheet.getRange(i + 2, 4).setValue("済");
        console.log(`送信成功: ${company} (${email})`);
        
        // GASの実行制限とサーバー負荷を考慮した短い待機
        Utilities.sleep(500);
        
      } catch (e) {
        console.error(`送信エラー: ${company} (${email}) - ${e.message}`);
      }
    }
  }
}
