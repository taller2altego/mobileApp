# Mobile App

## Requerimientos
- [Nix](https://nix.dev/tutorials/install-nix)

## Como correrlo en emulador

Para entrar en la shell de nix:
```
make nix
```

Luego, crear el emulador en donde va a correr nuestra aplicacion.

Solo es necesario correr este comando si es la primera vez que buildamos la app:
```
make setup_emulator
```
> Aviso: Esto puede tardar un largo tiempo.

Una vez creado el emulador podemos correrlo con:
```
make emulator
```

Luego para instalar las dependencias necesarias:
```
make init
```

Para correr la aplicacion con expo:
```
make start
```

## Como correrlo en web

Para entrar en la shell de nix:
```
make nix
```

Instalamos las dependencias necesarias:
```
make init
```

Para correr la aplicacion con expo:
```
make start
```

Luego seleccionar la opcion _open web_
