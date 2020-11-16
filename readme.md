----
docker toolbox

`docker build -f Dockerfile.dev -t fgrdauth .`

`docker run --rm -p 4500:4500 --name fgr-budget-backend-v2_web_1 --network budget --env-file .env -e CHOKIDAR_USEPOLLING=true -v /app/node_modules  -v /c/Users/frank/OneDrive/Development/02_Projects_In_Production/0027_PersonalBudgetApp/fgr-budget-backend-v2:/app backendv2`