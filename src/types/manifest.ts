interface BehaviorPackHeader {
  name: string;
  description: string;
  uuid: string;
  version: number[];
  min_engine_version: number[];
}

interface BehaviorPackModule {
  type: string;
  uuid: string;
  version: number[];
}

interface BehaviorPackDependency {
  uuid: string;
  version: number[];
}

interface BehaviorPackManifest {
  format_version: number;
  header: BehaviorPackHeader;
  modules: BehaviorPackModule[];
  dependencies: BehaviorPackDependency[];
}

export { BehaviorPackHeader, BehaviorPackModule, BehaviorPackDependency, BehaviorPackManifest };