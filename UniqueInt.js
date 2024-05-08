const fs = require('fs');
const path = require('path');

function readFile(filePath) {
  console.time('Time taken'); // Start the timer

  const range = 2047; // Range of numbers from -1023 to 1023
  const uniqueIntegers = new Array(range).fill(false); // Create an array to track unique integers within the range, initialized to false

  const fileStream = fs.createReadStream(filePath, { encoding: 'utf8' }); // Create a readable stream to read the file

  let buffer = ''; // Initialize buffer to store partial lines
  fileStream.on('data', (chunk) => { // Event listener for data event when new data is available
    buffer += chunk; // Append the new chunk to the buffer
    const lines = buffer.split('\n'); // Split buffer into lines

    // Keep the last incomplete line in buffer
    buffer = lines.pop(); // Remove the last element from lines and store it back in buffer

    lines.forEach((line) => { // Iterate through each line
      // Skip lines with no inputs or white spaces
      if (!/\S/.test(line)) return; // If line contains only white spaces, skip it

      // Skip lines containing spaces between numbers or non-integer inputs
      if (/\s/.test(line.trim()) || /[^\d\s-]/.test(line.trim())) return; // If line contains spaces between numbers or non-integer inputs, skip it

      const num = parseInt(line.trim(), 10); // Parse the line as an integer
      if (!isNaN(num) && num >= -1023 && num <= 1023) { // Check if number is within range and valid integer
        // Set the corresponding index in the boolean array to true
        uniqueIntegers[num + 1023] = true; // Mark the presence of the number in the boolean array
      }
    });
  });

  fileStream.on('end', () => { // Event listener for end event when all data has been read
    const result = [];
    // Collect unique integers from the boolean array
    for (let i = 0; i < range; i++) { // Iterate through the boolean array
      if (uniqueIntegers[i]) { // If the value at index i is true
        result.push(i - 1023); // Add the corresponding number to the result array
      }
    }

    // Sort the result array in ascending order
    result.sort((a, b) => a - b);

    // Create the output directory if it doesn't exist
    const outputDir = path.join(__dirname, '/', 'Myoutput');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir);
    }

    // Write the unique numbers to a file
    fs.writeFile(path.join(outputDir, `${path.basename(filePath)}.output.txt`), result.join('\n'), (err) => {
      if (err) {
        console.error('Error writing file:', err); // Log the error if writing fails
        return;
      }
      console.log(`Unique numbers saved to ${path.join(outputDir, `${path.basename(filePath)}.output.txt`)}`); // Log success message
    });

    console.log("Total", result.length); // Log the total count of unique numbers

    console.timeEnd('Time taken'); // End the timer and log the time taken
  });

  fileStream.on('error', (err) => { // Event listener for error event
    console.error('Error reading file:', err); // Log the error
  });
}

// Provide the path to your file here
const filePath = 'input/small_sample_input_04.txt'; // Path to input file
readFile(filePath); // Call the readFile function with the file path
