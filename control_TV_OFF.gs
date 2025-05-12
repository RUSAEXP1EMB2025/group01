// テレビをオフにする関数
function turnOffTV() {
  const signalId = "＊＊＊＊＊"; // テレビのOFF信号のIDを設定
  const endpoint = "https://api.nature.global/1/signals/" + signalId + "/send";

  const options = {
    "method": "POST",
    "headers": {
      "Authorization": "Bearer " + REMO_ACCESS_TOKEN
    }
  };

  const sheet = getSheet('sensor')
  const lastSensorData = getLastData("sensor");
  const tvState = getLastValidValue(sheet, lastSensorData, 6);

  if(tvState === 0){
    sendLineMessage("テレビの電源はすでにオフです");
    return;
  }

  try {
    //APIリクエストを送信してテレビをオフ
    const response = UrlFetchApp.fetch(endpoint, options);
    Logger.log("テレビをオフにしました: " + response.getContentText());

    sendLineMessage("📴📴📴📴📴\nテレビがオフになりました\n📴📴📴📴📴"); // LINE通知を送信

    recordTVState(false); // テレビの状態を0として記録

  } catch (error) {
    Logger.log("テレビの制御に失敗しました: " + error.message);
  }
}
