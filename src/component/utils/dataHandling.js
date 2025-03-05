//function for clean Dates
export function cleanDates(buf, oldJSONByPage, sheetName, format) {
    //Get the data with dates and parsing the other values like Strings,Integers.
    let newWoorkbook = read(buf, {
      cellNF: false,
      cellText: false,
      cellDates: true,
    });
    let jsonByPage = utils.sheet_to_json(newWoorkbook.Sheets[sheetName], {
      raw: true,
    });

    //Loop the sheet
    for (const index of jsonByPage.keys()) {
      let rowWithDate = jsonByPage[index];
      //Iterate the row
      for (const key in rowWithDate) {
        let value = rowWithDate[key];
        if (value instanceof Date) {
          oldJSONByPage[index][key] = moment(value)
            .add(1, "hours")
            .format(format);
        }
      }
    }
    return oldJSONByPage;
  }
