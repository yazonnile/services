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
  },
  {
    id: ScriptsEnum.ZSHRC_EDIT,
    command: 'code -r /Users/USER_NAME/.zshrc',
    description: 'edit .zshrc file',
    alwaysVisible: true,
  },
  {
    id: ScriptsEnum.HOSTS_EDIT,
    command: 'code -r /etc/hosts',
    description: 'edit hosts file',
    alwaysVisible: true,
  }
];
