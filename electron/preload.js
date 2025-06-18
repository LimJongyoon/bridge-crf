const { contextBridge } = require('electron');

// Expose empty API (you can expand this later)
contextBridge.exposeInMainWorld('api', {});
