setup:
	if [ ! -d ~/.config/nixpkgs ]; then mkdir -p ~/.config/nixpkgs; fi
	if [ ! -f ~/.config/nixpkgs/config.nix ]; then echo "{allowUnfree = true;}" >> ~/.config/nixpkgs/config.nix; fi

nix: setup
	nix-shell

setup_emulator:
	sudo chmod 777 $(ANDROID_HOME) -R
	sdkmanager "system-images;android-30;google_apis;x86"
	avdmanager create avd -f -n test_disp -k "system-images;android-30;google_apis;x86" --device "pixel_4_xl"

emulator:
	emulator @test_disp -gpu swiftshader_indirect

init: 
	npm install
	
start_dev:
	npx expo start 

start_prod:
	npx expo start --no-dev
