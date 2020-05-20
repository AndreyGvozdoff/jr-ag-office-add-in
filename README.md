# jr-ag-add-in

##How to generate office manifest.xml

npm install -g yo generator-office
cd jr-ag-office-add-in/jr-office-add-in
yo office

When prompted, provide the following information to create your add-in project:

Choose a project type: Office Add-in project containing the manifest only
What do you want to name your add-in? My Office Add-in
Which Office client application would you like to support? Excel,Word,PowerPoint

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

### Run your tests
```
npm run test
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

### Install the add-in's certificates
``` 
npx office-addin-dev-certs install
```
