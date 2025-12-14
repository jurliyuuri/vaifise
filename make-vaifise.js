import fs from 'fs'

const file = await fs.promises.readFile('./vaifise.json', 'utf8')
const f = JSON.parse(file) 

const mapped = f.words.map(w => {
  const newTranslations = w.contents
    .filter(c => c.title === '訳語')[0]
    .text.split('\r\n')
    .filter(t => t.startsWith('【'))
    .map(t => t.replace(/【/g, '').trim())
    .map(t => {
      const [title, ...forms] = t.split('】')
      return { title, forms }
    })
  const newContents = w.contents.filter(c => c.title !== '訳語').concat({
    title: '備考',
    text: w.contents
    .filter(c => c.title === '訳語')[0]
    .text.split('\r\n')
    .filter(t => t.startsWith('2') | t.startsWith('0'))[0]
  })
  return {
    entry: w.entry,
    translations: newTranslations,
    tags: w.tags,
    contents: newContents,
    variations: w.variations,
    relations: w.relations
  }
})

fs.promises.writeFile('./vaifise-v2.json', JSON.stringify({ words: mapped }, null, 2), 'utf8')