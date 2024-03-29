import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import { MotionPlugin } from '@vueuse/motion'
import './index.css'
import { createAuth0 } from '@auth0/auth0-vue'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import {
    faUser,
    faGear,
    faPingPongPaddleBall,
    faFeed,
    faRankingStar,
    faDoorOpen
} from '@fortawesome/free-solid-svg-icons'

/* add icons to the library */
library.add(faUser, faGear, faUser, faPingPongPaddleBall, faFeed, faRankingStar, faDoorOpen)

const app = createApp(App)
app.component('font-awesome-icon', FontAwesomeIcon)

app.use(createPinia())
app.use(router).use(
    createAuth0({
        domain: import.meta.env.VITE_AUTH0_DOMAIN,
        clientId: import.meta.env.VITE_AUTH0_CLIENT_ID,
        authorizationParams: {
            redirect_uri: import.meta.env.VITE_AUTH0_CALLBACK_URL
        }
    })
)
app.use(MotionPlugin)
app.mount('#app')
