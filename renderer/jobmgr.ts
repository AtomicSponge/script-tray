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
import JobMgrApp from './JobMgr.vue'
import './style.css'

const app = createApp(JobMgrApp)
registerPlugins(app)
app.mount('#app')
