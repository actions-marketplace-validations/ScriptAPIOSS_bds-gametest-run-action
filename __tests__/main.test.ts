import * as process from 'process'
import * as cp from 'child_process'
import * as path from 'path'
import {test} from '@jest/globals'
import * as fs from 'fs'

// shows how the runner will run a javascript action with env / stdout protocol
test('test runs', () => {
  // For local development
  if (process.env['RUNNER_TEMP'] == undefined) {
    process.env['RUNNER_TEMP'] = '/tmp'
  }
  if (process.env['RUNNER_TOOL_CACHE'] == undefined) {
    process.env['RUNNER_TOOL_CACHE'] = '/tmp'
  }
  if (process.env['GITHUB_STEP_SUMMARY'] == undefined) {
    process.env['GITHUB_STEP_SUMMARY'] = '/tmp/summary.md'
  }
  // end of local dev stuff

  if (!fs.existsSync('./bds/')) {
    // skip testing in CI for now, until we have better tests
    return
  }

  process.env['INPUT_BDS_PATH'] = './bds/'
  process.env['INPUT_TIMEOUT_TICKS'] = '60000'

  const np = process.execPath
  const ip = path.join(__dirname, '..', 'lib', 'main.js')
  const options: cp.ExecFileSyncOptions = {
    env: process.env
  }
  console.log(cp.execFileSync(np, [ip], options).toString())
})
