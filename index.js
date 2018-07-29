exports.handler = function (event, context) {
	// event is the JS object sent by request
	// context is succeed & fail handling

	var request = event.request

	if (request.type === 'IntentRequest') {
		let options = {}
		options.speechText = "Welcome to Greetings skill. Using our skill you can greet your guests. Whom do you want to greet? For example, you can say, say hello to Susan"
		options.repromptText = "Whom do you want to greet? You can say, for example, say hello to John"
		options.endSession = false
		context.succeed(buildResponse(options))
	} else if (request.type === 'LaunchRequest') {

	} else if (request.type === 'SessionEndedRequest'){

	} else {
		context.fail("Unknown intent type")
	}
}

function buildResponse(options) {
	var response = {
		version: "1.0",
		response: {
			outputSpeech: {
				type: "PlainText",
				text: options.speechText
			},
			shouldEndSession: options.endSession
		}
	}

	if(options.repromptText) {
		response.response.reprompt = {
			outputSpeech: {
				type: "PlainText",
				text: options.repromptText
			}
		}
	}

	return response
}

console.log('... complete')
