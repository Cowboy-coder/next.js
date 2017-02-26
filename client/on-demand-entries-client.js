/* global fetch, location */

import Router from '../lib/router'
import 'whatwg-fetch'

// Ping on every page change
const originalOnRouteChangeComplete = Router.onRouteChangeComplete
Router.onRouteChangeComplete = function (...args) {
  ping()
  if (originalOnRouteChangeComplete) originalOnRouteChangeComplete(...args)
}

async function ping () {
  try {
    const url = `/on-demand-entries-ping?page=${Router.pathname}`
    const res = await fetch(url)
    const payload = await res.json()
    if (payload.invalid) {
      location.reload()
    }
  } catch (err) {
    console.error(`Error with on-demand-entries-ping: ${err.message}`)
  }
}

async function runPinger () {
  while (true) {
    await new Promise((resolve) => setTimeout(resolve, 5000))
    await ping()
  }
}

runPinger()
  .catch((err) => {
    console.error(err)
  })
