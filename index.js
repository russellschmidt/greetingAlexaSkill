'use strict'

exports.handler = function(event, context){
	try {
		var request = event.request

		if (request.type === 'LaunchRequest') {
			let options = {}
			options.speechText = "Welcome to Uncle Rusty's Greetings skill. This skill greets your guests. Who shall we greet today? You can say, say hello to Bob?"
			options.repromptText = "Whom shall we greet today? You can say, for example, say hello to Sally."
			options.endSession = false
			options.succeed(buildResponse(options))
		} else if (request.type === 'IntentRequest') {
			let options =	{}
			if (request.intent.name === 'HelloIntent') {
				let name = request.intent.slots.FirstName.value
				options.speechText = "Hello " + name + ". "
				options.speechText += getWish()
				options.endSession = true
				options.succeed(buildResponse(options))
			} else {
				throw "unknown intent"
			}
		} else if (request.type === "SessionEndedRequest") {
			
		}	else {
			throw "Unknown intent type"
		}
	} catch (err) {
		context.fail("Exception: " + err)
	}
}

function getWish () {
	var currentDate = new Date()
	var hours = currentDate.getUTCHours() - 8
	if (hours < 0) {
		hours = hours + 24
	}

	if (hours < 12) {
		return "Good morning."
	} else if (hours < 18) {
		return "Good afternoon."
	} else {
		return "Good evening."
	}
}


console.log('... end of script')
