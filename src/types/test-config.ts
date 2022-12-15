export interface TestConfig {
  automation_repeat_count: number
  automation_repeat_failures_only: boolean
  max_tests_per_batch: number
  timeout_ticks: number
  automation_testrun_id: string
  automation_gametest_tags: string[]
  generate_documentation: boolean
}
