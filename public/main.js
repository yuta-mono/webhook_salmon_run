// @ref スプラAPI https://spla3.yuu26.com/
// ※embedのカラーコードでエラーが発生しやすいので注意

// サーモンランのスケジュール取得APIのURL
const scheduleUrl = "https://spla3.yuu26.com/api/coop-grouping/schedule";
// 次のスケジュールのみ取得するURL
const nextUrl = "https://spla3.yuu26.com/api/coop-grouping/next";
// GoogleDriveURL
const driveUrl = "http://drive.google.com/uc?export=view&id=";

// 環境変数からWebhookのURLとUserAgentを取得
const discordWebhookUrl = PropertiesService.getScriptProperties().getProperty('discordWebhookUrl');
const userAgent = PropertiesService.getScriptProperties().getProperty('userAgent');

// 表示するシフト数(1~5)
const shiftCount = 5;

// アイコンセット
const objUser = {
  "name" : "クマサン商会",
  "fileID" : "1hOQ7Uv6tbtmjJbAex_M4Kiqypd8a9PZl",
};
const objBigRun = {
  "name" : "ビッグラン！！！",
  "fileID" : "1L3aiSa4bpE6Y8hIPqkYTacFKnd7OAm02",
};
const objBosses = {
  "ヨコヅナ" : {
    "fileID" : "1V_HqfPc4trhKq61qXVMY8OjSHnkU4qeS",
  },
  "タツ" : {
    "fileID" : "1Ktk1Ae5zq7m7rq8KF5ZTWMk3LD31aFca",
  },
  "ジョー" : {
    "fileID" : "137CkCOR_khOaOce3JXQVJhh41S9mOclA",
  },
  "オカシラ連合" : {
    "fileID" : "1v4PLCsp8RzouR4ChTF0Q-9z18Rc3Ahf5",
  },
};

// 定時にトリガーをセットする処理
// 本スクリプトは1日おきに実行する想定
function setTrigger()
{
  // 次回シフトのトリガーが生成済かチェック
  const triggers = ScriptApp.getProjectTriggers();
  let functionName = null;
  for (let i = 0; i < triggers.length; i++) {
    functionName = triggers[i].getHandlerFunction();
    if (functionName === 'main') {
      console.log("既にトリガーが存在するためreturnしました。");
      return;
    }
  }

  // 次回シフトのトリガーがなければトリガーを生成する
  const next = (getSchedule(nextUrl))[0];
  const time = new Date(next.start_time);
  // スケジュール更新直後だと４つ先のシフトを取得できないので少しズラす
  time.setMinutes(time.getMinutes() + 3);
  console.log("トリガーセット：" + time.toString());
  ScriptApp.newTrigger('main').timeBased().at(time).create();
}

// main関数のトリガーを削除
function deleteMainTrigger()
{
  const triggers = ScriptApp.getProjectTriggers();

  for (var i = 0; i < triggers.length; i++) {
    if (triggers[i].getHandlerFunction() === 'main') {
      ScriptApp.deleteTrigger(triggers[i]);
    }
  }
}

// スクリプトの実行開始点
function main()
{
  var lock = LockService.getScriptLock();
  try {
    // ロックを取得しようとする。10秒でタイムアウトを設定。
    if (lock.tryLock(10000)) {
      console.log('スクリプトをロック中です。');

      // 投稿
      postSchedule();

      // main関数のトリガーを削除
      deleteMainTrigger();
    } else {
      console.log('スクリプトは既に実行中です。');
    }
  } catch (e) {
    console.error('エラーが発生しました: ' + e.message);
  } finally {
    // ロックを解放する
    lock.releaseLock();
    console.log('スクリプトをロックを解除しました。');
  }
}

// スケジュール取得処理
function getSchedule(url = scheduleUrl)
{
  const options = {
    'method': 'get',
    'headers': {
      'user-agent': userAgent,
    },
  }

  const response = UrlFetchApp.fetch(url, options);
  if (response.getResponseCode() !== 200) {
    console.log('ResponseCode：' + response.getResponseCode());
    return null;
  }
  const json = response.getContentText();
  return (JSON.parse(json)).results;
}

// 投稿処理
function postSchedule()
{
  // スケジュール取得処理
  const schedules = getSchedule();
  if (schedules === null) {
    return;
  }

  const color = 0xEE7800;
  const colorBigRun = 0xFFD700;
  const templateMessage = {
    "username": objUser.name,
    "avatar_url": driveUrl + objUser.fileID,
    "embeds": [],
  };
  const templateEmbed = {
    "title": null,
    "description": null,
    "thumbnail": {
      "url": null
    },
    "fields": [],
  };

  // メッセージ生成・投稿
  const limit = schedules.length < shiftCount ? schedules.length : shiftCount;
  const message = JSON.parse(JSON.stringify(templateMessage));
  let schedule;
  let embed;
  // シフトごとにembedを生成
  for (let i = 0; i < limit; i++) {
    schedule = schedules[i];
    embed = JSON.parse(JSON.stringify(templateEmbed));
    // 現在のシフトのみ色をつける
    if (i == 0) {
      embed.color = color;
    }
    // 開催日時 例：03/23(日)09:00 ~ 03/25(火)01:00"
    embed.title = createTimeShift(schedule.start_time, schedule.end_time);
    // ステージ＆オカシラ情報
    embed.author = {
      "name": schedule.stage.name + "\n" + schedule.boss.name,
      "icon_url": driveUrl + objBosses[schedule.boss.name].fileID,
    };
    embed.thumbnail = {
      "url": schedule.stage.image,
    };
    // ブキ編成
    schedule.weapons.forEach(weapon => {
      embed.fields.push({
        "name" : weapon.name,
        "value" : "",
        "inline" : false,
      });
    });

    // ビッグランの場合、authorと色をビッグラン仕様に変更
    if (schedule.is_big_run) {
      embed.color = colorBigRun;
      embed.author = {
        "name": objBigRun.name + "\n" + schedule.stage.name + "\n" + schedule.boss.name,
        "icon_url": driveUrl + objBigRun.fileID
      };
    }

    message.embeds.push(embed);
  }

  postToDiscord(message);
}

// 時間帯を取得
function createTimeShift(startTime, endTime)
{
  let format = "MM/DD(dd)HH:mm";
  return formatDate(startTime, format) + " ~ " + formatDate(endTime, format);
}

// 日付をフォーマットする関数
function formatDate(dateString, format = 'YYYY-MM-DDTHH:mm:ss')
{
  // 曜日表示のためにlocaleを変更
  dayjs.dayjs.locale('ja');
  // 日付文字列の有効性をチェック
  if (!dateString) {
    console.error(`無効な日付 "${dateString}" がformatDate関数に渡されました。`);
    return null; // 無効な入力に対してはnullを返す
  }

  // dayjsを使用して日付をフォーマット
  const formattedDate = dayjs.dayjs(dateString);
  if (!formattedDate.isValid()) {
    console.error(`無効な日付文字列 "${dateString}" がformatDate関数に渡されました。`);
    return null; // 無効な日付に対してはnullを返す
  }

  return formattedDate.format(format);
}

// Discordにメッセージを投稿する関数
function postToDiscord(message)
{
  const type = 'application/json';

  const options = {
    'method' : 'post',
    'contentType': type,
    'payload': JSON.stringify(message),
  }
  try {
    UrlFetchApp.fetch(discordWebhookUrl, options);
  } catch(e) {
    console.error(`エラーが発生しました - 関数名: ${e.functionName}, エラーメッセージ: ${e.message}`);
  }
}
