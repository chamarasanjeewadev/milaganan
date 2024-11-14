import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'si',
    supportedLngs: ['en', 'si'],
    debug: true,
    interpolation: {
      escapeValue: false,
    },
    resources: {
      en: {
        translation: {
          scan_preview: 'Scan to view the preview on your mobile device',
          show_qr: 'Show QR',
          hide_qr: 'Hide QR',
          save: 'Save',
          editor: 'Editor',
          select_font: 'Select font',
          upload_logo: 'Upload Logo',
          enter_markdown: 'Enter your markdown here...',
          welcome_message: 'Easy QR code generation for price display to customers!',
          toolbar: {
            bold: 'Bold',
            italic: 'Italic',
            link: 'Link',
            image: 'Image',
            heading1: 'Heading 1',
            heading2: 'Heading 2',
            bulletList: 'Bullet List',
            numberedList: 'Numbered List',
            quote: 'Quote',
            table: 'Table'
          }
        }
      },
      si: {
        translation: {
          scan_preview: 'ජංගම උපකරණයේ පෙරදසුන බැලීමට ස්කෑන් කරන්න',
          show_qr: 'QR පෙන්වන්න',
          hide_qr: 'QR සඟවන්න',
          save: 'සුරකින්න',
          editor: 'සංස්කාරක',
          select_font: 'අකුරු තෝරන්න',
          upload_logo: 'ලාංඡනය උඩුගත කරන්න',
          enter_markdown: 'ඔබේ මාර්ක්ඩවුන් මෙහි ඇතුළත් කරන්න...',
          welcome_message: 'පාරිභෝගිකයින්ට පහසුවෙන් මිල දර්ශනය ලබා දීමට, QR කේතයක් ලේ​සියෙන්​ම!',
          toolbar: {
            bold: 'තද අකුරු',
            italic: 'ඇල අකුරු',
            link: 'සබැඳිය',
            image: 'රූපය',
            heading1: 'ශීර්ෂය 1',
            heading2: 'ශීර්ෂය 2',
            bulletList: 'බුලට් ලැයිස්තුව',
            numberedList: 'අංක ලැයිස්තුව',
            quote: 'උපුටා දැක්වීම',
            table: 'වගුව'
          }
        }
      }
    }
  });

export default i18n; 