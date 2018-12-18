# garage-builder
> You can also check version created in React here: [github.com/barthicus/react-garage-builder].

Simple garage builder based on vue.js and three where you can adjust width and length of construction.  
There is also option to change the number of garage gates.  
App skeleton was created with [vue-cli 3].

Demo online: [barthicus.github.io/vue-garage-builder]

#### Table of Contents
- [Tools used](#tools-used)
- [The most important files](#the-most-important-files)
- [Real app usage](#real-app-usage)
- [Project setup](#project-setup)

## Tools used
- Vue.js
- three.js
- Vuex (state management - optional)
- vue-i18n (multilang support - optional)

## The most important files

### src/libs/GarageBuilder.js
It is builder class that create garage model, perforates sheet and positions/merge every parts together.  
Every "builder" method return Object3D instance (from three.js) so library can be used in other JS frameworks.  
> TODO: Class probably should be refactored to subbuilder classes where everyone build own part.

### component/Preview.vue
Vue component that renders 3D garage preview.

### component/SceneHelpers.vue
Optional vue component that helps with lightining settings.
It isn't required but it was really helpful to adjust all parameters (ambient, fog, spotlight etc.).

## Real app usage
The full featured version of this app is deployed on [Taurustal] website.
It containes many other functionalities such as:
- change roof type
- change sheet (type of perforation, color/texture)
- possibility to add accessories (gutters, skylights, windows, doors)
- autogenerated product images (from every perspective - front, rear, left, right, general)
- order form

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

[github.com/barthicus/react-garage-builder]: <https://github.com/barthicus/react-garage-builder>
[vue-cli 3]: <https://cli.vuejs.org>
[Taurustal]: <http://taurustal.com/konfigurator>
[barthicus.github.io/vue-garage-builder]: <https://barthicus.github.io/vue-garage-builder>