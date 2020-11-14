export enum VariablesEnum {
  LOCAL_PORT = 'LOCAL_PORT',
  PROCESS_ID = 'PROCESS_ID',
  NUMBER_FROM = 'NUMBER_FROM',
  NUMBER_TO = 'NUMBER_TO',
  HEX_LENGTH = 'HEX_LENGTH',
}

enum VariablesTypesEnum {
  NUMBER = 'number',
  STRING = 'text',
}

interface Variable {
  id: VariablesEnum,
  message?: string;
}

interface NumberVariable extends Variable {
  type: VariablesTypesEnum.NUMBER,
  initial?: number,
}

interface StringVariable extends Variable {
  type: VariablesTypesEnum.STRING,
  initial?: string,
}


export const variables: Record<VariablesEnum, NumberVariable|StringVariable> = {
  [VariablesEnum.LOCAL_PORT]: {
    id: VariablesEnum.LOCAL_PORT,
    type: VariablesTypesEnum.NUMBER,
  },
  [VariablesEnum.PROCESS_ID]: {
    id: VariablesEnum.PROCESS_ID,
    type: VariablesTypesEnum.NUMBER,
  },
  [VariablesEnum.NUMBER_FROM]: {
    id: VariablesEnum.NUMBER_FROM,
    type: VariablesTypesEnum.NUMBER,
    initial: 1,
  },
  [VariablesEnum.NUMBER_TO]: {
    id: VariablesEnum.NUMBER_TO,
    type: VariablesTypesEnum.NUMBER,
    initial: 100,
  },
  [VariablesEnum.HEX_LENGTH]: {
    id: VariablesEnum.HEX_LENGTH,
    type: VariablesTypesEnum.NUMBER,
    initial: 16,
  },
};
