#!/bin/bash
set -e

node create_admin.js --email A --display-name "Admin" --pw "A" --role admin
node create_admin.js --email B --display-name "User 1" --pw "B"
node create_admin.js --email C --display-name "User 2" --pw "C"
node create_admin.js --email D --display-name "User 3" --pw "D"
node create_admin.js --email E --display-name "User 4" --pw "E"

echo "✅ Seed terminé"