#!/bin/bash

deno run --allow-all scrape.ts > history/$(date +%s).json
date