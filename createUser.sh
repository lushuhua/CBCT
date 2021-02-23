#!/bin/bash
echo "第1个参数$1"
curl -H "Content-Type:application/json" -H "Data_Type:msg" -X POST --data "{\"username\": \"$1\", \"password\": \"123456\"}" http://localhost:3003/curie-api/user/signup

