rm -f data/anime-offline-database.json
wget -P ./data https://raw.githubusercontent.com/manami-project/anime-offline-database/master/anime-offline-database.json
node data/update.js
node data/import.js
redis-cli --scan --pattern anime:* | xargs redis-cli unlink
git pull origin master -X theirs
git add . && git commit -m "DB update" && git push origin master
