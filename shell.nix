{ pkgs ? import <nixpkgs> {config.android_sdk.accept_license = true;} }:

with pkgs;

mkShell {
  buildInputs = [ nodejs git];
  shellHook = '' 
    export ANDROID_SDK_ROOT=$HOME/Library/Android/Sdk
    export PATH=$PATH:~/.npm-global/bin:$ANDROID_SDK_ROOT/emulator:$ANDROID_SDK_ROOT/platform-tools
  '';
}