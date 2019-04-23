/**
Authors: David Gonzales and Grace Kaylor
File: index.js
This program performs the javascript for our main planner (index) portion of the website.
It loads one set of input boxes for the user to input information about their assignments
such as: due date, assignment name, and class. It then allows the user to continuously
add assignments to the calendar.
*/

(function(){

    "use strict";

    window.onload = function() {
        get();
        document.getElementById("submitClass").onclick = addNewClass;
        document.getElementById("submitAssignment").onclick = saveAssignment;
        document.getElementById("refresh").onclick = get;
    };

    /**
    This function adds the class that the user inputed to the drop down menu of classes.
    This prevents the user from having to type the class name each time.
    */
    function addNewClass(){
        let newClass = document.getElementById("className").value;
        // invalid class input
        if (newClass == ""){
            alert("Could not add class");
        } else {
            let option = document.createElement("option");
            option.innerHTML = newClass;
            document.getElementById("addedClasses").appendChild(option);
            document.getElementById("className").value = "";
        }
    }

    /**
    This function gets the input from all of the input boxes and parses it to make
    sure that the uses has inputed valid information for each box. It then allows the
    user to submit the assignment and provides a success message. It then clears the input
    text boxes.
    */
    function saveAssignment(){
        let monthDate = document.getElementById("monthDate").value;
        let dayDate = document.getElementById("dayDate").value;
        let classes = document.getElementById("addedClasses").value;
        let assignment = document.getElementById("assignmentName").value;

        if (monthDate == "" || dayDate == "" || assignment == "" || classes == "Select Class"){
            alert("Could not submit assignment: invalid input");
        } else if (parseInt(monthDate) == null || parseInt(dayDate) == null){
            alert("Could not submit assignment: invalid date");
        } else if ((parseInt(monthDate) < 1 || parseInt(monthDate) > 12) ||
            (parseInt(dayDate) < 1 || parseInt(dayDate) > 31)){
            alert("Could not submit assignment: invalid date");
        } else {
            let date = monthDate + "/" + dayDate;
            // if both input boxes have something in them
            const assignments = {date: date, classes: classes, assignment: assignment};
            const fetchOptions = {method : 'POST', headers : {'Accept': 'application/json',
            'Content-Type' : 'application/json'}, body : JSON.stringify(assignments)
            };
            // posts the new comments to the server
            let url = "http://final-planner3.herokuapp.com";
            fetch(url, fetchOptions)
                .then(checkStatus)
                .then(function(responseText) {
                    console.log(responseText);
                })
                 .catch(function(error) {
                    // writes to the console with this value if the post is unsuccessful
                    console.log(error);
                });
                alert("Assignment Submitted Successfully: Update Schedule to View Changes");

                // clears the text boxes
                document.getElementById("dayDate").value = "";
                document.getElementById("monthDate").value = "";
                assignment = document.getElementById("assignmentName").value = "";
            }
    }

    /**
    The function sends a get request for the information from the file, parses it,
    and displays it on the screen in the calendar format. This function is called on
    window load and every time the update schedule button is pressed.
    */
    function get(){
        document.getElementById("dates").innerHTML="";

        // fetches calendar on submit
        let url = "http://final-planner3.herokuapp.com";
        fetch(url)
            .then(checkStatus)
            .then(function(responseText) {
                // add a flag to keep track if a date had been added, if exit loop
                // with false still needs to be added
                let json = JSON.parse(responseText);
                for (let i = 0; i < json.assignments.length - 1; i ++) {
                    let last = false;
                    let added = false;
                    let jsonDate = json.assignments[i].date;
                    let splitJson = jsonDate.split("/");
                    let jsonMonth = parseInt(splitJson[0]);
                    let jsonDay = parseInt(splitJson[1]);
                    let dates = document.querySelectorAll("#dates > li");
                    if (dates.length == 0) {
                        addListElement(json, i, 0, last);
                        added = true;
                    } else {
                        for (let j = 0; j < dates.length; j++) {
                            let date = dates[j].innerHTML;
                            let split = date.split("/");
                            let month = parseInt(split[0]);
                            let day = parseInt(split[1]);

                            if (jsonMonth < month) {
                                // add assignment before current date li element
                                // add assignment before current date li element
                                if (added == false) {
                                    addListElement(json, i, j, last);
                                    added = true;
                                }
                            } else if (jsonMonth == month) {
                                if (jsonDay < day) {
                                    if (added == false) {
                                        addListElement(json, i, j, last);
                                        added = true;
                                    }
                                } else if (jsonDay == day) {
                                    // add assignment to existing date
                                    if (added == false) {
                                        let assg = document.createElement("p");
                                        let txt  = document.createTextNode("- " +
                                            json.assignments[i].classes + ": " +
                                            json.assignments[i].assignment);
                                            assg.appendChild(txt);
                                        let list = document.getElementById("dates");
                                        let element = list.childNodes[j];
                                        //let element = date.firstChild;
                                        element.appendChild(assg);
                                        added = true;
                                    }
                                }
                            }
                        }
                        if (added == false) {
                            last = true;
                            addListElement(json, i, 0, last);
                            added = true;
                        }
                    }
                }
            })
            .catch(function(error) {
                console.log(error);
            });
    }

    /**
    This function is a helper to the get function that adds the list elements (assigments) to
    the page.

    @parameter json: parsed text from the file
    @parameter i: current index in assignments
    @parameter j: current index in dates
    @parameter last: a boolean that is true if the element is being added to the end
    and false otherwise
    */
    function addListElement(json, i, j, last){
        // add assignment before current date li element
        let assg = document.createElement("p");
        let txt  = document.createTextNode("- " + json.assignments[i].classes + ": "
            + json.assignments[i].assignment);
        assg.appendChild(txt);
        let newDate = document.createElement("li");
        let text = document.createTextNode(json.assignments[i].date);

        newDate.appendChild(text);
        newDate.appendChild(assg);

        let list = document.getElementById("dates");
        if (last){
            list.appendChild(newDate);
        } else {
            list.insertBefore(newDate, list.childNodes[j]);
        }
    }

    /**
    This function checks the status of the requested server to see if it is a valid request.
    @parameter response: response that is being checked
    @returns message: error message
    */
    function checkStatus(response) {
        if (response.status >= 200 && response.status < 300) {
            return response.text();
        } else if (response.status == 404) {
            return Promise.reject(new Error("Sorry, we couldn't find that page"));
        } else {
            return Promise.reject(new Error(response.status+": "+response.statusText));
        }
    }

})();
