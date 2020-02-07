import Mocha from 'mocha'
import { Script } from '../shared'
import fs from 'fs'

// class AutomationScriptUnitTestingReporter extends Mocha.reporters.Base {
//   constructor (runner: Mocha.Runner, options: Mocha.MochaOptions) {
//     super(runner, options)
//
//     runner
//       .on('fail', (test, err) => {
//         console.error({ test })
//       })
//   }
// }

function extractTestFiles (ss: Array<Script>) {
  const fileExists = (filepath) => {
    try {
      fs.lstatSync(filepath)
      return true
    } catch (err) {
      // No tests found, silently ignore
      return false
    }
  }

  return ss
    .map(({ filepath }) => filepath.replace(/(.*)\.(js)$/, '$1.test.$2'))
    .filter(fileExists)
}

export default function TestRunner (ss: Array<Script>): Mocha.Runner {
  const testFiles = extractTestFiles(ss)
  if (testFiles.length === 0) {
    return
  }

  // @todo support for typescript

  const m = new Mocha()

  // @todo register new reporter that collects failed tests per each script
  //       and appends them to the list
  //       this will be useful when we enable script authoring via API
  //       for now, simple standard output is good enough
  // m.reporter(AutomationScriptUnitTestingReporter)

  // @todo for some reason this does not clear the (require) cache...

  testFiles
    .forEach(testFile => {
      Mocha.unloadFile(testFile)
      m.addFile(testFile)
    })

  return m.run()
}
