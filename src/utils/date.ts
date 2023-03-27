const timezoneCitys: Record<string, string> = {
  UTC: "Europe/London",
  "UTC-0": "Europe/London",
  "UTC-1": "Europe/London",
  "UTC-2": "America/Sao_Paulo",
  "UTC-3": "America/Argentina/Buenos_Aires",
  "UTC-4": "America/Caracas",
  "UTC-5": "America/New_York",
  "UTC-6": "America/Chicago",
  "UTC-7": "America/Phoenix",
  "UTC-8": "America/Los_Angeles",
  "UTC-9": "America/Juneau",
  "UTC-10": "Pacific/Honolulu",
  "UTC+1": "Europe/Paris",
  "UTC+2": "Africa/Cairo",
  "UTC+3": "Europe/Moscow",
  "UTC+4": "Asia/Dubai",
  "UTC+5": "Asia/Ashkhabad",
  "UTC+6": "Asia/Almaty",
  "UTC+7": "Asia/Bangkok",
  "UTC+8": "Asia/Shanghai",
  "UTC+9": "Asia/Tokyo",
  "UTC+10": "Australia/Brisbane",
  "UTC+11": "Australia/Sydney",
  "UTC+13": "Pacific/Auckland",
};

export function getTimeZoneCity() {
  let chartOption: any = localStorage.getItem("tradingview.chartOption");

  if (chartOption) {
    chartOption = JSON.parse(chartOption);
    if (chartOption && chartOption["timezone"]) {
      return chartOption["timezone"];
    }
  }
  let offset: string | number = (-1 * new Date().getTimezoneOffset()) / 60;
  offset = "UTC" + (offset >= 0 ? "+" + offset : offset);
  return timezoneCitys[offset] || timezoneCitys["UTC"];
}
