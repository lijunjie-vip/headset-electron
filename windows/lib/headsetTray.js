const debug = require('debug');
const { Menu } = require('electron');
const logFile = require('electron-log');

logFile.transports.file.level = true;
logFile.transports.console.level = false;

const isDebug = process.env.DEBUG.startsWith('headset');

const logger = debug('headset:tray');

const executeTrayCommand = (win, key) => {
  logger('Executing %o command from tray', key);
  if (isDebug) logFile.debug('Executing %o command from tray', key);
  win.webContents.executeJavaScript(`
    window.electronConnector.emit('${key}')
  `);
};

module.exports = (tray, win, player) => {
  logger('Setting tray');
  if (isDebug) logFile.info('Setting tray');

  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Minimize to tray',
      click: () => {
        logger('Minimizing to tray');
        if (isDebug) logFile.info('Minimizing to tray');

        win.isVisible() ? win.hide() : win.show();
        player.isVisible() ? player.hide() : player.show();
      },
    },
    { type: 'separator' },
    { label: 'Play/Pause', click: () => { executeTrayCommand(win, 'play-pause'); } },
    { label: 'Next', click: () => { executeTrayCommand(win, 'play-next'); } },
    { label: 'Previous', click: () => { executeTrayCommand(win, 'play-previous'); } },
    { type: 'separator' },
    { label: 'Like', click: () => { executeTrayCommand(win, 'like'); } },
    { type: 'separator' },
    { role: 'quit' },
  ]);

  tray.setToolTip('Headset');
  tray.setContextMenu(contextMenu);
};
