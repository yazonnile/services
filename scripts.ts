import {ScriptsEnum, Script} from './types';

export const scripts: Readonly<Script>[] = [
  {
    id: ScriptsEnum.POSTGRE_CONNECT,
    command: 'pgcli objs -U user -W',
    description: 'connect to postgre',
  },
  {
    id: ScriptsEnum.MYSQL_CONNECT,
    command: 'mysql -uroot -p',
    description: 'connect to mysql',
  },
  {
    id: ScriptsEnum.GET_RANDOM_HEX,
    command: `hexdump -n 16 -e '4/4 "%08X" 1 "\n"' /dev/random`,
    description: 'generate random value',
    alwaysVisible: true,
  },
  {
    id: ScriptsEnum.GET_RANDOM_NUMBER,
    command: 'echo $((1 + $RANDOM % 10000))',
    description: 'generate random number',
    alwaysVisible: true,
  }
];