BUILDING APK/AAB (Android) and IPA (iOS) - Instructions
-------------------------------------------------------

Important: I cannot create signed production builds here because building signed iOS apps and uploading
signed Android AABs/APKs requires credentials (Android keystore, Apple Developer account credentials)
and/or cloud build services. Below I provide fully detailed instructions and CI workflows so you can
produce the final binaries yourself or via GitHub Actions / Expo EAS.

Option A — Quick cloud build with Expo EAS (recommended)
1. Install expo-cli and eas-cli:
   npm install -g expo-cli eas-cli

2. Log in to your Expo account (create one if needed):
   expo login
   eas login

3. From project root:
   cd frontend
   npm install

4. Configure your project bundle identifiers in frontend/app.json:
   - android.package -> com.yourorg.tournamentmanager
   - ios.bundleIdentifier -> com.yourorg.tournamentmanager

5. To build Android AAB (recommended for Play Store):
   eas build -p android --profile production

   Or to build a debug APK:
   eas build -p android --profile preview

6. To build iOS (requires Apple Developer account):
   eas build -p ios --profile production
   Follow eas-cli prompts to provide credentials or let EAS manage them.

7. After the build completes, download the artifact from EAS and submit to the stores.

Option B — GitHub Actions (CI) + EAS (trigger builds from CI)
I've included example GitHub Actions workflows which call EAS CLI. You'll need to:
- Create a GitHub repository, push this project.
- Add the following repository secrets:
  - EXPO_TOKEN (obtain with `expo login` + `expo token:generate`)
  - EAS_ACCESS_TOKEN (from `eas token:create`)
  - For Android signing (if using your own keystore): ANDROID_KEYSTORE_BASE64 (base64 of .jks), ANDROID_KEYSTORE_PASSWORD, ANDROID_KEY_ALIAS, ANDROID_KEY_PASSWORD
  - For iOS: APPLE_ID, FASTLANE_SESSION or APPLE_APP_SPECIFIC_PASSWORD, and optionally APPLE_TEAM_ID and FASTLANE_API_KEY (JSON) for automation.

CI workflows are in .github/workflows/ — see files android-build.yml and ios-build.yml.

Option C — Local native builds (advanced)
- Android: eject from Expo (expo prebuild) to get android/ folder, then use ./gradlew assembleRelease with your keystore.
- iOS: eject and open ios/ in Xcode, manage signing with your Apple account.

Notes about signing:
- Android: generate a keystore:
  keytool -genkey -v -keystore upload-keystore.jks -keyalg RSA -keysize 2048 -validity 10000 -alias upload
  Then base64 it for CI:
  base64 upload-keystore.jks | pbcopy
  Store the output in ANDROID_KEYSTORE_BASE64 secret.

- iOS: you must have an Apple Developer account, App ID, provisioning profile, and certificates. EAS can manage profiles for you.

Files added:
- frontend/app.json
- frontend/eas.json
- .github/workflows/android-build.yml
- .github/workflows/ios-build.yml
- BUILD_INSTRUCTIONS.md

If you want, I can:
- generate a debug Android APK locally (unsigned or debug-signed) and provide it for download (no Play Store release), OR
- create the CI workflows now and a script to upload your keystore to the repo secrets.

Tell me which you prefer and I'll proceed: generate a debug APK here, or prepare CI + instructions (already added), or guide you step-by-step to publish to Play Store and App Store.
