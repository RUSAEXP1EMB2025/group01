function getCurrentMonthData(sheet) {
  const currentMonth = ("0" + (new Date().getMonth() + 1)).slice(-2); // 現在の月（2桁）
  const lastRow = sheet.getLastRow(); // 最終行を取得
  let timeData = []; // 最大100件のデータを格納する配列
  let row = lastRow;

  while (row > 0) { // 100件まで取得
    let value = sheet.getRange(row, 1).getDisplayValue();
    if (value.length > 15) { // 日付時刻が格納されているなら（全部で19文字）
      let monthPart = value.slice(5, 7); // 月部分を取得

      if (monthPart === currentMonth) { // **現在の月と一致する場合のみ格納**
        timeData.push(value);

      } else {
        break; // 現在の月と異なるものを検知したらループを終了
      }
    }

    row--; // 次の行へ（上へ移動）
  }

  return timeData;
}


function getMostAmountOfHour(timeData) {
  let hourCounts = {}; // 各時間の出現回数をカウントするオブジェクト

  timeData.forEach(value => { // HH の出現回数をカウント
    let hour = value.slice(11, 13); // 時間部分を取得
    hourCounts[hour] = (hourCounts[hour] || 0) + 1; // 出現回数をカウント
  });

  // 最も多かった時間(HH)を特定
  let mostAmountOfHour = Object.keys(hourCounts).reduce((a, b) => hourCounts[a] > hourCounts[b] ? a : b);

  return mostAmountOfHour;
}


function sendHourData() {
  const sheet = getSheet("sensor");  
  const currentMonth = ("0" + (new Date().getMonth() + 1)).slice(-2); // 現在の月（2桁）
  const timeData = getCurrentMonthData(sheet); // **現在の月のデータを取得**

  if (timeData.length === 0) {
    sendLineMessage('今月... ' + currentMonth + '月 のデータはありません');
    return;
  }

  let hourData = timeData.map(value => value.slice(11, 13)); // 時間(HH)のリストを作成

  let mostAmountOfHour = getMostAmountOfHour(timeData); // 最も多かった時間を取得

  let message = currentMonth + '月の帰宅時間帯データ：\n' + hourData.join("\n") + '\n\n＊＊＊\n最も多かった帰宅時間帯：\n' + mostAmountOfHour + '時\n＊＊＊';

  sendLineMessage(message);
}
