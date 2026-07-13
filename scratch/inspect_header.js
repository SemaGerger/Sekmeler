const sheetId = '1SI2TyuLLDeYIGpQN8cmeUBBtXszPQXzpiu4GpKPXu1A';
const tabName = 'UlakbelForm';

const url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json&sheet=${encodeURIComponent(tabName)}`;

fetch(url)
  .then(res => res.text())
  .then(text => {
    const match = text.match(/google\.visualization\.Query\.setResponse\((.*)\);/s);
    if (!match) return;
    const json = JSON.parse(match[1]);
    const rows = json.table.rows || [];
    if (rows.length > 0) {
      console.log("First Row (Header candidate):", rows[0].c.map(cell => cell ? cell.v : ''));
    }
  });
