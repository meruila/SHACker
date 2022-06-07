const parser = require("./csv-parser/parser-csv.js")
const fv = require("./format-verifier/format-verifier.js");

exports.parseFiles = (fileList) => {
    var formattedList = [];
    var errList = [];
    
    for (let j=0; j<fileList.length; j++){
        var readItem = fileList[j]
        var parseResult = {success: false, err:"File Reading Error"}
        if (readItem.data != null){
            try {
                parseResult = parser.csvParser(readItem.data)
            } catch (err){
                errList.push({type:"Parsing Error:", msg:"Unexpected Parsing Error", filename:readItem.filename})
            }
        }
    
        if (parseResult.success){
            const formatted = fv.formatVerifier(parseResult.data);
            console.log(formatted)
            if (!formatted.success)
                errList.push({type:"Formatting Error:", msg:formatted.errors, filename:readItem.filename})
            else
                formattedList.push({filename:readItem.filename, data:formatted.data})
        } else {
            errList.push({type:"Parsing Error:", msg:parseResult.errors, filename:readItem.filename})
        }
    }
    return {formattedList:formattedList, errList:errList}
}

