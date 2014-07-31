prodefficiency_supervisor
=========================

Production Efficiency Supervisor Mobile Application

Install all needed packages:
----------------------------

 - Android SDK
 - Cordova (via npm)

Create cordova project:
-----------------------

Clone project

```
$ git clone https://github.com/matteomattei/prodefficiency_supervisor.git
```

```
$ cordova create prodefficiency_supervisor
$ cd prodefficiency_supervisor
$ cordova platform add android
```


Install plugins:
----------------

```
cordova plugins add https://github.com/wildabeast/BarcodeScanner.git
```

Run it:
-------

```
$ cordova build
$ cordova serve android
```
