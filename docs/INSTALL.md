# Expired — installable web app

Everything in this folder is the whole app. It runs entirely on the phone: photos never leave the device.

```
index.html             the app
manifest.webmanifest   name, icons and colours used when it's installed
sw.js                  offline support (caches the app after the first visit)
icons/                 home-screen icons for iPhone and Android
favicon.png            browser tab icon
```

## 1. Put it online (free, about 5 minutes)

It must be served over **https**, which all of these do automatically. Pick one:

**Netlify Drop (easiest, no account needed to try)**
1. Go to app.netlify.com/drop on a computer.
2. Drag this whole `expired-app` folder onto the page.
3. You get a link like `https://something.netlify.app`. Create a free account to keep it and choose a nicer name.

**GitHub Pages**
1. Create a new public repository and upload the contents of this folder (not the folder itself).
2. Settings → Pages → Source: "Deploy from a branch", branch `main`, folder `/ (root)`.
3. Your app appears at `https://<username>.github.io/<repository>/` after a minute or two.

**Vercel or Cloudflare Pages** also work: import the folder as a static site with no build step.

## 2. Install it on your phone

**iPhone (Safari)**
1. Open your link in Safari.
2. Tap the Share button, then **Add to Home Screen**, then **Add**.
3. Open Expired from the home screen. It runs full screen, like a normal app.

**Android (Chrome)**
1. Open your link in Chrome.
2. Tap **Install app** when prompted, or the ⋮ menu → **Install app** / **Add to Home screen**.

After the first visit it works offline.

## Saving photos

- **Phone:** tap **Save photo**, then **Save Image** in the share sheet to put it in Photos or Gallery. You can also send it straight to another app.
- **Computer:** the photo downloads as a JPEG.
- If neither is available, the finished photo opens on screen: press and hold it to save.

## Updating the app

Replace `index.html` (or any file) on your host. To make sure installed copies pick up the change right away, also bump the cache name at the top of `sw.js`, for example `expired-v1` → `expired-v2`. Installed apps update the next time they're opened online.

## Next step: App Store and Google Play

This same folder can be wrapped with Capacitor (capacitorjs.com) to make real store apps:

1. `npm init @capacitor/app` and point its web directory at this folder.
2. `npx cap add ios` and `npx cap add android`.
3. Add the Camera/Photos and Filesystem/Share plugins for native photo picking and saving.
4. Build in Xcode (needs a Mac) and Android Studio, then submit with an Apple Developer account and a Google Play Console account.

The store versions will also need: photo-library permission text, a short privacy policy (everything stays on the device, so it's simple), store screenshots and a description.
