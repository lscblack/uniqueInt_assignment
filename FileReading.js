const fs = require('fs'); // import js lib to handel files in js
const path = require('path'); // imports js paths (handels The File Path related stuffs)
const quickSort = require('./Sorting');// import my Bubble Sort Function
/** Function To Handel All File REading Steps  */
function readFileAndProcess(Location_Of_my_readed_from_inputs_folder) {
  const Array_Size = 2047;
  const New_Unique_array = new Array(Array_Size).fill(false);
  const File_Handeler = fs.createReadStream(Location_Of_my_readed_from_inputs_folder, { encoding: 'utf8' });
  let Lines_From_File = '';

  /*****
            **(Event Linterner) Function To Handel File Reading (timer Steted)** 
   * *** */
  console.time('Time taken');
  File_Handeler.on('data', (New_data_from_file_handel) => {
    Lines_From_File += New_data_from_file_handel;
    const lines = Lines_From_File.split('\n');
    Lines_From_File = lines.pop();

    lines.forEach((line) => {
      if (!/\S/.test(line)) return;
      if (/\s/.test(line.trim()) || /[^\d\s-]/.test(line.trim())) return;

      const num = parseInt(line.trim(), 10);
      if (!isNaN(num) && num >= -1023 && num <= 1023) {
        New_Unique_array[num + 1023] = true;
      }
    });
  });
  /*****
            **(Event Linterner) Function To Handel File Reading On end And Check Time Taken ** 
   * *** */
  File_Handeler.on('end', () => {
    const result = [];
    for (let i = 0; i < Array_Size; i++) {
      if (New_Unique_array[i]) {
        result.push(i - 1023);
      }
    }

    const sortedResult = quickSort(result);
/* 
    const Location_for_OutPut = path.join(__dirname, '/', 'Myoutput');
    if (!fs.existsSync(Location_for_OutPut)) {
      fs.mkdirSync(Location_for_OutPut);
    }

    fs.writeFile(path.join(Location_for_OutPut, `${path.basename(Location_Of_my_readed_from_inputs_folder)}.output.txt`), sortedResult.join('\n'), (err) => {
      if (err) {
        console.error('Error creating OutPut file:', err);
        return;
      }
      console.log(`All unique number are saved in ${path.join(Location_for_OutPut, `${path.basename(Location_Of_my_readed_from_inputs_folder)}.output.txt`)}`);
    });

    console.log(`All Unique numbers Found in ${Location_Of_my_readed_from_inputs_folder}:\n`); */
    console.timeEnd('Time taken');
    console.log(JSON.stringify(sortedResult));
    console.log("\nTotal", sortedResult.length);
});
  /*****
            **(Event Linterner) Function To Track and Catch Errors When File Reading is Going on  ** 
   * *** */
  File_Handeler.on('error', (err) => {
    console.error('Error reading file:', err);
  });
}

module.exports = readFileAndProcess;
