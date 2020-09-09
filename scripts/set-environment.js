#!/bin/node
const fs = require("fs")
const env = process.argv[2]
let envFile = require(`../envs/${env}.json`)
if (envFile.android_properties) {
	let properties = ""
	const propFile = fs.readFileSync("android/gradle.properties").toString()
	const propJson = propFile.split('\n').reduce((obj, curr) => {
		if (curr.match(/\=/)) {
			const str = curr.split('=')
			obj[str[0]] = str[1]
		}
		return obj
	}, {})
	if (propJson.APP_ID === envFile.android_properties.APP_ID) {
		envFile.android_properties.DEBUG_VERSION_CODE = propJson.DEBUG_VERSION_CODE
		envFile.android_properties.DEBUG_VERSION_NAME = propJson.DEBUG_VERSION_NAME
		envFile.android_properties.VERSION_CODE = propJson.VERSION_CODE
		envFile.android_properties.VERSION_NAME = propJson.VERSION_NAME
	}
	for (const key in envFile.android_properties) {
		properties += `${key}=${envFile.android_properties[key]}\n`
	}
	fs.writeFileSync("android/gradle.properties", properties)
}
fs.writeFileSync("env.json", JSON.stringify(envFile.app, undefined, 2))
fs.writeFileSync(`envs/${env}.json`, JSON.stringify(envFile, undefined, 2))