var fs = require('fs');
var S = require('string');

// print process.argv
//console.log(process.argv);

var inputFile = process.argv[2];
if (inputFile == null){
	console.log('parameter is wrong!');
	return;
}

if (!fs.existsSync(inputFile)){
	console.log('input file is not exist!');
	return;
}

var outputFile = 'output_' + inputFile;
if (fs.existsSync(outputFile)){
	fs.unlinkSync(outputFile);
}

var tmpFile = 'tmp_' + inputFile;
if (fs.existsSync(tmpFile)){
	fs.unlinkSync(tmpFile);
}

var array = fs.readFileSync(inputFile).toString().split("\n");


for(i in array) {

	line =S(array[i]).collapseWhitespace();

	if (!line.isEmpty()) {
		//line = S(array[i]);

		if (line.left(1).s == '問'){
			line = "<br>" + line;
			//console.log(line);

			line =S(line);
		}

		if (line.left(1).s == '（'){
			line = "<br>" + line;

			line =S(line);
		}

		//line = line.replaceAll(/^（/g,'<br>（');

		

		line = line.replaceAll('１．',',１．');
		line = line.replaceAll('２．',',２．');
		line = line.replaceAll('３．',',３．');
		line = line.replaceAll('４．',',４．');

		if (line.left(1).s != ',' && line.left(1).s != '<'){
			line = "<br>" + line;

			line =S(line);
		}

		fs.appendFileSync(tmpFile, line);
	}
}

fs.readFileSync(tmpFile).toString().split("<br>").forEach(function (line) {
	line =S(line);
	if (line.left(1) == "（" || line.left(2) == "問（"){
		line = "," + line;
	}

	fs.appendFileSync(outputFile, line.toString() + "\n");
});
