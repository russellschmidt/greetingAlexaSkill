"use strict"

const fs = require('fs')
const http = require('http')

// blocking and nonblocking
// blocking

console.log('this should be an error')
let data = fs.readFileSync('./tmp.txt', 'utf8')
console.log(data)


// blocking with error handling
try {
	data = fs.readFileSync('./idontexist.txt', 'utf8')
	console.log(data)
} catch (err) {
	console.log(err)
}

console.log('end of an error')

// nonblocking
fs.readFile('./tmp.txt', 'utf8', function(err,data) {
	console.log(err)
	console.log(data)
})


console.log('================')

const url = "http://api.forismatic.com/api/1.0/json?method=getQuote&lang=en&format=json"

http.get(url, function(res) {
	var body = ''

	res.on('data', function(chunk) {
		body += chunk
	})

	res.on('end', function() {
//		body = body.replace(/\\/g,'')
		let quote = JSON.parse(body)
		console.log(quote)
	})
})
