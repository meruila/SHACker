import React, { useState } from "react";
import * as XLSX from "xlsx";
import { useNavigate } from "react-router-dom";

import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { Button , Alert , AlertTitle, Input } from "@mui/material";

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

// Icons for Dialog Table Body
import ErrorIcon from '@mui/icons-material/ErrorOutlineOutlined';
import CheckIcon from '@mui/icons-material/CheckCircleOutlined';

// Note modularize the upload dialogue

const parseTest = require('../parser.js')

/**
 * 
 * FUNCTION: readFileAsText
 * Parameters = file/s uploaded
 * 
 */
function readFileAsText(file){

  return new Promise(function(resolve,reject){
      let fr = new FileReader();

      fr.onload = (evt) =>{
          var extension = file.name.split(".").pop();
          const bstr = evt.target.result;
          if (extension === "xlsx"){ //For reading .
              const wb = XLSX.read(bstr, { type: "binary" });
              const wsname = wb.SheetNames[0];
              const ws = wb.Sheets[wsname];
              const data = XLSX.utils.sheet_to_csv(ws, { header: 1 });
              resolve({"filename": file.name, "data": data});
          }else if (extension === "csv"){
              resolve({"filename": file.name, "data": fr.result});
          }else{
            resolve({"filename": file.name, "success": "false", "msg":"Invalid file extension."});
          }
      };

      fr.onerror = function(){
          reject(fr);
      };

      fr.readAsBinaryString(file);
  });
}

/**
 * 
 * DEFAULT FUNCTION: uploadButton
 */

