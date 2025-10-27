# Justfile

debug := 'false'
define_flag := "-d DEBUG:" + if debug =~ 'true|false' {
  debug
} else {
  error('DEBUG must be "true" or "false"')
}

[default]
start: build
  bun run {{define_flag}} src/server.ts

[parallel]
watch: watchServer watchClientTs watchLess

watchServer:
  bun run --watch {{define_flag}} --no-clear-scren src/server.ts

watchClientTs:
  bun build {{define_flag}} --watch --outdir dist src/client.ts

watchLess:
  lessc-watch less/styles.less dist/styles.css

[parallel]
build: buildClientTs buildLess

buildClientTs:
  bun build {{define_flag}} --outdir dist src/client.ts

buildLess:
  lessc less/styles.less dist/styles.css

clean:
  rm -rf dist/*

tsc:
  tsc --noEmit

BUN_PATH := `which bun`

pm2 $PORT='5001': clean build
  -pm2 del tankanarchy
  pm2 start --interpreter {{BUN_PATH}} --interpreter-args='{{define_flag}}' \
    src/server.ts --name tankanarchy
