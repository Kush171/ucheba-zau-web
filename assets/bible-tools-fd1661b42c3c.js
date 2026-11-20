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

const REF_NAMES59={"GEN":["Быт","Бт"],"EXO":["Исх"],"LEV":["Лев","Лв"],"NUM":["Чис"],"DEU":["Втор","Второзак"],"JOS":["Нав","ИисНав"],"JDG":["Суд"],"RUT":["Руфь"],"1SA":["1Цар"],"2SA":["2Цар"],"1KI":["3Цар"],"2KI":["4Цар"],"1CH":["1Пар"],"2CH":["2Пар"],"EZR":["Ездр"],"NEH":["Неем"],"EST":["Есф"],"JOB":["Иов"],"PSA":["Пс","Псалом","Псалтирь","Псал"],"PRO":["Прит","Притч","Притчи"],"ECC":["Еккл"],"SNG":["Песн","ПесньПесней"],"ISA":["Ис"],"JER":["Иер"],"LAM":["Плач"],"EZK":["Иез"],"DAN":["Дан"],"HOS":["Ос"],"JOL":["Иоил"],"AMO":["Ам"],"OBA":["Авд"],"JON":["Иона"],"MIC":["Мих"],"NAM":["Наум"],"HAB":["Авв"],"ZEP":["Соф"],"HAG":["Агг"],"ZEC":["Зах"],"MAL":["Мал"],"MAT":["Мат","Мф","Мт","Матфея","Матф"],"MRK":["Мар","Мк","Мр","Марка"],"LUK":["Лук","Лк","Луки"],"JHN":["Ин","Иоан","Иоанна","Иоанн","Иоан."],"ACT":["Деян"],"JAS":["Иак"],"1PE":["1Пет"],"2PE":["2Пет"],"1JN":["1Ин","1Иоан","1Иоанна"],"2JN":["2Ин","2Иоан","2Иоанна"],"3JN":["3Ин","3Иоан","3Иоанна"],"JUD":["Иуд"],"ROM":["Рим"],"1CO":["1Кор","1Коринф"],"2CO":["2Кор","2Коринф"],"GAL":["Гал"],"EPH":["Еф"],"PHP":["Флп","Филип"],"COL":["Кол"],"1TH":["1Фес","1Фесс"],"2TH":["2Фес","2Фесс"],"1TI":["1Тим"],"2TI":["2Тим"],"TIT":["Тит"],"PHM":["Флм"],"HEB":["Евр"],"REV":["Откр","Отк","Апокалипсис","Откровение"]} ;
const foldRef59=s=>String(s||'').toLowerCase().replace(/ё/g,'е').replace(/[.\s\u00a0]+/g,'');
// Verse labels, not array offsets: some translations merge e.g. 12–13 or omit an index.
function parseReference(books,input){
 const m=String(input||'').trim().match(/^([1-4]?\s*[А-Яа-яЁёA-Za-z][А-Яа-яЁёA-Za-z.\s-]*?)\s*(\d{1,3})\s*[:,：]\s*(\d{1,3})\s*$/u);if(!m)return null;
 const key=foldRef59(m[1]),book=books?.find(b=>[b.id,b.name,...(REF_NAMES59[b.id]||[])].some(a=>foldRef59(a)===key));
 if(!book)return {error:'Не найдена книга «'+m[1].trim()+'». Можно ввести полное название.'};
 const chapter=Number(m[2]),v=Number(m[3]),verses=book.chapters[chapter-1];if(!verses)return {error:'В книге «'+book.name+'» глав: '+book.chapters.length+'.'};
 const i=verses.findIndex((entry,j)=>{const label=typeof entry==='object'?entry.number:null;const [a,b]=String(label??(j+1)).split(/[-–—]/).map(Number);return v>0&&a<=v&&v<=(b||a);});
 if(i<0)return {error:'В этой главе выбранного перевода нет стиха '+v+'.'};
 const entry=verses[i];return {bookId:book.id,bookName:book.name,chapter,verse:i+1,label:entry?.number||v,text:typeof entry==='string'?entry:entry.text};
}

export {parseReference};
