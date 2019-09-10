const commands = {
   registerCommand: jest.fn()
};

const window = {
   createStatusBarItem: jest.fn()
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
