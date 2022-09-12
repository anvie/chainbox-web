#/bin/sh

export NODE_OPTIONS=--openssl-legacy-provider

ganache-cli -d --db ./data/ganache --accounts 10 --deterministic --mnemonic "galaxy dark blue violin grocery attend give call dutch between fiction paddle evolve nature thought"


