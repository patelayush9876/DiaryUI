const escapeHtml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

const restoreAllowedTags = (value: string) =>
  value
    .replaceAll('[[strong]]', '<strong>')
    .replaceAll('[[/strong]]', '</strong>')
    .replaceAll('[[em]]', '<em>')
    .replaceAll('[[/em]]', '</em>')
    .replaceAll('[[u]]', '<u>')
    .replaceAll('[[/u]]', '</u>')
    .replaceAll('[[br]]', '<br />')
    .replaceAll('[[div]]', '<div>')
    .replaceAll('[[/div]]', '</div>')
    .replaceAll('[[p]]', '<p>')
    .replaceAll('[[/p]]', '</p>');

const preserveAllowedTags = (value: string) =>
  value
    .replace(/<(strong|b)\b[^>]*>/gi, '[[strong]]')
    .replace(/<\/(strong|b)>/gi, '[[/strong]]')
    .replace(/<(em|i)\b[^>]*>/gi, '[[em]]')
    .replace(/<\/(em|i)>/gi, '[[/em]]')
    .replace(/<u\b[^>]*>/gi, '[[u]]')
    .replace(/<\/u>/gi, '[[/u]]')
    .replace(/<br\s*\/?>/gi, '[[br]]')
    .replace(/<div\b[^>]*>/gi, '[[div]]')
    .replace(/<\/div>/gi, '[[/div]]')
    .replace(/<p\b[^>]*>/gi, '[[p]]')
    .replace(/<\/p>/gi, '[[/p]]');

const convertLegacyFormatting = (value: string) =>
  value
    .replace(/\*\*(.+?)\*\*/gs, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/gs, '<em>$1</em>')
    .replace(/&lt;u&gt;(.+?)&lt;\/u&gt;/gs, '<u>$1</u>');

export const sanitizeDiaryHtml = (value: string) => {
  if (!value) {
    return '';
  }

  const escaped = escapeHtml(preserveAllowedTags(value));

  return restoreAllowedTags(convertLegacyFormatting(escaped)).replace(/\n/g, '<br />');
};

export const diaryContentToPlainText = (value: string) => {
  if (!value) {
    return '';
  }

  return sanitizeDiaryHtml(value)
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/(div|p)>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
};
