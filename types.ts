import {ScriptsEnum, ServicesEnum, VariablesEnum, VariablesTypesEnum} from './enums';

export interface Script {
  id: ScriptsEnum,
  command: string,
  title: string,
  variables?: VariablesEnum[],
  output?: VariablesEnum[],
  onServicesStatus?(activeServices: ServicesEnum[]): boolean;
}

export interface Choice {
  title: string,
  value: ScriptsEnum,
  description: string,
}

interface Variable {
  id: VariablesEnum,
  message?: string;
}

export interface NumberVariable extends Variable {
  type: VariablesTypesEnum.NUMBER,
  initial?: number,
}

export interface StringVariable extends Variable {
  type: VariablesTypesEnum.STRING,
  initial?: string,
}
