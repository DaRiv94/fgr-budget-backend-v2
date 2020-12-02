

# FGR Budget Backend

[<img src="./images/1000x1000_FGR_FINANCE.png" width="100" >](https://fgr-kubernetes-demo.northcentralus.cloudapp.azure.com)

This is the backend microservice used in the [Kubernetes Demo](https://frankieriviera.com/portfolio/kubernetes-demo) by [Frankie Riviera](https://frankieriviera.com)


# Develpment

## Getting Started

### Environment Variables

Example .env
```
DATABASE_URL=<DATABASE_URL>
NODE_ENV=sandbox
PLAID_DEV_CLIENT_ID=<PLAID_DEV_CLIENT_ID>
SANDBOX_PLAID_SECRET=<SANDBOX_PLAID_SECRET>
PLAID_DEV_SECRET=<PLAID_DEV_SECRET>
FGR_BUDGET_WEBHOOK_URL=<FGR_BUDGET_WEBHOOK_URL>
FGR_BUDGET_AUTH_URL=<FGR_BUDGET_AUTH_URL>
```

**DATABASE_URL** The connection_string to your Postgres SQL database. If you are are [fgr-budget-webhook-v2](https://github.com/DaRiv94/fgr-budget-webhook-v2) this is defaulted to `DATABASE_URL=postgres://postgres:postgres@pg1:5432/local_fgr_budget`

**NODE_ENV** is set as *sandbox* to call the sandbox Plaid API. Any other value would result in making a call to get transactions and accounts of "live" bank data

**PLAID_DEV_CLIENT_ID** This is used for the Plaid API to identify you when making calls to the Plaid API. You can get a Client ID and your secrets when you sign up for an account at https://plaid.com/

**SANDBOX_PLAID_SECRET** This is used to authorize access to Plaid Sandbox API. You can get a Client ID and your secrets when you sign up for an account at https://plaid.com/

**FGR_BUDGET_WEBHOOK_URL** Url to connect to [fgr-budget-webhook-v2](https://github.com/DaRiv94/fgr-budget-webhook-v2) in order immediatly get transactions from Plaid API

**FGR_BUDGET_AUTH_URL** Url to connect to the [fgr-dynamic-auth-service](https://github.com/DaRiv94/fgr_dynamic_auth) user authentication and authorization


---
### NOTE TO SELF When Developing with Windows 10 Home
Docker Toolbox does not play nice with docker-compose, so when I am developing with a windows 10 Home machine use the following cmds to start the backend service like so...

`docker run --rm -p 4500:4500 --name fgr-budget-backend-v2_web_1 --network budget --env-file .env -e CHOKIDAR_USEPOLLING=true -v /app/node_modules  -v /c/Users/frank/OneDrive/Development/02_Projects_In_Production/0027_PersonalBudgetApp/fgr-budget-backend-v2:/app dariv94/kubebud_backend`
