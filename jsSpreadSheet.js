var grid = document.getElementById("grid");
var myFullArr = [];
var x_index = [];
var x_name = [];
var x_i = 0;
for (var i = "A".charCodeAt(0); i <= "Z".charCodeAt(0); i++) {
    x_index[x_i] = String.fromCharCode(i);
    x_i++;
}
createTable();

function createTable() {
    grid.innerHTML = "";
    var table = document.createElement("TABLE");
    table.setAttribute("id", "myTable");
    grid.appendChild(table);
    var i;
    var header = table.createTHead();
    var j;
    x_i = 0;
    var x_i2 = -1;
    var row0 = header.insertRow(0);
    var cell = row0.insertCell(0);
    cell.innerHTML = "";

    //Settting column names
    for (i = 1; i <= 100; i++) {
        var cell = row0.insertCell(i);
        if (x_i2 == -1) {
            cell.innerHTML = "<b>&nbsp;" + x_index[x_i] + "</b>";
            cell.innerHTML = "<b>&nbsp;&nbsp;" + x_index[x_i] + "&nbsp;&nbsp;</b>";
            x_name[i] = x_index[x_i];
        }
        if (x_i2 >= 0) {
            cell.innerHTML = "<b>" + x_index[x_i2] + x_index[x_i] + "</b>";

            x_name[i] = x_index[x_i2] + x_index[x_i];
        }
        x_i++;
        //Concatinating column names
        if (x_i == 26) {
            x_i = 0;
            x_i2++;
        }
    }
    //Adding rows of the table
    for (i = 1; i <= 100; i++) {
        var row = table.insertRow(Number(i));
        for (j = 0; j <= 100; j++) {
            var cell = row.insertCell(j);
            //Adding rows number
            if (j == 0) {
                cell.innerHTML = "<b>" + Number(i) + "</b>";
            } else {
                //Creating a new cell
                cell.setAttribute("id", x_name[j] + i);
                cell.setAttribute("onkeyup", "javascript:oninputchange(this,event)");
                cell.setAttribute("contenteditable", 'true');

                if (myFullArr.length > 0) {
                    var matchingCell = myFullArr.find(code => code.id == x_name[j] + i)
                    //console.log(matchingCell);
                    if (matchingCell !== undefined) {
                        if (matchingCell.ital == 1) {

                            document.getElementById(x_name[j] + i).innerHTML = matchingCell.value.italics();
                        } else if (matchingCell.bold == 1) {

                            document.getElementById(x_name[j] + i).innerHTML = matchingCell.value.bold();
                        } else {
                            document.getElementById(x_name[j] + i).innerHTML = matchingCell.value;
                        }
                    }
                }
            }
        }
    }
}

// function calls on cell text change event
function oninputchange(element, event) {
    console.log(element);
    var changedCellText = element.innerHTML;
    console.log(changedCellText);
    var changedCellId = element.id;
    console.log(changedCellId);
    var changedCellHtml = document.getElementById(element.id).innerHTML;
    console.log(changedCellHtml);
    //All cell entries updating to myFullArr array, if one cell entry all ready exits only its value will change to new value
    if ((myFullArr.some(code => code.id == changedCellId))) {
        var matchingCell = myFullArr.find(code => code.id == changedCellId)
        matchingCell.value = changedCellText;
    } else {

        myFullArr.push({
            id: changedCellId,
            value: changedCellText,
            html: changedCellHtml,
            ital: 0,
            bold: 0
        });
    }
    mainFunction(changedCellId, changedCellText);
}

