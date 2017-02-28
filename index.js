import {
  SpellBase,
  SpellResult,
  DefaultDisplayType,
} from 'zeppelin-spell'

import parser from 'papaparse'

export default class CsvSpell extends SpellBase {
  constructor() {
    super("%csv");
  }

  interpret(paragraphText) {
    const dataframe = parser.parse(paragraphText, {
      header: true,
      dynamicTyping: true,
    })

    if (dataframe.errors.length > 0) {
      const errorMessage = dataframe.errors
        .map(e => { return `- ${e.message}` })
        .join('\n')

      return new SpellResult('\nCSV PARSING ERROR: \n' + errorMessage)
    }

    let tableString = createTableString(dataframe.meta.fields)
    for (let i = 0; i < dataframe.data.length; i++) {
      const row = dataframe.data[i]
      const columns = []

      for (let j = 0; j < dataframe.meta.fields.length; j++) {
        const colName = dataframe.meta.fields[j]
        const colValue = row[colName]

        columns.push(colValue)
      }

      tableString += createTableString(columns)
    }

    return new SpellResult(tableString, DefaultDisplayType.TABLE)
  }
}

function createTableString(arr) {
  return `${arr.join('\t')}\n`
}
