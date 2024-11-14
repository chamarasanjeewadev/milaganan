import { useTranslation } from "react-i18next";



export function Header() {
  const { t, i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === "en" ? "si" : "en";
    i18n.changeLanguage(newLang);
  };

  return (
    <header className="bg-white border-b border-gray-200 px-4 py-3 flex justify-between ">
      <div className="flex flex-1 justify-center ">
        <p>{t("welcome_message")}</p>
      </div>
      <button
        onClick={toggleLanguage}
        className="px-3 py-1 text-sm rounded-md bg-indigo-50 text-indigo-600 hover:bg-indigo-100"
      >
        {i18n.language === "en" ? "සිංහල" : "English"}
      </button>
    </header>
  );
}
