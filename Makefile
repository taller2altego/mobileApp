DEVICE?=Pixel_4a_API_30

setup:
	npm install

start:
	$(HOME)/Android/Sdk/emulator/emulator -avd $(DEVICE) &
	npx expo start