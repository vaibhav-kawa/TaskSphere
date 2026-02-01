@echo off
echo Starting TaskSphere locally...

echo Starting UserService...
start "UserService" cmd /k "cd backend\UserService\UserService && mvn spring-boot:run"

timeout /t 10

echo Starting TaskService...
start "TaskService" cmd /k "cd backend\TaskService\TaskService && mvn spring-boot:run"

timeout /t 10

echo Starting Frontend...
start "Frontend" cmd /k "cd frontend\client && npm run dev"

echo All services started!
pause