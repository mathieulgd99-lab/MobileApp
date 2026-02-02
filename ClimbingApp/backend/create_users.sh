#!/bin/bash
set -e

node create_admin.js --email Admin --display-name "Admin" --pw "Admin" --role admin
node create_admin.js --email User1 --display-name "Uyen" --pw "User1"
node create_admin.js --email User2 --display-name "Than" --pw "User2"
node create_admin.js --email User3 --display-name "Cedric" --pw "User3"
node create_admin.js --email User4 --display-name "Binh" --pw "User4"
node create_admin.js --email User5 --display-name "Nhat Anh" --pw "User5"

echo "✅ Seed terminé"