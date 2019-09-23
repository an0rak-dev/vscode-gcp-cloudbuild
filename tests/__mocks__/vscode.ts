const commands = {
   registerCommand: jest.fn()
};

const window = {
   createStatusBarItem: jest.fn()
};

const workspace = {
   rootPath: "master"
};

enum StatusBarAlignment {
   Left,
   Right
};

export {
   commands,
   window,
   StatusBarAlignment
};
