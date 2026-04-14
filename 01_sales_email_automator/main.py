import pandas as pd
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import time

# --- 設定情報（公開用サンプルのため、実際の設定は環境変数等で行うことを推奨） ---
# GmailのSMTPサーバー設定
SMTP_SERVER = "smtp.gmail.com"
SMTP_PORT = 587
# ※注意：実際の運用では「アプリパスワード」の生成と、安全な管理が必要です。
SENDER_EMAIL = "your-email@example.com"
SENDER_PASSWORD = "your-app-password"

def send_sales_emails(excel_file):
    """
    Excelリストから顧客情報を読み込み、パーソナライズされたメールを一括送信します。
    """
    try:
        # Excelファイルの読み込み（例：'会社名', '担当者名', 'メールアドレス' の列がある想定）
        df = pd.read_excel(excel_file)
        
        # SMTPサーバーへの接続
        server = smtplib.SMTP(SMTP_SERVER, SMTP_PORT)
        server.starttls()
        server.login(SENDER_EMAIL, SENDER_PASSWORD)

        for index, row in df.iterrows():
            company = row['会社名']
            name = row['担当者名']
            to_email = row['メールアドレス']

            # メールの作成
            subject = f"【ご提案】{company}様の業務効率化を支援する新サービスのご案内"
            body = f"""
{company}
{name} 様

突然のご連絡失礼いたします。
株式会社サンプル、営業部の〇〇です。

本日は、業界内で注目を集めている「業務自動化ツール」のご案内でご連絡いたしました。
貴社のさらなる発展に貢献できる内容かと存じます。

ご興味をお持ちいただけましたら、ぜひ一度オンラインにて詳細をご説明させていただけますでしょうか。
何卒よろしくお願い申し上げます。
            """

            msg = MIMEMultipart()
            msg['From'] = SENDER_EMAIL
            msg['To'] = to_email
            msg['Subject'] = subject
            msg.attach(MIMEText(body, 'plain'))

            # メールの送信
            server.send_message(msg)
            print(f"送信完了: {company} {name} 様 ({to_email})")

            # サーバー負荷軽減のための待機（1秒）
            time.sleep(1)

        server.quit()
        print("\nすべてのメール送信プロセスが正常に完了しました。")

    except Exception as e:
        print(f"エラーが発生しました: {e}")

if __name__ == "__main__":
    # 実行前に、同一フォルダに 'target_list.xlsx' が存在することを確認してください。
    # send_sales_emails('target_list.xlsx')
    print("これは公開用サンプルコードです。実行するには適切な設定とExcelファイルが必要です。")
