/* console.log("Hello, world");

use strict;

let firstName;

if (firstName === 'John') {
	console.log(`Hello, John`);
} else if (firstName === 'James') {
	console.log(`Hello, James`);
} else {
	console.log('Hey stranger');
}
*/


// LOOPS

var arr = [0,1,2,3,4,5,6,7,8,9]
var arr2 = []
for (var i = 0; i < arr.length+arr2.length; i++) {
	arr2.push(arr.pop())	
	console.log(arr2[i])
}

arr = [10,9,8,7,6,5,4,3,2,1]

var j = 0;
while (j < arr.length) {
	console.log(`${j} element is ${arr[j]}`)
	j++
}


// FUNCTIONS
var sayHi = function(name) {
	console.log('Hi '+ name)
}

function callHi(func,name) {
	func(name)
}

function myForEach(arr, callback) {
	for (var i=0; i< arr.length; i++) {
		callback(i, arr[i])		
	}
}

myForEach(arr, function(idx, element) {
	console.log(`${idx} element is ${element}`)
})

var p1 = {
	name: 'Olga',
	title: 'Ms.',
	city: 'Philadelphia',
	getName: function() {
		return this.title+" "+this.name
	}
}

console.log(p1.getName())
var p2 = p1 
p2.name = 'OLLLGA'
console.log(p2.getName())


function Person(name, title, city) {
	this.name = name;
	this.title = title;
	this.city = city;
	this.getName = function() {
		return this.title + " " + this.name
	}
}

var p3 = new Person("Olga Wayne","Madam","Philly")

console.log(p3.getName())

exports.Person = Person;

console.log("=====")
var fs = require('fs')

var data = fs.readFileSync('./tmp.txt', 'utf8')
console.log(data)

console.log('===-=-=-=-=')

fs.readFile('./tmp.txt','utf8', function(err,data) {
	console.log(data)
})
console.log('coming here')
