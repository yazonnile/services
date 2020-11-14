import * as prompts from 'prompts';
import {exec, execSync} from 'child_process';
import {scripts, ScriptsEnum} from './scripts';
import {ServicesEnum} from './services';
import {Choice} from './choices';
import {variables} from './variables';

const execCommand = async(scriptId: ScriptsEnum, prevStdout?: string) => {
  let {command: commandString, next: nextScriptId, variables: scriptVariables} = scripts[scriptId];

  // collect variables
  if (scriptVariables) {
    for (let i = 0; i < scriptVariables.length; i++) {
      const variable = variables[scriptVariables[i]];
      const {value} = await prompts({
        name: 'value',
        message: variable.id.toLowerCase().replace('_', ' '),
        style: 'default',
        ...variable,
        ...((i === 0 && prevStdout) ? { initial: prevStdout } : {})
      });

      commandString = commandString.replace(`{{$${i}}}`, value);
    }
  }

  if (!nextScriptId) {
    return execSync(commandString, {stdio: 'inherit'});
  }

  const stdout = execSync(commandString).toString().trim();
  console.log('Script result: ', stdout || 'no output');
  const {yes} = await prompts({
    type: 'toggle',
    name: 'yes',
    message: `Continue to "${scripts[nextScriptId].title}"?`,
    initial: false,
    active: 'yes',
    inactive: 'no'
  });

  if (yes) {
    return execCommand(nextScriptId, stdout);
  }
};

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
}).then(async(choices: Choice[]) => {
  const {value} = await prompts({
    type: 'select',
    name: 'value',
    message: 'Pick a script',
    choices,
  });

  return execCommand(value);
}).catch(() => {
  console.log('cancel');
});
