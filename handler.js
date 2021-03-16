require("isomorphic-fetch")
const Sentry = require("@sentry/serverless")

Sentry.AWSLambda.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 1.0,
})

// Allow for specifying array values in query parameters with [] syntax
const parseGetParam = param => {
  if (typeof param === "string" && param.match(/\[.*\]/g)) {
    return param.slice(1, param.length - 1).split(",")
  }
  return param
}

exports.handler = Sentry.AWSLambda.wrapHandler(async event => {
  console.log(JSON.stringify(event))

  let params = {}
  if (event.httpMethod === "POST") {
    params = JSON.parse(event.body)
  } else {
    const { queryStringParameters: qsParams } = event
    params = Object.keys(qsParams)
      .map(k => ({ [k]: parseGetParam(qsParams[k]) }))
      .reduce((acc, curr) => ({ ...acc, ...curr }), {})
  }

  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Credentials": true,
    "Content-Type": "application/json",
  }
  const base = process.env.AIRTABLE_BASE
  const table = process.env.AIRTABLE_TABLE
  const key = process.env.AIRTABLE_KEY

  return await fetch(
    `https://api.airtable.com/v0/${base}/${table}/?api_key=${key}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ fields: params }),
    }
  )
    .then(res => res.json())
    .then(data => {
      console.log(data)
      return "error" in data
        ? {
            statusCode: 500,
            body: JSON.stringify({ message: "Error" }),
            headers,
          }
        : {
            statusCode: 200,
            body: JSON.stringify({ message: "Success" }),
            headers,
          }
    })
    .catch(err => {
      console.error(err)
      return {
        statusCode: 500,
        body: JSON.stringify({ message: "Error" }),
        headers,
      }
    })
})
