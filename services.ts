import {ServicesEnum, ScriptsEnum, Service} from './types';

export const services: Readonly<Service>[] = [
  {
    id: ServicesEnum.POSTGRE,
    onStatus: (isActive) => {
      return isActive ? [ScriptsEnum.POSTGRE_CONNECT] : [];
    },
    onStart: () => {
      return {
        scriptId: ScriptsEnum.POSTGRE_CONNECT,
        title: 'Connect?'
      };
    },
  },
  {
    id: ServicesEnum.MYSQL,
    onStatus: (isActive) => {
      return isActive ? [ScriptsEnum.MYSQL_CONNECT] : [];
    },
    onStart: () => {
      return {
        scriptId: ScriptsEnum.MYSQL_CONNECT,
        title: 'Connect?'
      };
    },
  },
];
