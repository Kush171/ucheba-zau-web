// Literal substrings; never interpret the user's query as a regular expression.
const fold = (s) =>
  String(s || '')
    .toLowerCase()
    .replace(/ё/g, 'е');
const tokens = (query) => [...new Set(fold(query).trim().split(/\s+/).filter(Boolean))];
function highlightedParts(text, terms) {
  const folded = fold(text),
    spans = [];
  for (const word of terms) {
    if (!word) continue;
    let at = -1;
    while ((at = folded.indexOf(word, at + 1)) !== -1) spans.push([at, at + word.length]);
  }
  spans.sort((a, b) => a[0] - b[0] || b[1] - a[1]);
  const merged = [];
  for (const [a, b] of spans) {
    const last = merged[merged.length - 1];
    if (last && a < last[1]) last[1] = Math.max(last[1], b);
    else merged.push([a, b]);
  }
  const out = [];
  let start = 0;
  for (const [a, b] of merged) {
    if (start < a) out.push({ text: text.slice(start, a), hit: false });
    out.push({ text: text.slice(a, b), hit: true });
    start = b;
  }
  if (start < text.length) out.push({ text: text.slice(start), hit: false });
  return out;
}
function searchVerses(books, query, { scope = 'all', mode = 'words', bookId = '', limit = 60 } = {}) {
  const words = tokens(query);
  if (!words.length) return [];
  const literal = fold(query).trim();
  const out = [];
  for (const book of books) {
    if (scope === 'book' ? book.id !== bookId : scope !== 'all' && book.testament !== scope) continue;
    for (let c = 0; c < book.chapters.length; c++)
      for (let v = 0; v < book.chapters[c].length; v++) {
        const item = book.chapters[c][v],
          text = typeof item === 'string' ? item : item.text,
          line = fold(text);
        if (mode === 'phrase' ? !line.includes(literal) : !words.every((w) => line.includes(w)))
          continue;
        out.push({
          bookId: book.id,
          bookName: book.name,
          chapter: c + 1,
          verse: v + 1,
          label: item?.number || v + 1,
          text,
          parts: highlightedParts(text, words)
        });
        if (out.length >= limit) return out;
      }
  }
  return out;
}

const LIMIT = 20 * 1024 * 1024;
function parseIpb(raw, canon) {
  if (typeof raw !== 'string' || raw.length > LIMIT) throw Error('Нужен JSON-файл не более 20 МБ.');
  let p;
  try {
    p = JSON.parse(raw.replace(/^\uFEFF/, ''));
  } catch {
    throw Error('Не удалось прочитать JSON. Нужен пакет перевода, а не PDF или архив.');
  }
  if (
    !p ||
    !(p.id === 'kulakov' || /кулаков|\bBTI\b/i.test([p.translation, p.editor, p.copyright].join(' ')))
  )
    throw Error('Это не пакет ИПБ (Кулакова). Проверьте перевод и формат файла.');
  const bad = () => {
    throw Error('Неполный или повреждённый перевод: проверьте книги, главы и текст стихов.');
  };
  if (!Array.isArray(p.books) || p.books.length !== canon.length) bad();
  const byId = new Map(p.books.map((b) => [b?.id, b]));
  const books = canon.map((b) => {
    const source = byId.get(b.id);
    if (!Array.isArray(source?.chapters) || source.chapters.length !== b.chapters.length) bad();
    const chapters = source.chapters.map((ch) => {
      if (!Array.isArray(ch) || !ch.length || ch.length > 250) bad();
      return ch.map((v, i) => {
        const t = typeof v === 'string' ? v : v?.text;
        if (typeof t !== 'string' || !t.trim() || t.length > 12000) bad();
        const number = String((typeof v === 'object' ? v?.number : null) ?? i + 1);
        if (!/^\d{1,3}(?:[-–—]\d{1,3})?$/.test(number)) bad();
        return { number, text: t };
      });
    });
    return { id: b.id, name: b.name, testament: b.testament, chapters };
  });
  const credit = [p.copyright, p.license]
    .filter((x) => typeof x === 'string' && x.trim())
    .join(' · ')
    .slice(0, 1500);
  return {
    id: 'kulakov',
    label: 'ИПБ (Кулакова)',
    attribution: credit || 'Институт перевода Библии в Заокском · личный файл',
    data: { books }
  };
}

export { searchVerses, highlightedParts, tokens, parseIpb, LIMIT };
