#!/bin/bash
set -e

PROJECT_NAME="${1}"
DESCRIPTION="${2}"
AUTHOR_EMAIL="${3}"
AUTHOR_WEBSITE="${4}"
AUTHOR_NAME="${5}"

PROJECT_FOLDER="$(basename ${PWD})"

if [ ! ${#} -eq  5 ]
then
	echo "Usage: ${0} <project_name> <description> <author_email> <author_website> <author_name>"
	exit 1
fi

cordova create --link-to=www cordova_project com.matteomattei.${PROJECT_FOLDER} "${PROJECT_NAME}"
cd cordova_project
cordova platform add android
cordova plugins add https://github.com/wildabeast/BarcodeScanner.git

# setup config file
sed -i "{s#A sample Apache Cordova.*#${DESCRIPTION}#g}" config.xml
sed -i "{s#<author email=.*#<author email=\"${AUTHOR_EMAIL}\" href=\"${AUTHOR_WEBSITE}\">#g}" config.xml
sed -i "{s#Apache Cordova Team#${AUTHOR_NAME}#g}" config.xml
sed -i '$d' config.xml
cat >> config.xml <<EOF
    <icon height="512" src="www/images/icon/icon-512.png" width="512" />
    <icon cdv:platform="android" height="96" src="www/images/icon/icon-96.png" width="96" />
    <icon cdv:platform="blackberry" height="80" src="www/images/icon/icon-80.png" width="80" />
    <icon cdv:platform="ios" height="144" src="www/images/icon/icon-144.png" width="144" />
</widget>
EOF

cordova build
