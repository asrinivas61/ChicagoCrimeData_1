const fs = require('fs');

const lineReader = require('readline').createInterface({
	input: fs.createReadStream('../input/Crimes_-_2001_to_present.csv')
});
var temp = true, arrInd = [], index = [];
fs.writeFile('../output/theft.json', '[ \n\t');
fs.writeFile('../output/assault.json', '[ \n\t');

lineReader.on('line', (line) => {
	
	if(temp) {
		temp = false;
		arrInd = line.split(/,/g);
		index.push(arrInd.indexOf('ID'));
		index.push(arrInd.indexOf('Primary Type'));
		index.push(arrInd.indexOf('Description'));
		index.push(arrInd.indexOf('Arrest'));
		index.push(arrInd.indexOf('Year'));
	}
	var over_500 = [], under_500 = [], multiLine = [];

	/(?:^|\W)THEFT(?:$|\W)/g.test(line) ? (/^.*?(?:\b|_)(OVER \$500)(?:\b|_).*?(?:\b|_)(200[1-9]|201[0-6])|(^200[1-9]$|^201[0-6]$)(?:\b|_).*?(?:\b|_)(OVER \$500)(?:\b|_).*?$/.test(line) ? over_500.push(line) : '' ) : '';
 	/(?:^|\W)THEFT(?:$|\W)/g.test(line) ? (/^.*?(?:\b|_)(500 AND UNDER)(?:\b|_).*?(?:\b|_)(200[1-9]|201[0-6])|(^200[1-9]$|^201[0-6]$)(?:\b|_).*?(?:\b|_)(500 AND UNDER)(?:\b|_).*?$/.test(line) ? under_500.push(line) : '') : '';
 	/(?:^|\W)ASSAULT(?:$|\W)/g.test(line) ? multiLine.push(line) : '' ;

 		over_500.map((over) => {
			var over_500_1 = over.split(/,/g);
			var jsonFile = {};
			jsonFile[arrInd[index[0]]] = over_500_1[index[0]];
			jsonFile[arrInd[index[1]]] = over_500_1[index[1]];
			jsonFile[arrInd[index[2]]] = over_500_1[index[2]];
			jsonFile[arrInd[index[3]]] = over_500_1[index[3]];
			jsonFile[arrInd[index[4]]] = over_500_1[index[4]];
			
			fs.appendFile('../output/theft.json', JSON.stringify(jsonFile)+',\n\t');
		});

		under_500.map((under) => {
			var under_500_1 = under.split(/,/g);
			var jsonFile = {};
			jsonFile[arrInd[index[0]]] = under_500_1[index[0]];
			jsonFile[arrInd[index[1]]] = under_500_1[index[1]];
			jsonFile[arrInd[index[2]]] = under_500_1[index[2]];
			jsonFile[arrInd[index[3]]] = under_500_1[index[3]];
			jsonFile[arrInd[index[4]]] = under_500_1[index[4]];
			
			fs.appendFile('../output/theft.json', JSON.stringify(jsonFile)+',\n\t');
		});

		multiLine.map((assault) => {
			var assault_1 = assault.split(/,/g);
			var jsonFile = {};
			jsonFile[arrInd[index[0]]] = assault_1[index[0]];
			jsonFile[arrInd[index[1]]] = assault_1[index[1]];
			jsonFile[arrInd[index[3]]] = assault_1[index[3]];
			jsonFile[arrInd[index[4]]] = assault_1[index[4]];
			
			fs.appendFile('../output/assault.json', JSON.stringify(jsonFile)+',\n\t');
		})
});

lineReader.on('close', () => {
	fs.appendFile('../output/theft.json', ']');
	fs.appendFile('../output/assault.json', ']');
});