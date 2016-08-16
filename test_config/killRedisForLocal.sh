echo "kill local redis servers"
lsof -i tcp:6379 | awk 'NR!=1 {print $2}' | xargs kill 
