----
docker toolbox

`docker build -f Dockerfile.dev -t fgrdauth .`

`docker run --rm -p 4500:4500 --name fgr-budget-backend-v2_web_1 --network budget --env-file .env -e CHOKIDAR_USEPOLLING=true -v /app/node_modules  -v /c/Users/frank/OneDrive/Development/02_Projects_In_Production/0027_PersonalBudgetApp/fgr-budget-backend-v2:/app backendv2`

---
Required ENV VARS
```
DATABASE_URL=postgres://postgres:postgres@pg1:5432/local_fgr_budget
NODE_ENV=sandbox
PLAID_DEV_CLIENT_ID=<PLAID_DEV_CLIENT_ID>
SANDBOX_PLAID_SECRET=<SANDBOX_PLAID_SECRET>
PLAID_DEV_SECRET=<PLAID_DEV_SECRET>
FGR_BUDGET_WEBHOOK_URL=http://webhook_backend:3500
FGR_BUDGET_AUTH_URL=http://fgr_dynamic_auth_web_1:4000/
```