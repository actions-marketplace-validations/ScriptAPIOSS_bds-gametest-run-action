import * as core from '@actions/core'

export const BDS_PATH: string = core.getInput('BDS_PATH', {required: true})
export const TIMEOUT_TICKS: number = Number(
  core.getInput('TIMEOUT_TICKS', {
    required: true
  })
)