//Function doing all the calculation
function mainFunction(changedCellId, changedCellText) {
    //checking the cell contains a formula or not
    var result = new RegExp('=*').test(changedCellText);
    if (result) {
        if (changedCellText.includes('+')) { //Check for addition
            var arrStr = changedCellText.split('+'); //Splitting with + to get the LHS and RHS of the operand
            var LHSId = arrStr[0].toString().replace('=', '').trim();
            var RHSId = arrStr[1];
            var LHSvalue = document.getElementById(LHSId).innerHTML;
            var RHSvalue = document.getElementById(RHSId).innerHTML;
            var sum = parseInt(LHSvalue) + parseInt(RHSvalue);
            document.getElementById(changedCellId).innerHTML = sum;
        } else if (changedCellText.includes('*')) { //Check for Multiplication
            var arrStr = changedCellText.split('*'); //Splitting with * to get the LHS and RHS of the operand
            var LHSId = arrStr[0].toString().replace('=', '').trim();
            var RHSId = arrStr[1];
            var LHSvalue = document.getElementById(LHSId).innerHTML;
            var RHSvalue = document.getElementById(RHSId).innerHTML;
            var multiply = parseInt(LHSvalue) * parseInt(RHSvalue);
            document.getElementById(changedCellId).innerHTML = multiply;
        } else if (changedCellText.includes('-')) { //Check for subtraction
            var arrStr = changedCellText.split('-'); //Splitting with - to get the LHS and RHS of the operand
            var LHSId = arrStr[0].toString().replace('=', '').trim();
            var RHSId = arrStr[1];
            var LHSvalue = document.getElementById(LHSId).innerHTML;
            var RHSvalue = document.getElementById(RHSId).innerHTML;
            var sub = parseInt(LHSvalue) - parseInt(RHSvalue);
            document.getElementById(changedCellId).innerHTML = sub;
        } else if (changedCellText.includes('/')) { //Check for division
            var arrStr = changedCellText.split('/'); //Splitting with / to get the LHS and RHS of the operand
            var LHSId = arrStr[0].toString().replace('=', '').trim();
            var RHSId = arrStr[1];
            var LHSvalue = document.getElementById(LHSId).innerHTML;
            var RHSvalue = document.getElementById(RHSId).innerHTML;
            var division = parseInt(LHSvalue) / parseInt(RHSvalue);
            document.getElementById(changedCellId).innerHTML = division;
        } else if (changedCellText.includes(':')) { //Check for cell range operation
            var arrStr = changedCellText.split('('); //Splitting with ( to get the the operand as sum/sub/mul/div
            var operand = arrStr[0].toString().replace('=', '').trim();
            var LHSRHS = arrStr[1].split(':'); //Splitting with : to get the cell range
            var LHSId = LHSRHS[0].toString().trim();
            var RHSId = LHSRHS[1].toString().replace(')', '').trim();
            var finalresult = 0;
            var boolLHSId = "false";
            var boolRHSId = "false";
            for (i = 0; i < myFullArr.length; i++) { //for loop to look through array
                if (myFullArr[i].id == LHSId) {
                    boolLHSId = "true"; //making true if the first cell in the cell range reaches array
                }
                if (boolLHSId == "true" && boolRHSId == "false") // for each cells in the range untill it reaches the end of the cell range
                {
                    if (finalresult == "") {
                        finalresult = myFullArr[i].value;
                    } else {
                        if (operand == "sum") {
                            finalresult = parseInt(finalresult) + parseInt(myFullArr[i].value);
                        } else if (operand == "sub") {
                            finalresult = parseInt(finalresult) - parseInt(myFullArr[i].value);
                        } else if (operand == "mul") {
                            finalresult = parseInt(finalresult) * parseInt(myFullArr[i].value);
                        } else if (operand == "div") {
                            finalresult = parseInt(finalresult) / parseInt(myFullArr[i].value);
                        }
                    }
                }
                if (myFullArr[i].id == RHSId) {
                    boolRHSId = true; //making true when the last cell in the cell range reaches array to stop executing calculation
                }
            }
            document.getElementById(changedCellId).innerHTML = finalresult;
        }
    }
    //checking other formulas in other cells affected by this new change
    if (myFullArr.some(code => code.value.includes(changedCellId))) {
        var matchingCell = myFullArr.find(code => code.value.includes(changedCellId))
        mainFunction(matchingCell.id, matchingCell.value);
    }
}

// Function to get the Selected Text
function getItalicsText() {
    var chldnodes = window.getSelection().anchorNode.parentElement.id;
    var matchingCell = myFullArr.find(code => code.id == chldnodes);
    if (matchingCell !== undefined) {
        if (matchingCell.ital == 1) {
            matchingCell.ital = 0;
            document.getElementById(chldnodes).innerHTML = document.getElementById(chldnodes).innerHTML;
        } else {
            matchingCell.ital = 1;
            document.getElementById(chldnodes).innerHTML = document.getElementById(chldnodes).innerHTML.italics();
        }
    }
}

// Function to get the Selected Text
function getBoldText() {
    var chldnodes = window.getSelection().anchorNode.parentElement.id;
    var matchingCell = myFullArr.find(code => code.id == chldnodes);
    if (matchingCell !== undefined) {
        if (matchingCell.bold == 1) {
            matchingCell.bold = 0;
            document.getElementById(chldnodes).innerHTML = document.getElementById(chldnodes).innerHTML;
        } else {
            matchingCell.bold = 1;
            document.getElementById(chldnodes).innerHTML = document.getElementById(chldnodes).innerHTML.bold();
        }
    }
}