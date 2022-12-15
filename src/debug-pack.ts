import * as core from '@actions/core'
import {v4 as uuidv4} from 'uuid'

import {promises} from 'fs'
import * as path from 'path'

import {STRUCTURE_BYTES} from './types/mcstructure'
import {Manifest} from './types/manifest'
import {DEBUG_TESTS} from './debug-tests'
import {BDS_PATH} from './types/inputs'

const STANDARD_FLAGS = {
  flag: 'w'
}

const DEVELOPMENT_BEHAVIOR_PACKS_PATH = 'development_behavior_packs'

export async function create_debug_pack(pack_id: string) {
  const base_path = path.join(
    process.cwd(),
    BDS_PATH,
    DEVELOPMENT_BEHAVIOR_PACKS_PATH,
    'debug_pack'
  )

  await promises.mkdir(path.join(base_path, 'scripts'), {recursive: true})
  await promises.mkdir(path.join(base_path, 'structures', 'debugtests'), {
    recursive: true
  })
  await promises.writeFile(
    path.join(
      base_path,
      'structures',
      'debugtests',
      'always_succeed.mcstructure'
    ),
    STRUCTURE_BYTES,
    STANDARD_FLAGS
  )
  core.debug('wrote always_succeed.mcstructure')
  await promises.writeFile(
    path.join(base_path, 'structures', 'debugtests', 'always_fail.mcstructure'),
    STRUCTURE_BYTES,
    STANDARD_FLAGS
  )
  core.debug('wrote always_fail.mcstructure')
  await promises.writeFile(
    path.join(base_path, 'scripts', 'Main.js'),
    DEBUG_TESTS,
    STANDARD_FLAGS
  )
  core.debug('wrote Main.js')
  await promises.writeFile(
    path.join(base_path, 'manifest.json'),
    JSON.stringify({
      format_version: 2,
      header: {
        description: 'Debug Pack for Testing',
        name: 'Debug Pack',
        uuid: pack_id,
        version: [0, 0, 1],
        min_engine_version: [1, 14, 0]
      },
      modules: [
        {
          description: 'Debug Pack for Testing',
          type: 'script',
          uuid: uuidv4(),
          version: [0, 0, 1],
          language: 'JavaScript',
          entry: 'scripts/Main.js'
        }
      ],
      dependencies: [
        {
          module_name: '@minecraft/server-gametest',
          version: '1.0.0-beta'
        }
      ]
    } as Manifest),
    STANDARD_FLAGS
  )
  core.debug('wrote manifest.json')
}
