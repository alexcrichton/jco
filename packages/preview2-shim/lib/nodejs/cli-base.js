// default is full permissions
let preopenCnt = 4;
export let _descriptors = {
  3: { type: 'directory', path: '/', parent: null, subpathTypes: {} }
};
let directories = [[3, '/']];

export function _getFullPath (fd) {
  let path = '';
  while (fd) {
    path = _descriptors[fd].path + path;
    fd = _descriptors[fd].parent;
  }
  return path;
}

export function _getDescriptorType (fd) {
  return _descriptors[fd].type;
}

export function _setDescriptorType (fd, type) {
  _descriptors[fd].type = type;
}

export function _setSubdescriptorType (fd, path, type) {
  while (_descriptors[fd].parent) {
    path = _descriptors[fd].path + path;
    fd = _descriptors[fd].parent;
  }
  _descriptors[fd].subpathTypes[path] = type;
}

export function _addOpenedDescriptor (fd, path, parentFd) {
  if (fd < preopenCnt || _descriptors[fd])
    throw 'bad-descriptor';
  let type = null;
  for (const [_path, _type] of Object.entries(_descriptors[parentFd].subpathTypes)) {
    if (_path === path)
      type = _type;
  }
  _descriptors[fd] = { path, type, parent: parentFd, subpathTypes: {} };
}

export function _removeOpenedDescriptor (fd) {
  if (fd < preopenCnt)
    throw 'eperm';
  delete _descriptors[fd];
}

export function _setPreopens (preopens) {
  _descriptors = {};
  directories = [,,];
  for (const [virtualPath, path] of Object.entries(preopens)) {
    _descriptors[preopenCnt] = { type: 'directory', path, parent: null, subpathTypes: {} };
    directories.push([preopenCnt++, virtualPath]);
  }
}

let _env;
export function _setEnv (envObj) {
  _env = Object.entries(envObj);
}

export const environment = {
  getEnvironment () {
    if (!_env) _setEnv(process.env);
    return _env;
  }
};

export const exit = {
  exit (status) {
    process.exit(status.tag === 'err' ? 1 : 0);
  }
};

export const preopens = {
  getDirectories () {
    return directories;
  }
}

export const stdin = {
  getStdin () {
    return 0;
  }
};

export const stdout = {
  getStdout () {
    return 1;
  }
};

export const stderr = {
  getStderr () {
    return 2;
  }
};
