#!/bin/bash
ssh-keygen -t ed25519 -C "deploy@tautan" -f ~/.ssh/tautan_deploy_key -N ""
echo "Done! Key generated at ~/.ssh/tautan_deploy_key"
