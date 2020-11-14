import {VariablesEnum, VariablesTypesEnum} from './enums';
import {NumberVariable} from './types';

export const variables: Record<VariablesEnum, NumberVariable> = {
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
