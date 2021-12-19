const data = require('fs').readFileSync('./README.md', 'utf-8')

const exercises = data.split('\n').filter(x => x.startsWith('**'))

const counter = {}

for (ex of exercises) {
  const theos = new Set([...ex.matchAll(/([AZ]\.[\d]+\.[\d]+)|([AZ]\-[\d]+\-\([^)]+\))/g)].map(x => x[0]))
  for (theo of theos) {
    if (!counter[theo]) counter[theo] = 0
    counter[theo]++
  }
}

const counterArr = Object.entries(counter).map(entry => {
  const obj = {count:entry[1], tag:entry[0], topic:entry[0].substring(0, 1)}
  if (entry[0].includes('-')) {
    obj.order = 10000
    obj.suborder = parseInt(entry[0].substring(2))
  } else {
    parts = entry[0].split('.')
    obj.order = parseInt(parts[1])
    obj.suborder = parseInt(parts[2])
  }
  return obj
})

counterArr.sort((a, b) => {
  if (a.topic == b.topic) {
    if (a.order == b.order) {
      if (a.suborder == b.suborder) {
        return a.tag.localeCompare(b.tag)
      } else {
        return a.suborder - b.suborder
      }
    } else {
      return a.order - b.order
    }
  } else {
    return a.topic < b.topic ? -1 : 1
  }
})

for (entry of counterArr) {
  console.log(`-- ${entry.count} --   ${entry.tag}`)
}
