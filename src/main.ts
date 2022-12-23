import * as core from '@actions/core'
import * as exec from '@actions/exec'
import * as glob from '@actions/glob'
import {SummaryTableCell, SummaryTableRow} from '@actions/core/lib/summary'
import {v4 as uuidv4} from 'uuid'

import {promises} from 'fs'
import * as path from 'path'

import {TestResults} from './types/test-results'
import {TestConfig} from './types/test-config'
import {PackDefinition} from './types/world-behavior-packs'
import {Permissions} from './types/permissions'
import {SERVER_PROPERTIES} from './types/server-props'
import {DEBUG_TEST_TAG} from './debug-tests'
import {create_debug_pack} from './debug-pack'
import {BDS_PATH, PACKS, TEST_TAGS, TIMEOUT_TICKS} from './types/inputs'
import {LEVEL_DAT} from './types/level-dat'
import { readFile } from 'fs/promises'

const LOG_PATH: string = 'logs'
const TEST_CONFIG_FILE: string = 'test_config.json'
const TEST_RESULTS_FILE: string = 'test-results-gametest.json'
const WORLDS_PATH: string = 'worlds'
const WORLD_NAME: string = 'Bedrock level'
const WORLD_BEHAVIOR_PACKS_FILE: string = 'world_behavior_packs.json'

async function run(): Promise<void> {
  try {
    switch (process.platform) {
      case 'win32': {
        throw new Error('Unsupported platform: ${process.platform}')
      }
      case 'darwin': {
        throw new Error('Unsupported platform: ${process.platform}')
      }
    }

    let debug_pack_uuid = uuidv4()

    const pack_data = [
      {
        pack_id: debug_pack_uuid,
        version: [0, 0, 1]
      }
    ] as Array<PackDefinition>

    core.debug(`Before: ${pack_data}`)

    core.debug(`Supplied packs: ${PACKS}`)

    for (const p of PACKS) {
      core.debug(`Iteration: ${p}`)
      try {
        const pack_array: Array<PackDefinition> = JSON.parse(p)
        core.info(`pa: ${pack_array}`)
        for (const pat of pack_array) {
          pack_data.push(pat)
          core.debug(`Added: ${pat}`)
        }
      } catch (e) {
        // do normal
      }
    }

    core.debug(`After: ${pack_data}`)


    core.startGroup('Setup configs')

    const test_config_data = JSON.stringify({
      automation_repeat_count: 2,
      automation_repeat_failures_only: true,
      max_tests_per_batch: 20,
      timeout_ticks: TIMEOUT_TICKS,
      automation_testrun_id: '123456789',
      automation_gametest_tags: [DEBUG_TEST_TAG, ...TEST_TAGS]
    } as TestConfig)

    await promises.writeFile(
      path.join(process.cwd(), BDS_PATH, TEST_CONFIG_FILE),
      test_config_data,
      {
        flag: 'w'
      }
    )
    core.debug('wrote test_config.json')

    await create_debug_pack(debug_pack_uuid)

    await promises.writeFile(
      path.join(process.cwd(), BDS_PATH, 'server.properties'),
      SERVER_PROPERTIES,
      {
        flag: 'w'
      }
    )
    core.debug('wrote server.properties')

    const world_base_path = path.join(
      process.cwd(),
      BDS_PATH,
      'worlds',
      'Bedrock level'
    )
    await promises.mkdir(path.join(world_base_path, 'scripts'), {
      recursive: true
    })
    await promises.writeFile(
      path.join(world_base_path, 'level.dat'),
      LEVEL_DAT,
      {
        flag: 'w'
      }
    )
    core.debug('wrote level.dat')

    core.debug(`world_behavior_packs: ${pack_data}`)

    await promises.writeFile(
      path.join(
        process.cwd(),
        BDS_PATH,
        WORLDS_PATH,
        WORLD_NAME,
        WORLD_BEHAVIOR_PACKS_FILE
      ),
      JSON.stringify(pack_data),
      {
        flag: 'w'
      }
    )
    core.debug('wrote world_behavior_packs.json')

    await promises.writeFile(
      path.join(
        process.cwd(),
        BDS_PATH,
        'config',
        'default',
        'permissions.json'
      ),
      JSON.stringify({
        allowed_modules: ['*']
      } as Permissions),
      {
        flag: 'w'
      }
    )
    core.debug('wrote permissions.json')
    core.endGroup()

    await core.group('Run bedrock server', async () => {
      await exec.exec(
        path.join(process.cwd(), BDS_PATH, 'bedrock_server'),
        [],
        {
          cwd: path.join(process.cwd(), BDS_PATH)
        }
      )
    })

    let results: TestResults = JSON.parse(
      await promises.readFile(
        path.join(process.cwd(), BDS_PATH, LOG_PATH, TEST_RESULTS_FILE),
        'utf8'
      )
    )

    core.info(JSON.stringify(results))

    core.summary.addHeading('Test results')

    const rows = new Array<SummaryTableRow>()

    rows.push([
      {data: `Test`, header: true},
      {data: `Result`, header: true},
      {data: `Iteration`, header: true},
      {data: `Duration`, header: true},
      {data: `Error`, header: true}
    ])

    for (const r of results.results) {
      // if (r.result === 'failed') {
      //   core.error(`Test failed: ${r.name}`)
      // }

      let icon
      switch (r.result) {
        case 'passed':
          icon = ':green_circle:'
          break
        case 'failed':
          icon = ':red_circle:'
          break
      }

      const startTime = new Date(r.startTime)
      const endTime = new Date(r.endTime)

      rows.push([
        {data: `${r.name}`},
        {data: `${icon} ${r.result}`},
        {data: `${r.iteration}`},
        {data: `${(endTime.getTime() - startTime.getTime()) / 1000}s`},
        {data: `${r.error}`}
      ])
    }

    core.summary.addTable(rows)

    const globber = await glob.create(path.join(process.cwd(), BDS_PATH, 'ContentLog__*'))
    for await (const cl of globber.globGenerator()) {
      const flbuf = await readFile(cl, 'utf8')
      core.summary.addSeparator()
      core.summary.addHeading(cl)
      core.summary.addCodeBlock(flbuf)
    }

    core.summary.write()
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

const sleep = (ms: number) => new Promise(r => setTimeout(r, ms))

run()
