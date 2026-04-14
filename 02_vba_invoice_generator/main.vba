' ==========================================================
' VBA 自動請求書発行ツール（公開用サンプル）
' 
' 概要: 請求データ一覧から各社ごとの請求書を自動生成し、PDFとして保存します。
' 効果: 1社あたり5分かかっていた作業を、マクロ実行により一瞬（数秒）で完了。
' ==========================================================

Sub ExportInvoicesToPDF()
    Dim wsData As Worksheet
    Dim wsTemplate As Worksheet
    Dim lastRow As Long
    Dim i As Long
    Dim companyName As String
    Dim fileName As String
    Dim savePath As String
    
    ' シートの設定（実運用に合わせてシート名を変更してください）
    Set wsData = ThisWorkbook.Sheets("請求データ一覧")
    Set wsTemplate = ThisWorkbook.Sheets("請求書テンプレート")
    
    ' 保存先のパス（このExcelファイルと同じフォルダ内の "PDF出力" フォルダ）
    savePath = ThisWorkbook.Path & "\PDF出力\"
    
    ' 保存先フォルダがない場合は作成
    If Dir(savePath, vbDirectory) = "" Then
        MkDir savePath
    End If
    
    ' データの最終行を取得
    lastRow = wsData.Cells(wsData.Rows.Count, "A").End(xlUp).Row
    
    ' データ一覧をループ処理
    For i = 2 To lastRow ' 1行目がヘッダーの想定
        ' テンプレートにデータを転記（例：A列が会社名、B列が金額など）
        companyName = wsData.Cells(i, 1).Value
        wsTemplate.Range("B5").Value = companyName ' 宛先
        wsTemplate.Range("F10").Value = wsData.Cells(i, 2).Value ' 金額
        ' ... 他の項目も同様に転記
        
        ' PDFとして出力
        fileName = savePath & companyName & "_請求書_" & Format(Date, "yyyymmdd") & ".pdf"
        
        wsTemplate.ExportAsFixedFormat Type:=xlTypePDF, _
            Filename:=fileName, _
            Quality:=xlQualityStandard, _
            IncludeDocProperties:=True, _
            IgnorePrintAreas:=False, _
            OpenAfterPublish:=False
            
        Debug.Print companyName & " 様の請求書を発行しました。"
    Next i
    
    MsgBox "すべての請求書のPDF発行が完了しました。", vbInformation
End Sub
