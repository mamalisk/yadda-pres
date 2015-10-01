var Screen = require('../core/screens/screen.js'),
    ScreenElement = require('../core/screens/screenElement.js'),
    personas = require('../personas/personas'),
    PERMISSIONS = require('../personas/permissions'),
    username = personas.getUserWithPermissions(PERMISSIONS.ACCESS.AUTHORIZED).username,
    AgentConfiguration = require('../utils/config.js'),
    config = new AgentConfiguration(__dirname + '\\..\\').get();

var tiles = new Screen('tiles', [
    new ScreenElement('header', "//div[@data-test='quidget-header']")
]);

module.exports = new Screen('page',
    [
        new ScreenElement('addTileButton', "button[data-test='add-tile']"),
        new ScreenElement('mainMenuToggle', "[data-test='shell-menu-toggle']:enabled .icon-menu"),
        new ScreenElement('canvas', "[data-test='execution-app-panel']")
    ],
    [
        require('./topMenu'),
        require('./firstTile'),
        require('./swapTile'),
        require('./swapConfirmationTicket'),
        require('./confirmationTicket'),
        require('./supportMenu'),
        require('./settingsMenu'),
        tiles
    ])
    .withUrl(config.get('baseUrl') + '?user=' + username);