/** @format */

const puppeteer = require('puppeteer');
const ExcelJS = require('exceljs');
const path = require('path');
const os = require('os');

(async () => {
	// // Launch a headless browser
	// const browser = await puppeteer.launch({ headless: false, defaultViewport: null });
	// const page = await browser.newPage();

	try {
		// // Navigate to the page with the "Export to Excel" button
		// await page.goto('https://tenders.go.ke/OpenTenders');
		// await page.waitForSelector('div.contentt > div > h5 > span', { waitUntil: 'networkidle0' });

		// await page.click('div.contentt > div > h5 > span > button');

		// // Wait for the navigation to complete (you may adjust the waitUntil option if needed)
		// await page.waitForNavigation({ waitUntil: 'networkidle0' });

		// // Handle the prompt
		// page.on('dialog', async (dialog) => {
		// 	console.log(`Dialog message: ${dialog.message()}`);
		// 	await dialog.accept();
		// });

		// Extract Excel file content
		const excelData = await readExcelFromPage();

		// Do something with the extracted data (e.g., log it)
		console.log(excelData);
	} catch (error) {
		console.log(`Error: ${error}`);
	}
	// await browser.close();
})();

async function readExcelFromPage() {
	// Get the home directory
	const homeDirectory = os.homedir();

	// Construct the full file path
	const filePath = path.join(homeDirectory, 'Downloads', 'Download.xlsx');

	// Log the file path
	console.log(`File Path: ${filePath}`);

	const workbook = new ExcelJS.Workbook();
	await workbook.xlsx.readFile(filePath);

	const worksheet = workbook.getWorksheet(1); // assuming the data is in the first worksheet

	const headers = [];
	const data = [];

	// Iterate through each row in the worksheet
	worksheet.eachRow((row, rowNumber) => {
		const rowData = {};

		// If it's the first row, store the headers
		if (rowNumber === 1) {
			row.eachCell((cell) => {
				headers.push(cell.value);
			});
		} else {
			// For other rows, map the data to an object using headers as keys
			row.eachCell((cell, colNumber) => {
				const columnHeader = headers[colNumber - 1];
				const cellValue = cell.value;

				// Map only the specified columns
				if (columnHeader === 'Pe Name') {
					rowData['owner'] = cellValue;
				} else if (columnHeader === 'Title/Description') {
					rowData['description'] = cellValue;
				} else if (columnHeader === 'Procurement Method') {
					rowData['type'] = cellValue;
				} else if (columnHeader === 'Closedate') {
					rowData['deadline'] = cellValue;
				}
			});

			// Add the object to the data array
			data.push(rowData);
		}
	});

	// Log the content of the Excel file
	console.log('Excel Data:', JSON.stringify(data, null, 2));

	return data;
}
