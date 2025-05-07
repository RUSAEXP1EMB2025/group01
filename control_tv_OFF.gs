// テレビをオフにする関数
function turnOffTV() {
  const signalId = "あなたのテレビOFF用のSignal IDをここに記入"; // テレビのOFF信号のIDを設定
  const endpoint = "https://api.nature.global/1/signals/" + signalId + "/send";

  const options = {
    "method": "POST",
    "headers": {
      "Authorization": "Bearer " + REMO_ACCESS_TOKEN
    }
  };

  try {
    // APIリクエストを送信してテレビをオフ
    const response = UrlFetchApp.fetch(endpoint, options);
    Logger.log("テレビをオフにしました: " + response.getContentText());

    sendLineMessage("📴📴📴📴📴\nテレビがオフになりました\n📴📴📴📴📴"); // LINE通知を送信

    recordTVState(false); // テレビの状態を記録（任意関数）

  } catch (error) {
    Logger.log("テレビの制御に失敗しました: " + error.message);
  }
}
