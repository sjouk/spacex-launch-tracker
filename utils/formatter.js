export const formatData = (weather, isMetric) => {
	return weather.sol_keys.map((solKey) => {
		return {
			sol: solKey,
			season: capitaliseFirstLetter(weather[solKey].Season),
			maxTemp: formatTemp(weather[solKey].AT?.mx || "N/A", isMetric),
			minTemp: formatTemp(weather[solKey].AT?.mn || "N/A", isMetric),
			windSpeed: Math.round(weather[solKey].HWS?.av || 0),
			windDirectionDegrees: weather[solKey].WD?.most_common?.compass_degrees || 0,
			date: formatDate(new Date(weather[solKey].First_UTC)),
			pressure: weather[solKey].PRE ? weather[solKey].PRE?.av.toFixed(1) : null
		};
	});
}

// Format date string.
export const formatDate = (date) => {
	return date?.toLocaleDateString(undefined, { day: "numeric", month: "long", year: "numeric" });
}

// Format temperature.
export const formatTemp = (temp, isMetric) => {
	return `${Math.round(temp)} °${isMetric ? 'C' : 'F'}`;
}

// Convert fahrenheit to celsius / celsius to fahrenheit.
export const convertUnits = (isMetric, temp) => {
	return isMetric ? (temp - 32) * 5 / 9 : temp * 9 / 5 + 32;
}

export const capitaliseFirstLetter = (string) => {
	return string.charAt(0).toUpperCase() + string.slice(1);
}

export const sortByDate = (array) => {
	return array.sort((a, b) => new Date(a.First_UTC) - new Date(b.First_UTC));
}
