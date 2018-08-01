'use strict'

var http = require('http')

exports.handler = function(event, context){
	try {
		var request = event.request

		if (request.type === 'LaunchRequest') {
			let options = {}
			options.speechText = "Welcome to Uncle Rusty's Greetings skill. This skill greets your guests. Who shall we greet today? You can say, say hello to Bob?"
			options.repromptText = "Whom shall we greet today? You can say, for example, say hello to Sally."
			options.endSession = false
			context.succeed(buildResponse(options))
		} else if (request.type === 'IntentRequest') {
			let options =	{}
			if (request.intent.name === 'HelloIntent') {
				let name = request.intent.slots.FirstName.value
				options.speechText = "Hello " + name + ". "
        options.speechText += getWish()
        getQuote(function (quote, error) {
          if (err) {
            context.fail(err)
          } else {
            options.speechText += quote
            options.endSession = true
            context.succeed(buildResponse(options))
          }
        })
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

function getQuote(callback) {
  var url = "http://api.forismatic.com/api/1.0/json?method=getQuote&lang=en&format=json"

  var request = http.get(url, function(response) {
    var body = ""

    response.on('data', function(chunk) {
      body += chunk
    })

    response.on('end', function() {
      body = body.replace(/\\/g,'') // remove extra escape character
      var quote = JSON.parse(body)
      callback(quote.quoteText)
    })
  })

  request.on('error', function(error){
    callback('', err)
  })
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

function buildResponse (options) {
	var response = {
		version: '1.0',
		response: {
			outputSpeech: {
				type: 'PlainText',
				text: options.speechText
			},
			shouldEndSession: options.endSession
		}
	}

	if (options.respromptText) {
		response.response.reprompt = {
			type: "PlainText",
			text: options.repromptText
		}
	}

	return response
}


console.log('... end of script')
