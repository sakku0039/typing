import { readFileSync } from 'node:fs';

const filePath = new URL('../questions.json', import.meta.url);
const data = JSON.parse(readFileSync(filePath, 'utf8'));
const errors = [];

if (data.schema !== 'romaji-star-typing.v1') {
  errors.push('schema must be romaji-star-typing.v1');
}

if (!data.appTitle || typeof data.appTitle !== 'string') {
  errors.push('appTitle is required');
}

if (!Array.isArray(data.lessons) || data.lessons.length === 0) {
  errors.push('lessons must contain at least one lesson');
}

for (const [lessonIndex, lesson] of (data.lessons || []).entries()) {
  const lessonLabel = `lessons[${lessonIndex}]`;
  if (!lesson.id || typeof lesson.id !== 'string') errors.push(`${lessonLabel}.id is required`);
  if (!lesson.title || typeof lesson.title !== 'string') errors.push(`${lessonLabel}.title is required`);
  if (!Array.isArray(lesson.words) || lesson.words.length === 0) {
    errors.push(`${lessonLabel}.words must contain at least one word`);
    continue;
  }

  for (const [wordIndex, word] of lesson.words.entries()) {
    const wordLabel = `${lessonLabel}.words[${wordIndex}]`;
    if (!word.text || typeof word.text !== 'string') errors.push(`${wordLabel}.text is required`);
    if (!word.kana || typeof word.kana !== 'string') errors.push(`${wordLabel}.kana is required`);
  }
}

if (errors.length > 0) {
  console.error(errors.join('\n'));
  process.exit(1);
}

const wordCount = data.lessons.reduce((sum, lesson) => sum + lesson.words.length, 0);
console.log(`questions.json OK: ${data.lessons.length} lessons, ${wordCount} words`);
