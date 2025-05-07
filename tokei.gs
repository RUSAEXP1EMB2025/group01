function analyzeSensorTimes() {
  const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_NAME);
  const data = sheet.getDataRange().getValues();
  const hourCount = {};

  for (let i = 1; i < data.length; i++) {
    const timestamp = data[i][0];
    const flag = data[i][1];

    if (flag === 1 && timestamp) {
      const date = new Date(timestamp);
      const hour = date.getHours();

      hourCount[hour] = (hourCount[hour] || 0) + 1;
    }
  }

  return hourCount;
}

function getMaxHour(hourCount) {
  let maxHour = null;
  let maxCount = 0;

  for (const hour in hourCount) {
    if (hourCount[hour] > maxCount) {
      maxHour = hour;
      maxCount = hourCount[hour];
    }
  }

  return maxHour;
}

function replyToLine(replyToken, message) {
  const url = 'https://api.line.me/v2/bot/message/reply';
  const payload = {
    replyToken: replyToken,
    messages: [{ type: 'text', text: message }]
  };

  const options = {
    method: 'post',
    contentType: 'application/json',
    headers: {
      Authorization: `Bearer ${LINE_ACCESS_TOKEN}`
    },
    payload: JSON.stringify(payload)
  };

  UrlFetchApp.fetch(url, options);
}
