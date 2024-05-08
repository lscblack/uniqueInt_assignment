const fs = require('fs');
const path = require('path');

function Function_read_my_input_data(Location_Of_my_readed_from_inputs_folder) {
  console.time('Time taken'); // Start the timer

  const Array_Size = 2047; // Range of numbers from -1023 to 1023
  const New_Unique_array = new Array(Array_Size).fill(false); // Create an array to track unique integers within the Array_Size, initialized to false

  const File_Handeler = fs.createReadStream(Location_Of_my_readed_from_inputs_folder, { encoding: 'utf8' }); // Create a readable stream to read the file

  let buffer = ''; // Initialize buffer to store partial lines
  File_Handeler.on('data', (New_data_from_file_handel) => { // Event listener for data event when new data is available
    buffer += New_data_from_file_handel; // Append the new New_data_from_file_handel to the buffer
    const lines = buffer.split('\n'); // Split buffer into lines

    // Keep the last incomplete line in buffer
    buffer = lines.pop(); // Remove the last element from lines and store it back in buffer

    lines.forEach((line) => { // Loop through each line
      // Skip lines with no inputs or white spaces
      if (!/\S/.test(line)) return; // If line contains only white spaces, skip it

      // Skip lines containing spaces between numbers or non-integer inputs
      if (/\s/.test(line.trim()) || /[^\d\s-]/.test(line.trim())) return; // If line contains spaces between numbers or non-integer inputs, skip it

      const num = parseInt(line.trim(), 10); // Parse the line as an integer
      if (!isNaN(num) && num >= -1023 && num <= 1023) { // Check if number is within Array_Size and valid integer
        // Set the corresponding index in the boolean array to true
        New_Unique_array[num + 1023] = true; // Mark the presence of the number in the boolean array
      }
    });
  });

  File_Handeler.on('end', () => { // Event listener for end event when all data has been read
    const result = [];
    // Collect unique integers from the boolean array
    for (let i = 0; i < Array_Size; i++) { // Loop through the boolean array
      if (New_Unique_array[i]) { // If the value at index i is true
        result.push(i - 1023); // Add the corresponding number to the result array
      }
    }

    // Sort the result array in ascending order 
    result.sort((a, b) => a - b);

    // Create the output directory if it doesn't exist
    const Location_for_OutPut = path.join(__dirname, '/', 'Myoutput');
    if (!fs.existsSync(Location_for_OutPut)) {
      fs.mkdirSync(Location_for_OutPut);
    }

    // Write the unique numbers to a file
    fs.writeFile(path.join(Location_for_OutPut, `${path.basename(Location_Of_my_readed_from_inputs_folder)}.output.txt`), result.join('\n'), (err) => {
      if (err) {
        console.error('Error creating OutPut file:', err); // Log the error if Happens 
        return;
      }
      console.log(`All unique number are saved in ${path.join(Location_for_OutPut, `${path.basename(Location_Of_my_readed_from_inputs_folder)}.output.txt`)}`); // Log success message
    });

    console.log(`All Unique numbers Found in ${Location_Of_my_readed_from_inputs_folder}:\n`); // Log the unique numbers
    console.log(JSON.stringify(result));
    console.log("\nTotal", result.length); 

    console.timeEnd('Time taken'); 
  });

  File_Handeler.on('error', (err) => { // When Error Happens
    console.error('Error reading file:', err); // Log the error
  });
}

const Location_Of_my_readed_from_inputs_folder = 'input/small_sample_input_02.txt'; 
Function_read_my_input_data(Location_Of_my_readed_from_inputs_folder); 
