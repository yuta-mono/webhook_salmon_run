# 開発環境メモ
## 前提機能
- npm
- yarn

## Clasp環境構築
WEBエディタ上で実装は大変だったのでローカル環境でコーディングできるようにclaspを導入しました。\
参考：https://qiita.com/HeRo/items/4e65dcc82783b2766c03

### 手順
- Google Apps Script API を有効にする。\
https://script.google.com/home/usersettings にアクセスして、「オン」にする。

- Claspをインストール\
`npm i @google/clasp -g`

- 設定ファイル生成\
`cp .clasp.json.example .clasp.json`\
→scriptIdに対象となるGASのIDを入力

- Claspログイン\
`clasp login`\
※GoogleDriveの権限等諸々許可する

# コマンド
- GASからソースを取得：`npm run pull`
- GASへソースを反映：`npm run push`
- GASのWebページを開く：`npm run open`

※`package.json`に定義しています。

## デプロイ先の切替
`.clasp.json.dev`と`.clasp.json.prod`を用意することで開発用と本番用で切り替えてデプロイできます。

- 対象のGASをテスト用に切替：`npm run dev`
- 対象のGASを本番用に切替：`npm run prod`
