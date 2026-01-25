export const LANGUAGES = [
	{ code: "en", name: "English" },
	{ code: "es", name: "Spanish" },
	{ code: "fr", name: "French" },
	{ code: "de", name: "German" },
	{ code: "it", name: "Italian" },
	{ code: "pt", name: "Portuguese" },
	{ code: "ru", name: "Russian" },
	{ code: "ja", name: "Japanese" },
	{ code: "zh", name: "Chinese" },
	{ code: "ko", name: "Korean" },
	{ code: "tr", name: "Turkish" },
	{ code: "ar", name: "Arabic" },
	{ code: "hi", name: "Hindi" },
	{ code: "nl", name: "Dutch" },
	{ code: "sv", name: "Swedish" },
	{ code: "pl", name: "Polish" },
	{ code: "vi", name: "Vietnamese" },
	{ code: "th", name: "Thai" },
	{ code: "el", name: "Greek" },
	{ code: "he", name: "Hebrew" },
	{ code: "id", name: "Indonesian" },
	{ code: "ms", name: "Malay" },
	{ code: "no", name: "Norwegian" },
	{ code: "fi", name: "Finnish" },
	{ code: "da", name: "Danish" },
];
export const LANGUAGE_CODE_MAP = LANGUAGES.reduce((map, language) => {
	map[language.code] = language.name;
	return map;
}, {});