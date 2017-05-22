#!/usr/bin/env node
// Core
const path = require('path')
const express = require('express')
const app = express()
const server = require('http').Server(app)
const cors = require('cors')
const bodyParser = require('body-parser')
const store = require('store')

const run = (config, args) => {
  // Setting some middlewares
  app.use(cors())
  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({ extended: true }))
  // Config Graves
  config.graves.forEach(graveAlias => {
    // Setup Grave store
    const graveStore = require('store')
    // Require the module
    const graveName = `rip-grave-${graveAlias}`
    const gravePath = path.resolve(`./node_modules/${graveName}`)
    const grave = require(gravePath)
    // Calls Grave factory
    grave.factory(graveStore, 10)
    // Apply the router to the app
    app.use(`/${graveAlias}`, grave.make(graveStore))
    // Set the main store
    store.set(grave, graveStore)
    console.log(`- Adding "${graveAlias}" grave.`)
  })
  // Port Settings
  const port = args.port ? args.port : 3001
  // Listening
  server.listen(port)
  console.log(`💀  Running RIP on port ${port}`)
}

module.exports = { run }
