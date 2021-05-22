/*
 * @Descripttion: 
 * @version: 
 * @Author: weihai.tang
 * @Date: 2021-01-26 08:11:32
 * @LastEditTime: 2021-05-08 11:08:02
 */
let exportBtn = document.getElementById("exportTable");

exportBtn.addEventListener("click", async () => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: exportTable,
  });
});

function exportTable() {
  let headerTable = document.querySelector('.el-table__header');
  let bodyTable = document.querySelector('.el-table__body');

  let csv = []
  let headerRow = []
  for (const element of headerTable.children[1].children[0].children) {
    if (element.innerText && element.innerText !== '') headerRow.push(element.innerText);
  }
  csv.push(headerRow.join(','))

  for (const row of bodyTable.children[1].children) {
    const tempRow = [];
    for (const td of row.children) {
      tempRow.push(td.innerText);
    }
    tempRow[0] = '\'' + tempRow[0];
    csv.push(tempRow.join(','));
  }

  console.log(csv);
  const csv_string = csv.join('\n');
  console.log(csv_string);

  // Download it
  var filename = 'export_table_' + new Date().toLocaleDateString() + '.csv';
  var link = document.createElement('a');
  link.style.display = 'none';
  link.setAttribute('target', '_blank');
  link.setAttribute('href', 'data:text/csv;charset=utf-8,\ufeff' + encodeURIComponent(csv_string));
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}