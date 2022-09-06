## Mobile App

## Requerimientos
- [Nix](https://nix.dev/tutorials/install-nix)
- [Android Studio](https://developer.android.com/studio)
- [Virtual Device](https://docs.expo.dev/workflow/android-studio-emulator/#step-2-set-up-a-virtual-device)

## Como correrlo

Para entrar en la shell con nix:
```
nix-shell
```

Instalar dependencias:
```
make setup
```

Para correr la aplicacion con expo:
```
make start DEVICE=<nombre-dispositivo>
```

Para obtener el nombre del dispositivo emulado correr `HOME/Android/Sdk/emulator/emulator -list-avds` o usar la ruta en donde se instalo Android Studio.