function googleTranslateElementInit() {
  new google.translate.TranslateElement(
    {
      pageLanguage: "pt",
      includedLanguages: "en,es,fr,it,de,ja,ru",
      layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
    },
    "comment-text"
  );
}
