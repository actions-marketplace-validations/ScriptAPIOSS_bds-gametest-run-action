import * as core from '@actions/core'

export const BDS_PATH = core.getInput('BDS_PATH', {required: true})
export const TIMEOUT_TICKS = Number(
  core.getInput('TIMEOUT_TICKS', {
    required: true
  })
)
export const AUTOMATION_REPEAT_COUNT = Number(
  core.getInput('AUTOMATION_REPEAT_COUNT', {
    required: true
  })
)
export const AUTOMATION_REPEAT_FAILURES_ONLY = core.getBooleanInput(
  'AUTOMATION_REPEAT_FAILURES_ONLY',
  {
    required: true
  }
)
export const MAX_TESTS_PER_BATCH = Number(
  core.getInput('MAX_TESTS_PER_BATCH', {
    required: true
  })
)

export const PACKS = core.getMultilineInput('PACKS')
export const TEST_TAGS = core.getMultilineInput('TEST_TAGS')
