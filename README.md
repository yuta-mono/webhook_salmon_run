# 概要
サーモンランのシフト情報を定期的に投稿するDiscord Webhook用APIです。\
GAS(GoogleAppsScript)上で動作します。

<img src="docs/image.png" width="200">

# 使い方
## Discord Webhookの設定
1. Discordから投稿したいチャンネルを開きます。
1. 「サーバー設定」→「連携サービス」→「ウェブフック」を選択します。
1. 「新しいウェブフック」をクリックします。
1. ウェブフックが作られるので、任意の名前と通知先チャンネルを設定後、「ウェブフックURLをコピー」をクリックします。\
※コピーしたURLはGASの設定にて利用します。

## GASの設定
### プロジェクトの作成
1. [Apps Script](https://script.google.com/home)にアクセスします。
1. 「新しいプロジェクト」をクリックします。
1. エディタ画面が開くので、[main.js](public/main.js)の内容をコピーして貼り付けます。
1. dayjsライブラリを追加\
「ライブラリ」クリック→以下のライブラリIDを入力します。\
`1ShsRhHc8tgPy5wGOzUvgEhOedJUQD53m-gd8lG2MOgs-dXC_aCZn9lFB`
1. 環境変数（プロパティ）を設定\
「プロジェクトの設定」を開き、画面下部の「スクリプト プロパティ」欄に以下を追加します。\
    - プロパティ名：`discordWebhookUrl`　値：（Webhookの設定でコピーしたURL）
    - プロパティ名：`userAgent`　値：（自分の連絡先）※例：`discordWebhook(X@user_name)`

### トリガーの設定
1. 「トリガー」を開き、「トリガーを追加」をクリックします。
2. 「実行する関数」で`setTrigger`を選択します。
3. 「時間主導型」/「日付ベースのタイマー」/「午前0時～1時」に設定します。\
※1日1回実行できれば良いので時間帯はいつでもOK

## 動作確認方法
スクリプトエディタ画面で`main`関数を選択して「実行」をクリックします。

# 補足
## サーモンランのスケジュールについて
https://spla3.yuu26.com/ を使わせてもらってます。\
大量に実行しないよう注意しましょう。

## アイコン画像について
作成者のGoogleDriveに保存しています。\
急に使えなくなるかもしれませんのでご留意ください。

## ブキ編成の画像について
未実装\
いずれ実装するかもしれません。
