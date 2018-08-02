'use strict'

var http = require('http')
var audio = "<audio src='https://s3-us-west-2.amazonaws.com/att-news-quiz/audio/att_short_alexa.mp3' />"

exports.handler = function(event, context){
	try {
    var request = event.request
    var session = event.session
    if(!event.session.attributes){
      event.session.attributes = {}
    }

		if (request.type === 'LaunchRequest') {
      handleLaunchRequest(context)
		} else if (request.type === 'IntentRequest') {
      if (request.intent.name === 'HelloIntent') {
        handleHelloIntent(request, context)
      } else if (request.intent.name === 'QuoteIntent') {
        handleQuoteIntent(request, context, session)
      } else if (request.intent.name === 'NextQuoteIntent') {
        handleNextQuoteIntent(request, context, session)
      } else if (request.intent.name === 'AMAZON.YesIntent' && (session.attributes.quoteIntent === true)) {
        handleNextQuoteIntent(request, context, session)
      } else if (request.intent.name === 'AMAZON.StopIntent' || request.intent.name === 'AMAZON.CancelIntent' ) {
        context.succeed(buildResponse({
          speechText: "Good bye. ",
          endSession: true
        }))
      } else {
        throw "unknown intent"
      }
		} else if (request.type === "SessionEndedRequest") {
			// something
		}	else {
			throw "Unknown intent type"
		}
	} catch (err) {
		context.fail("Exception: " + err)
	}
}

function handleLaunchRequest(context) {
  let options = {}
  options.speechText = audio
  options.speechText += "Welcome to the A.T and T. news quiz. This skill greets your guests. Who shall we greet today? You can say, <emphasis level='strong'>say hello to Bob</emphasis>."
  options.repromptText = "Whom shall we greet today? You can say, for example, say hello to Sally."
  options.endSession = false
  context.succeed(buildResponse(options))
}

function handleHelloIntent(request, context) {
  let options =	{}
  let name = request.intent.slots.FirstName.value
  options.speechText = `Hello, ${name}, spelled <say-as interpret-as="spell-out">${name}</say-as>. I love you. `
  options.speechText += getWish()
  getQuote(function (quote, error) {
    if (error) {
      context.fail(error)
    } else {
      options.speechText += quote
      options.endSession = true
      context.succeed(buildResponse(options))
    }
  })
}

function handleQuoteIntent(request, context, session) {
  let options =	{}
  options.session = session

  getQuote(function (quote, error) {
    if (error) {
      context.fail(error)
    } else {
      options.speechText += quote
      options.speechText += " Do you want to hear one more quote?. "
      options.speechText += "You can say yes or one more. "
      options.session.attributes.quoteIntent = true
      options.endSession = false
      context.succeed(buildResponse(options))
    }
  })
}

function handleNextQuoteIntent(request, context, session) {
  let options =	{}
  options.session = session

  if (session.attributes.quoteIntent) {
    getQuote(function (quote, error) {
      if (error) {
        context.fail(error)
      } else {
        options.speechText += quote
        options.speechText += " Do you want to hear one more quote?. "
        options.speechText += "You can say yes or one more. "
        options.endSession = false
        context.succeed(buildResponse(options))
      }
    })
  } else {
    options.speechText = "Wrong invocation of this intent"
    options.endSession = true
    context.succeed(buildResponse(options))
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
      var quoteResponse = ""
      if (!quote.quoteAuthor) {
        quoteResponse = `As ${quote.quoteAuthor} once said, `
      } 
      quoteResponse += quote.quoteText
      callback(quoteResponse)
    })
  })

  request.on('error', function(error){
    callback('', error)
  })
}

function getWish () {
	var currentDate = new Date()
	var hours = currentDate.getUTCHours() - 8
	if (hours < 0) {
		hours = hours + 24
	}

	if (hours < 12) {
		return "Good morning. "
	} else if (hours < 18) {
		return "Good afternoon. "
	} else {
		return "Good evening. "
	}
}

function buildResponse (options) {
	var response = {
		version: '1.0',
		response: {
			outputSpeech: {
				type: 'SSML',
				ssml: "<speak>" + options.speechText + "</speak>"
			},
			shouldEndSession: options.endSession
		}
	}

	if (options.repromptText) {
		response.response.reprompt = {
			type: "SSML",
			ssml: "<speak>" + options.repromptText + "</speak>"
		}
  }
  
  if (options.session && options.session.attributes) {
    response.sessionAttributes = options.session.attributes
  }

  if (options.cardTitle) {
    response.response.card = {
      type: "Simple",
      title: options.cardTitle,
      content: options.cardContent
    }
    if (options.imageUrl) {
      response.response.card.type = "Standard",
      response.response.card.text = options.cardContent,
      response.response.card.image = {
        smallImageUrl = options.smallImageUrl,
        largeImageUrl = options.largeImageUrl
      }
    } else {
      response.response.card.content = options.cardContent
    }
  }

	return response
}


console.log('... end of script')