export default function UploadButton() {
    const [fileList, setFileList] = useState([]);
    const [filesNumber, setFilesNumber] = useState();
    const [rejectedNumber, setRejectedNumber] = useState();
    const [open, setOpen] = useState(false);
    const [openFail, setOpenFail] = useState(false);
    const [failedDialog, setFailedDialog] = useState("");
    const width = "md";
    const navigate = useNavigate();
    
    // Used for Upload Dialog Box; handleClickOpen() handleClose()
    const handleClickOpen = () => {
      setOpen(true);
    };
  
    const handleClose = () => {
      setOpen(false);
      navigate('/student-records')
    };

    // Used for FAILED Upload Dialog Box; handleClickOpen() handleClose()
    const handleClickOpenFail = () => {
      setOpenFail(true);
    };
  
    const handleCloseFail = () => {
      setOpenFail(false);
    };

    // On 'Choose Files' Button Click
    const onChange = (ev) => {
      let files = ev.currentTarget.files;
      let readers = [];

                  // Abort if there were no files selected
      if(!files.length) return;

      setFilesNumber(files.length)

                  // Store promises in array
      for(let i = 0;i < files.length;i++){
        readers.push(readFileAsText(files[i]));
      }
                  
                  // Trigger Promises
      Promise.all(readers)
      .then((values) => {
                      // Values will be an array that contains an item
                      // with the text of every selected file
                      // ["File1 Content", "File2 Content" ... "FileN Content"]
        var parseList = [];
        var rejectList = [];
        for (var i=0; i<values.length; i++){
          if (values[i].hasOwnProperty('success')){
            rejectList.push(values[i]);
          }else{
            parseList.push(values[i]);
          }
        }
        if (parseList.length !== 0){
          const valList = parseTest.parseFiles(parseList);
          for (i = 0; i < valList.errList.length; i++){
            const tempErr = valList.errList[i].msg;
            let tempMsg = tempErr.err;
            if (tempErr.row != undefined || tempErr.row != null){
              tempMsg += (" near row " + tempErr.row);
            }else if(tempErr.sem != null){
              tempMsg += (" at sem " + tempErr.sem + " A.Y. " + tempErr.year);
            }
            rejectList.push({
              filename : valList.errList[i].filename,
              msg: tempMsg,
            });

          }

          if (valList.formattedList.length !== 0){

            const sendToBackend = {formattedList: valList.formattedList};

            fetch(
                process.env.REACT_APP_API_PATH + "/addStudentRecord",
                {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(sendToBackend)
                })
                .then(response => response.json())
                .then(body => {
                if (body.success) {

                    //Note: Edit this to add the savedList from the backend response

                    let fileL = [];
                    const savedList = body.savedList;
                    const rejectedList = body.rejectedList;

                    // returnFromDB = {accepted:[], rejected:[]}
                    // let fileL = rejectList + rejected;
                    // let fileT = accepted
                    for (let j = 0; j < savedList.length; j++) {
                      fileL.push({
                        filename: savedList[j],
                        msg: "Successfully saved"
                      })
                    }

                    for (let k = 0; k < rejectedList.length; k++) {
                      fileL.push({
                        filename: rejectedList[k].filename,
                        msg: rejectedList[k].err
                      })
                    }

                    for (let i = 0; i < rejectList.length; i++) {
                      fileL.push({
                        filename: rejectList[i].filename,
                        msg: rejectList[i].msg
                      })
                    }

                    setFileList(fileL);
                    setRejectedNumber((rejectList.length) + rejectedList.length );
                    handleClickOpen()
                }
                else{
                  // No records saved dialogbox
                  setFailedDialog(body.note);
                  handleClickOpenFail();
                }
                })

          }else{
            //alert("There are no valid files to send.");
            let fileL = [];
            for (let i = 0; i < rejectList.length; i++) {
              fileL.push({
                filename: rejectList[i].filename,
                msg: rejectList[i].msg
              })
            }
            setFileList(fileL);
            setRejectedNumber(rejectList.length );          
            handleClickOpen()
          }
        }
      })
      .catch(function(err){ console.log(err) });
  };

  const uploadFailDialog = (
    <React.Fragment>
      <Dialog
            open={openFail}
            onClose={handleCloseFail}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">
                {"Upload Status"}
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    {failedDialog}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={ () => {handleClose()} }>Okay!</Button>
            </DialogActions>
        </Dialog>
    </React.Fragment>
  );

  const uploadDialog = (
    <React.Fragment>
      <Dialog
            open={open}
            onClose={handleClose}
            maxWidth={width}
            fullWidth={width}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">
            <Alert severity="success">
                <AlertTitle><strong>{"Upload List"}</strong></AlertTitle>
            </Alert>
            </DialogTitle>
            <DialogContent>
              <TableContainer sx={{ maxHeight: '80%' }}>
              <Table stickyHeader aria-label="sticky table">
                 <TableHead>
                      <TableRow>
                          <TableCell><strong>No.</strong></TableCell>
                          <TableCell><strong>File Name</strong></TableCell>
                          <TableCell><strong>Remarks</strong></TableCell>
                          <TableCell><strong>Status</strong></TableCell>
                      </TableRow>
                  </TableHead>
                   <TableBody>
                      {fileList.map((item, index) => (
                          <TableRow key={index}>
                              <TableCell> {index+1} </TableCell>
                              <TableCell> {item.filename} </TableCell>
                              <TableCell> {item.msg} </TableCell>
                              <TableCell>
                                  {/* Successfully uploaded file */}
                                  {item.msg === "Successfully saved" &&
                                    <CheckIcon color="success"/>
                                  }
                                  {/* Failed to upload */}
                                  {item.msg !== "Successfully saved" &&
                                    <ErrorIcon color="error"/>
                                  }
                              </TableCell>
                          </ TableRow>
                      ))}
                  </TableBody>
              </Table>
              </TableContainer>
                           
              <br />
              <Alert severity="success">
                <strong>{(filesNumber - rejectedNumber)}</strong> out of <strong>{(filesNumber)}</strong> files were accepted.
              </Alert>
              
            </DialogContent>
            <DialogActions>
            <Button onClick={handleClose} autoFocus>
                Okay!
            </Button>
            </DialogActions>
        </Dialog>
    </React.Fragment>
  );
  
  // Rendering
  return (
    <div>
      <Input type="file" id="files" accept=".xlsx, .xls, .csv" onChange={onChange} inputProps={{ multiple: true }} />
      {uploadDialog}
      {uploadFailDialog}
    </div>
  );
}