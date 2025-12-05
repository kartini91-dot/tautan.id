#!/bin/bash
# SSH Key Generation Script
# This script generates an SSH key for deployment

ssh_dir="$HOME/.ssh"
key_path="$ssh_dir/tautan_deploy_key"

# Create .ssh directory if it doesn't exist
mkdir -p "$ssh_dir"
chmod 700 "$ssh_dir"

# Generate key if it doesn't exist
if [ ! -f "$key_path" ]; then
    echo "Generating SSH key..."
    ssh-keygen -t ed25519 -C "deploy@tautan" -f "$key_path" -N ""
    chmod 600 "$key_path"
    echo "✓ SSH key generated at $key_path"
else
    echo "✓ SSH key already exists at $key_path"
fi

# Display public key
echo ""
echo "Public key content (add to server ~/.ssh/authorized_keys):"
echo "=================================================="
cat "$key_path.pub"
echo "=================================================="
echo ""
echo "Private key is at: $key_path"
echo "KEEP THIS PRIVATE - DO NOT SHARE!"
