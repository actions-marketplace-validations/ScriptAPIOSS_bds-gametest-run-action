export interface TestResults {
  passed: number
  failed: number
  totalRun: number
  missingTags: string[]
  total: number
  runTimedOut: boolean
  unique: number
  rerun_failures: boolean
  startTime: string
  results: Result[]
  current_iteration: number
  endTime: string
  testRunId: string
}

export interface Result {
  name: string
  endTime: string
  iteration: number
  startTime: string
  result: string
  error: string
}
