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
          },
          saving: 'Saving...',
          success: 'Success',
          error: 'Error',
          qr_code_saved: 'QR code saved successfully',
          failed_to_save_qr: 'Failed to save QR code',
          download_png: 'Download PNG',
          download_pdf: 'Download PDF',
          jpg_only_error: 'Only JPG images are allowed',
          logo_upload_success: 'Logo uploaded successfully',
          logo_upload_error: 'Failed to upload logo',
          learn_markdown: 'Learn Markdown',
          share: {
            title: 'Share This Page',
            copy_success: 'URL copied to clipboard!',
            copy_error: 'Failed to copy URL',
            email_section: 'Share via Email',
            email_placeholder: 'Enter email address',
            send: 'Send',
            email_success: 'Email sent successfully!',
            email_error: 'Failed to send email'
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
          },
          saving: 'සුරකිමින්...',
          success: 'සාර්ථකයි',
          error: 'දෝෂයකි',
          qr_code_saved: 'QR කේතය සාර්ථකව සුරකින ලදී',
          failed_to_save_qr: 'QR කේතය සුරැකීමට අසමත් විය',
          download_png: 'PNG බාගත කරන්න',
          download_pdf: 'PDF බාගත කරන්න',
          jpg_only_error: 'JPG රූප පමණක් අවසර ඇත',
          logo_upload_success: 'ලාංඡනය සාර්ථකව උඩුගත කරන ලදී',
          logo_upload_error: 'ලාංඡනය උඩුගත කිරීමට අසමත් විය',
          learn_markdown: 'මාර්ක්ඩවුන් ලබා දීමට මාර්ක්ඩවුන් ලියාපදිංචි කරන්න',
          share: {
            title: 'මෙම පිටුව බෙදාගන්න',
            copy_success: 'URL පසුරු පුවරුවට පිටපත් කරන ලදී!',
            copy_error: 'URL පිටපත් කිරීමට අසමත් විය',
            email_section: 'විද්‍යුත් තැපෑලෙන් බෙදාගන්න',
            email_placeholder: 'විද්‍යුත් තැපැල් ලිපිනය ඇතුළත් කරන්න',
            send: 'යවන්න',
            email_success: 'විද්‍යුත් තැපෑල සාර්ථකව යවන ලදී!',
            email_error: 'විද්‍යුත් තැපෑල යැවීමට අසමත් විය'
          }
        }
      }
    }
  });

export default i18n; 