# Serverless Airtable Button

Generate records in Airtable from GET or POST requests with field parameters.

## Setup

You'll need [Node](https://nodejs.org/en/) and the [Serverless CLI](https://serverless.com/) installed as well as an [Airtable](https://airtable.com/) account.

Copy `.env.sample` to `.env` and fill in your Airtable credentials and an email to receive error notifications in `SNS_EMAIL`.

Install dependencies and deploy to AWS with:

```bash
npm install
serverless deploy
```

Once the function is done deploying, it will output an API Gateway endpoint you can use to submit requests.
