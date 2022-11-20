import * as core from '@actions/core'
import {promises} from 'fs'

interface TestConfig {
  automation_repeat_count: number
  automation_repeat_failures_only: boolean
  max_tests_per_batch: number
  timeout_ticks: number
  automation_testrun_id: string
  automation_gametest_tags: Array<string>
  generate_documentation: boolean
}

async function run(): Promise<void> {
  try {
    let data = JSON.stringify({
      automation_repeat_count: 2,
      automation_repeat_failures_only: true,
      max_tests_per_batch: 20,
      timeout_ticks: 60000,
      automation_testrun_id: '1',
      automation_gametest_tags: ['hello_world']
    } as TestConfig)

    await promises.writeFile('test_config.json', data, {flag: 'w'})
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
