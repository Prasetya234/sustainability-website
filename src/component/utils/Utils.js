import moment from "moment";
import { read, utils } from "xlsx";

export function validasiNilaiAtribut(objek, atributArray) {
  // Periksa apakah objek tidak null atau undefined
  if (objek) {
    for (let i = 0; i < atributArray.length; i++) {
      const atribut = atributArray[i];
      // Periksa apakah atribut ada di dalam objek dan memiliki nilai yang valid
      if (objek.hasOwnProperty(atribut)) {
        if (
          objek[atribut] === null ||
          objek[atribut] === undefined ||
          objek[atribut] === ""
        ) {
          // console.log(atribut);
          return false; // Nilai atribut tidak valid
        }
      } else {
        // console.log(atribut);

        return false; // Atribut tidak ditemukan dalam objek
      }
    }
    return true; // Semua atribut memiliki nilai yang valid
  }

  return false; // Objek tidak valid
}

export function finValue(val) {
  if (!val) return [];
  return [{ name: val }];
}

export const FormatNumSTD = (number) => {
  return new Intl.NumberFormat().format(number);
};

export const CheckNilai = (nilai) => {
  if (!nilai || isNaN(nilai)) return 0;

  return nilai;
};

export const sumTotal = (data, colname) => {
  return data.reduce(
    (sum, item) =>
      CheckNilai(parseFloat(sum)) + CheckNilai(parseFloat(item[colname])),
    0
  );
};

export const Chckfloat = (nilai) => {
  if (!nilai || isNaN(nilai)) return 0;

  return parseFloat(nilai);
};

export const allowedType = [
  "csv",
  "vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "vnd.ms-excel",
];

export function fakeFunc() {
  return;
}

//function for clean Dates for import excel
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

export function isObjectValid(obj) {
  // Memeriksa apakah objek bukan null dan bukan undefined
  if (obj === null || obj === undefined) {
    return true;
  }

  // Memeriksa nilai-nilai properti dalam objek
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      // Memeriksa apakah nilai properti adalah null, string kosong, atau undefined
      if (
        obj[key] === null ||
        obj[key] === "" ||
        obj[key] === undefined ||
        obj[key] === "0"
      ) {
        return true;
      }
    }
  }

  // Jika semua properti memiliki nilai yang valid
  return false;
}

export function replaceEmptyStringWithNull(obj) {
  // Iterasi melalui setiap properti dalam objek
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      // Jika nilai properti adalah string kosong, ubah menjadi null
      if (obj[key] === "") {
        obj[key] = null;
      }
    }
  }
  return obj;
}



export const formatRupiah = (value) => {
  if (isNaN(value)) return "Rp.0,00"; // Handle invalid input

  return `Rp.${Number(value)
    .toLocaleString("id-ID", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

