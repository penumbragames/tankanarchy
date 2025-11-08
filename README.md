# Tank Anarchy

Tank Anarchy is an online multiplayer tank battle arena game that takes place in
a single large world. Anyone who logs on can battle anyone else that's online at
the same time.

# Setting Up:

I am developing this project on node v20.19.5. This project uses
[`bun`](https://bun.com/) and [`justfile`](https://just.systems/man/en/) for
build/compilation.

```
npm install
just build
just start
```


# Creators:

- Alvin Lin (omgimanerd)
- Kenneth Li (noobbyte)

&copy; 2015 Penumbra Games


# TODO:
  - Separate input/render loop
  - animation frame refactor
  - refactor server side sound engine, Game server has a sound / particle service
  - hitbox debugging
  - custom cursor
  - rockets