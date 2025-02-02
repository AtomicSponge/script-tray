/**
 * 
 * @author Matthew Evans
 * @module script-tray
 * @see README.md
 * @copyright MIT see LICENSE.md
 * 
 */

import { createApp } from 'vue'
import { registerPlugins } from '../plugins'
import SettingsApp from './Settings.vue'
import './style.css'

const app = createApp(SettingsApp)
registerPlugins(app)
app.mount('#app')
