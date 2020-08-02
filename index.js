import {NavbarPlugin, LayoutPlugin, ButtonPlugin, FormPlugin, CardPlugin, FormInputPlugin, BadgePlugin} from 'bootstrap-vue';

import "./style/common.scss";
import "./style/components/_navbar.scss";


Vue.use(NavbarPlugin);
Vue.use(LayoutPlugin);
Vue.use(ButtonPlugin);
Vue.use(FormPlugin);
Vue.use(FormInputPlugin);
Vue.use(BadgePlugin);
Vue.use(CardPlugin);

console.log("mounting: ");

new Vue({
    el: '#app',
    data: {
        message: 'Tiresia',
        picked : [],
        min : null,
        max : null,
    },
    methods : {
        flushPicked () {
          this.picked = [];
        },
        testSubmit (event) {
            event.preventDefault();
            if(this.picked.length === (this.max - this.min))
                return;
            let random;
            do
                random = Math.floor((Math.random() * (this.max-this.min))) + parseInt(this.min);
             while (this.picked.includes(random));
            this.picked.push(random);
        }
    }
});
