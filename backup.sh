#!/bin/bash

DATE=$(date +%F)

mysqldump -h ai-project-db.cp0ou62a6dom.ap-south-1.rds.amazonaws.com -u admin -padmin12345 ai_project > backup_$DATE.sql

aws s3 cp backup_$DATE.sql s3://ai-project-uploads-1/

rm backup_$DATE.sql
