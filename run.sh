#!/bin/bash

mkdir -p history
deno run --allow-all scrape.ts > history/$(date +%s).json
date