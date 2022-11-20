import * as core from '@actions/core'
import * as tc from '@actions/tool-cache'
import * as http from '@actions/http-client'

async function run(): Promise<void> {
  try {
    core.summary.addHeading('Test summary')
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
