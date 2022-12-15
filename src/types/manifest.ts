export interface Manifest {
  format_version: number
  header: Header
  modules: Module[]
  dependencies: Dependency[]
}

export interface Header {
  description: string
  name: string
  uuid: string
  version: number[]
  min_engine_version: number[]
}

export interface Module {
  description: string
  type: string
  uuid: string
  version: number[]
  language: string
  entry: string
}

export interface Dependency {
  module_name: string
  version: string
}
