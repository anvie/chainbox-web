#!/usr/bin/env bash

set -e

rsync -avzrhcP \
  -e 'ssh -i ~/.ssh/id_ecdsa_sec' \
  --exclude=".git" --exclude=".next" \
  --exclude=".env" \
  --exclude="*.csv" \
  --exclude="data/" \
  --exclude="out/" \
  --exclude="etc/" \
  --exclude="public/image" \
  --exclude="node_modules" \
  --exclude="server/" \
  ./ root@$DEPLOY_SERVER:/home/www/chainbox-project

echo Building...
ssh -i ~/.ssh/id_ecdsa_sec root@$DEPLOY_SERVER /home/www/chainbox-project/build.sh
ssh -i ~/.ssh/id_ecdsa_sec root@$DEPLOY_SERVER chown -R www:www /home/www/chainbox-project
ssh -i ~/.ssh/id_ecdsa_sec root@$DEPLOY_SERVER sudo -u www pm2 restart chainbox-web
echo Done.


