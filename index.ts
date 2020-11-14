import * as prompts from 'prompts';
import {exec, execSync} from 'child_process';
import {scripts} from './scripts';
import {ScriptsEnum, ServicesEnum} from './enums';
import {Choice} from './types';
import {variables} from './variables';

// check services statuses
Promise.all(Object.keys(ServicesEnum).map((serviceId) => {
  return new Promise(async (resolve) => {
    const service = ServicesEnum[serviceId];
    exec(`brew services list | grep ${service}`, (error, stdout) => {
      if (!error) {
        resolve(
          !stdout.match(new RegExp(`${service}\\s+stopped`)) && service
        );
      }
    });
  });
})).then((services: (ServicesEnum|null)[]) => {
  const activeServices = services.filter(Boolean);
  return Object.values(scripts).filter(({onServicesStatus}) => {
    return !onServicesStatus || onServicesStatus(activeServices);
  }).map(script => {
    return {
      title: script.title,
      value: script.id,
      description: JSON.stringify(script.command),
    };
  });
}).then((choices: Choice[]) => {
  return prompts({
    type: 'select',
    name: 'value',
    message: 'Pick a script',
    choices,
  });
}).then(async({value}: {value: ScriptsEnum}) => {
  let {command, output, variables: scriptVariables} = scripts[value];

  // collect variables
  if (scriptVariables) {
    for (let i = 0; i < scriptVariables.length; i++) {
      const variable = variables[scriptVariables[i]];
      const {value} = await prompts({
        name: 'value',
        message: variable.id.toLowerCase().replace('_', ' '),
        style: 'default',
        ...variable
      });

      command = command.replace(`{{$${i}}}`, value);
    }
  }

  return {command, output};
}).then(({command, output}) => {
  if (!output) {
    return execSync(command, {stdio: 'inherit'});
  }

  exec(command, (error, stdout) => {
    if (!error) {
      console.log(JSON.stringify(stdout), output);
    }
  });
}).catch(() => {
  console.log('cancel');
});
