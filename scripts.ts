import {ScriptsEnum, ServicesEnum, VariablesEnum} from './enums';
import {Script} from './types';

export const scripts: Record<ScriptsEnum, Script> = {
  [ScriptsEnum.POSTGRE_START]: {
    id: ScriptsEnum.POSTGRE_START,
    title: 'start postgre',
    command: 'brew services start postgresql@12',
    next: ScriptsEnum.POSTGRE_CONNECT,
    onServicesStatus: (activeServices) => !activeServices.includes(ServicesEnum.POSTGRE),
  },
  [ScriptsEnum.POSTGRE_RESTART]: {
    id: ScriptsEnum.POSTGRE_RESTART,
    title: 'restart postgre',
    command: 'brew services restart postgresql@12',
    onServicesStatus: (activeServices) => activeServices.includes(ServicesEnum.POSTGRE),
  },
  [ScriptsEnum.POSTGRE_STOP]: {
    id: ScriptsEnum.POSTGRE_STOP,
    title: 'stop postgre',
    command: 'brew services stop postgresql@12',
    onServicesStatus: (activeServices) => activeServices.includes(ServicesEnum.POSTGRE),
  },
  [ScriptsEnum.POSTGRE_CONNECT]: {
    id: ScriptsEnum.POSTGRE_CONNECT,
    title: 'connect to postgre',
    command: 'pgcli objs -U user -W',
    onServicesStatus: (activeServices) => activeServices.includes(ServicesEnum.POSTGRE),
  },
  [ScriptsEnum.MYSQL_START]: {
    id: ScriptsEnum.MYSQL_START,
    title: 'start mysql',
    command: 'brew services start mysql@5.7',
    next: ScriptsEnum.MYSQL_CONNECT,
    onServicesStatus: (activeServices) => !activeServices.includes(ServicesEnum.MYSQL),
  },
  [ScriptsEnum.MYSQL_RESTART]: {
    id: ScriptsEnum.MYSQL_RESTART,
    title: 'restart mysql',
    command: 'brew services restart mysql@5.7',
    onServicesStatus: (activeServices) => activeServices.includes(ServicesEnum.MYSQL),
  },
  [ScriptsEnum.MYSQL_STOP]: {
    id: ScriptsEnum.MYSQL_STOP,
    title: 'stop mysql',
    command: 'brew services stop mysql@5.7',
    onServicesStatus: (activeServices) => activeServices.includes(ServicesEnum.MYSQL),
  },
  [ScriptsEnum.MYSQL_CONNECT]: {
    id: ScriptsEnum.MYSQL_CONNECT,
    title: 'connect to mysql',
    command: 'mysql -uroot -p',
    onServicesStatus: (activeServices) => activeServices.includes(ServicesEnum.MYSQL),
  },
  [ScriptsEnum.RANDOM_HEX_GET]: {
    id: ScriptsEnum.RANDOM_HEX_GET,
    title: 'generate random HEX value',
    command: `hexdump -n {{$0}} -e '4/4 "%08X" 1 "\n"' /dev/random | pbcopy && pbpaste`,
    variables: [VariablesEnum.HEX_LENGTH],
  },
  [ScriptsEnum.RANDOM_NUMBER_GET]: {
    id: ScriptsEnum.RANDOM_NUMBER_GET,
    title: 'generate random number',
    command: 'echo $(({{$0}} + $RANDOM % {{$1}})) | pbcopy && pbpaste',
    variables: [VariablesEnum.NUMBER_FROM, VariablesEnum.NUMBER_TO],
  },
  [ScriptsEnum.ZSHRC_EDIT]: {
    id: ScriptsEnum.ZSHRC_EDIT,
    title: 'edit .zshrc file',
    command: 'code -r /Users/slavaz/.zshrc',
  },
  [ScriptsEnum.HOSTS_EDIT]: {
    id: ScriptsEnum.HOSTS_EDIT,
    title: 'edit hosts file',
    command: 'code -r /etc/hosts',
  },
  [ScriptsEnum.PROCESS_ID_GET_BY_PORT]: {
    id: ScriptsEnum.PROCESS_ID_GET_BY_PORT,
    title: 'PID by port',
    command: `lsof -ti:{{$0}} | pbcopy && pbpaste`,
    variables: [VariablesEnum.LOCAL_PORT],
    next: ScriptsEnum.PROCESS_KILL_BY_PID,
  },
  [ScriptsEnum.PROCESS_KILL_BY_PID]: {
    id: ScriptsEnum.PROCESS_KILL_BY_PID,
    title: 'kill process by PID',
    command: 'kill -9 {{$0}}',
    variables: [VariablesEnum.PROCESS_ID],
  },
};
