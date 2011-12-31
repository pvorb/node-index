var Index = require("./Index");

// Add new data to the index
Index.prototype.add = function(data) {

  // If data is an array, add every element of `data`
  if (typeof data === "array")
    for (var i = 0; i < data.length; i++)
      this.add(data[i]);

  // If data is not an object, throw an error
  else if (typeof data !== "object")
    throw new Error("data must be an object or an array of objects");

  // Go through indexes and create a connection for each
  else {
    if (data.tags)
      // add new tags
      for (var i = 0; i < data.tags.length; i++) {
        this.tags[data.tags[i]] = true;
      }

    // save data
    this.collection.save(data);
  }
};
