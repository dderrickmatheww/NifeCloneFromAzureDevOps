# Nife Mobile Application

# [![Build Status](https://dev.azure.com/iceboxdevelopment/Nife/_apis/build/status/Nife?branchName=master)](https://dev.azure.com/iceboxdevelopment/Nife/_build/latest?definitionId=3&branchName=master)

## [Andriod]()

## [Apple]()

## Getting started

### Installation
* Install [expo-cli](https://docs.expo.dev/workflow/expo-cli/) by running `npm install -g expo-cli`
* Clone the [Nife](https://dev.azure.com/iceboxdevelopment/Nife/_git/Nife) repository; this repository hosts all UI components for the Nife mobile application.
* Within the `Nife` repository, change directory to `ReactNativeCore/` within the chosen terminal and run `npm install`
* Clone the [NifeCloud](https://dev.azure.com/iceboxdevelopment/Nife/_git/NifeCloud) repository; this repository hosts all web services for the Nife mobile application.
* Within the `NifeCloud` repository, change directory to `functions/` within the chosen terminal and run `npm install`.
* Download the [Expo](https://docs.expo.dev/get-started/installation/) Go mobile application from the [Andriod Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent) or [iOS App Store](https://apps.apple.com/app/expo-go/id982107779)

### Running the development server
The development server is stood up when wanting to test new development on the Nife mobile application. There are two servers that need to be stood up to make sure
the Nife app runs locally.
#### NifeCloud  
* Within the `functions/` directory, run `npm install`
* Run `npm run start` to start the local server for Nife web services
#### Nife
* Within the `ReactNativeCore/` directory, run `npm install`
* Run `expo start -c` to start the local server using [Expo](https://docs.expo.dev/get-started/create-a-new-app/#starting-the-development-server)
* For Apple users, use the camera app to scan the QR code produced in the browser or within the terminal
* For Android users, use the Expo app to scan the QR code produced in the browser or within the terminal

### Submitting builds to the App stores

#### iOS App Store
* `eas build:ios`
* `eas submit:ios`

#### Google Play Store
* `eas build:andriod`
* `eas submit:andriod`