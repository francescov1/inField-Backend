#!/bin/bash

vars=""

while read line; do
  if [[ $line != *"="* ]]; then
    continue
  fi

  # travis can only set one env var at a time
  varName="$(echo $line | cut -d'=' -f1)"
  varVal="$(echo $line | cut -d'=' -f2)"

  if [[ $varName == "NODE_ENV" ]]; then
    continue
  fi

  vars="$vars $line"

done <.env

prodVars="$vars NODE_ENV=production"
eb setenv $prodVars
