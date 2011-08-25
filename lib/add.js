// Add new data to the index
module.exports = function(data) {

	// If data is an array, add every element of `data`
	if (typeof data === "array")
		for (var i = 0; i < data.length; i++)
			this.add(data[i]);

	// If data is not an object, throw an error
	else if (typeof data !== "object")
		throw new Error("data must be an object or an array of objects");

	// Go through indexes and create a connection for each
	else {

		// Make `__path` the object's ID
		data._id = data.__path;
		delete data.__path;

		// Save data
		this.collection.save(data);
	}
};
