#! /usr/bin/env bash
deno test --allow-all tests
pushd om-tests
./doloop.sh
popd
