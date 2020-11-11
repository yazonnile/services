export enum ChoicesTypeEnum {
  SCRIPT = 'script',
  SERVICE = 'service',
}

export enum ServicesTypeEnum {
  START = 'start',
  STOP = 'stop',
  RESTART = 'restart',
}

export enum ScriptsEnum {
  POSTGRE_CONNECT = 'POSTGRE_CONNECT',
  MYSQL_CONNECT = 'MYSQL_CONNECT',
  GET_RANDOM_HEX = 'GET_RANDOM_HEX',
  GET_RANDOM_NUMBER = 'GET_RANDOM_NUMBER',
}

export enum ServicesEnum {
  POSTGRE = 'postgresql@12',
  MYSQL = 'mysql@5.7',
}

export enum HooksEnum {
  STATUS = 'onStatus',
  START = 'onStart',
  STOP = 'onStop',
}

export interface Script {
  id: ScriptsEnum,
  command: string,
  description?: string,
  alwaysVisible?: true,
}

export interface Service {
  id: ServicesEnum,
  [HooksEnum.STATUS]?: (isActive: boolean) => StatusHook,
  [HooksEnum.START]?: () => Hook,
  [HooksEnum.STOP]?: () => Hook,
}

export interface Hook {
  scriptId: ScriptsEnum,
  title?: string
}

export type StatusHook = ScriptsEnum[];

export type ScriptChoiceValue = {
  id: ScriptsEnum,
  choiceType: ChoicesTypeEnum.SCRIPT,
  command: string,
};

export type ServiceChoiceValue = {
  id: ServicesEnum,
  choiceType: ChoicesTypeEnum.SERVICE,
  serviceType: ServicesTypeEnum,
  command: string,
};

export interface Choice {
  title: string,
  value: ScriptChoiceValue | ServiceChoiceValue,
  description?: string,
}
