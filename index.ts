import * as prompts from 'prompts';
import {exec, execSync} from 'child_process';
import {Script, Service, Choice, ScriptsEnum, ServicesTypeEnum, ServicesEnum, ChoicesTypeEnum, ScriptChoiceValue, ServiceChoiceValue, HooksEnum, Hook} from './types';
import {scripts} from './scripts';
import {services} from './services';

const statusScripts = new Set<ScriptsEnum>();
const choices: Choice[] = [];
const servicesNames = Object.keys(ServicesEnum);

const buildServiceChoice = (service: Service, serviceType: ServicesTypeEnum): Choice => {
  const title: Choice['title'] = `${service.id} ${serviceType}`;
  const command: Choice['value']['command'] = `brew services ${serviceType} ${service.id}`;

  return {
    title,
    value: {
      id: service.id,
      choiceType: ChoicesTypeEnum.SERVICE,
      command,
      serviceType,
    },
    description: command
  };
};

const buildScriptChoice = (script: Script): Choice => {
  if (script.alwaysVisible) {
    statusScripts.add(script.id);
  }

  const title: Choice['title'] = script.id.toLowerCase();

  return {
    value: {
      id: script.id,
      command: script.command,
      choiceType: ChoicesTypeEnum.SCRIPT,
    },
    title,
    description: script.description || title
  };
};

const getHook = (service: Service, serviceType: ServicesTypeEnum): Hook => {
  switch(serviceType) {
    case ServicesTypeEnum.START:
      return typeof service[HooksEnum.START] === 'function' && service[HooksEnum.START]();
    case ServicesTypeEnum.STOP:
      return typeof service[HooksEnum.STOP] === 'function' && service[HooksEnum.STOP]();
  }
};

Promise.all(servicesNames.map((serviceName) => {
  // collect statuses
  return new Promise(async (resolve) => {
    const service = ServicesEnum[serviceName];
    exec(`brew services list | grep ${service}`, (error, stdout) => {
      if (!error) {
        resolve(!stdout.match(new RegExp(`${service}\\s+stopped`)));
      }
    });
  });
})).then((servicesStatuses: boolean[]) => {
  for (let i = 0; i < servicesStatuses.length; i++) {
    const service = services[i];
    const isActive = servicesStatuses[i];

    // build service choices
    if (isActive) {
      choices.push(buildServiceChoice(service, ServicesTypeEnum.STOP));
      choices.push(buildServiceChoice(service, ServicesTypeEnum.RESTART));
    } else {
      choices.push(buildServiceChoice(service, ServicesTypeEnum.START));
    }

    // build scripts by onStatus hook
    if (typeof service[HooksEnum.STATUS] === 'function') {
      choices.push(
        ...service[HooksEnum.STATUS](isActive).map((scriptId) => {
          return buildScriptChoice(scripts.find(({id}) => id === scriptId));
        })
      );
    }
  }

  // build default scripts choices
  choices.push(
    ...scripts
      .filter(({id, alwaysVisible}) => alwaysVisible && !statusScripts.has(id))
      .map(buildScriptChoice)
  );
}).then(() => {
  return prompts({
    type: 'select',
    name: 'value',
    message: 'Pick a service',
    choices
  });
}).then(async ({ value }: { value: ScriptChoiceValue | ServiceChoiceValue }) => {
  // collect commands to run
  if (value.choiceType === ChoicesTypeEnum.SCRIPT) {
    return [value.command];
  }

  const service = services.find(({id}) => id === value.id);
  const hook = getHook(service, value.serviceType);
  if (!hook) {
    return [value.command]
  }

  const {scriptId, title} = hook;
  const {yes} = await prompts({
    type: 'toggle',
    name: 'yes',
    message: title,
    initial: false,
    active: 'yes',
    inactive: 'no'
  });

  return yes ?
    [value.command, buildScriptChoice(scripts.find(({id}) => scriptId === id)).value.command] :
    [value.command];
}).then(([command, hookCommand]) => {
  if (!hookCommand) {
    return execSync(command, {stdio: 'inherit'});
  }

  exec(command, (error) => {
    if (!error) {
      setTimeout(() => {
        execSync(hookCommand, {stdio: 'inherit'});
      }, 1000);
    }
  });
}).catch(() => {

});

// handle ctrl+C

