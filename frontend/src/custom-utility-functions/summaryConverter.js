const pdfer = require("jspdf");
require('jspdf-autotable');
// import jsPDF from "jspdf";
// import autoTable from 'jspdf-autotable';

// const doc = new jsPDF();
// var doc = new pdfer.jsPDF("l");
// const table = new auto.autoTable();

exports.convertToPDF = (data) => {
    console.log("data: ", data)
    let columns = ["Student Number", "Full Name", "Degree Program", "(GWA)", "Verified By"];
    let rows = [];


    for (let i in data) {
        let row = []
        row.push(data[i].studentNo);
        row.push(data[i].name.last + ", " + data[i].name.first);
        row.push(data[i].course);
        row.push(data[i].GWA);
        let users = "";
        for (let j in data[i].verifiedBy) {
            users += data[i].verifiedBy[j]
            if (j !== data[i].verifiedBy.length - 1) {
                users += ", ";
            }
        }
        row.push(users);
        rows.push(row);
    }



    let doc = new pdfer.jsPDF("l");
    doc.autoTable(columns, rows);
    doc.save('Record_Summary.pdf');

    console.log("Document saved!")
}



