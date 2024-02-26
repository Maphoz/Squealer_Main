export const mainColor = "#00B359";
export const greyColor = "#949494";
export const ImgCharCost = 125;
export const VideoCharCost = 300;
export const GeolocCharCost = 125;
export const temporizedTimeFramesString = {
  "1 minuto" : 60,
  "5 minuti" : 300,
  "30 minuti": 1800,
  "1 ora": 3600,
  "3 ore": 10800,
  "6 ore": 21600
}

export const formatTimeDifference = (dateObject) => {
  const timeDifference = new Date() - dateObject;

  // Calculate the time difference in minutes, hours, and days
  const minutes = Math.floor(timeDifference / (1000 * 60));
  const hours = Math.floor(timeDifference / (1000 * 60 * 60));
  const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));

  // Check the time difference and format accordingly
  if (minutes < 60) {
    return `${minutes}m fa`;
  } else if (hours < 24) {
    return `${hours}h fa`;
  } else if (days < 7) {
    return `${days}d fa`;
  } else {
    // Format the date as 'xxx dd'
    const monthAbbreviation = dateObject.toLocaleString('default', { month: 'short' }).slice(0, 3);
    const day = dateObject.getDate();
    return `${monthAbbreviation} ${day}`;
  }
}

export const getMin = (a,b,c) => {
  return Math.min(a,b,c);
}

export const getTarif = (userType) => {
  return userType == 'VIP' ? 0.2 : 0.5;
}