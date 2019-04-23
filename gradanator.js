/**
Authors: David Gonzales and Grace Kaylor
File: gradanator.js
This program performs the javascript for our gradanator portion of the website.
It loads one set of input boxes for the user to input information about their grades
and it allows them to click a button to add more rows for more categories in their
class.
*/

(function()	{
	"use strict";

	window.onload = function() {
		addGradeInputRow();
		document.getElementById("addCategory").onclick = addGradeInputRow;
		document.getElementById("calculate").onclick = calculateGrade;
	};

	/**
	Function to add a div to the gradanator.html page with input boxes for the
	user to input their class and grade information in. Each of the input boxes
	is added to the apprporiate class to make it easy to loop through.
	**/
	function addGradeInputRow() {
		let mainHolder = document.getElementById("inputHolder");

		//	creates category name input box
		let div = document.createElement("div");
		let catName = document.createElement("input");
		catName.setAttribute("type", "text");
		catName.setAttribute("placeholder", "Category Name");
		catName.classList.add("catNames");
		div.appendChild(catName);

		// creates class weight input box
		let catWeight = document.createElement("input");
		catWeight.setAttribute("type", "text");
		catWeight.setAttribute("placeholder", "Cat. Weight (i.e. 10, 20)");
		catWeight.classList.add("classWeights");
		div.appendChild(catWeight);

		// creates score input box
		let yourScore = document.createElement("input");
		yourScore.setAttribute("type", "text");
		yourScore.setAttribute("placeholder", "Your Score");
		yourScore.classList.add("yourScores");
		div.appendChild(yourScore);

		// creates max score input box
		let maxScore = document.createElement("input");
		maxScore.setAttribute("type", "text");
		maxScore.setAttribute("placeholder", "Max Score");
		maxScore.classList.add("maxScores");
		div.appendChild(maxScore);

		mainHolder.appendChild(div);
	}

	/**
	Function that actually performs the grade calculations based on the inputs from the
	user. The program first makes sure that the users entered weights for categories add
	up to 100, and if not, it gives them an alert. If the appropriate weights are entered,
	the user's scores are divided by the max score in each category, and then multiplied by
	the weight. They are added to a total sum and once all categories are checked, their
	grade is displayed at the bottom of the inputs.
	**/
	function calculateGrade() {
		let gradeDiv = document.getElementById("grade");
		let weights = document.getElementsByClassName("classWeights");
		let weightSum = 0;
		let badInput = false;
		for (let i = 0; i < weights.length; i ++) {
			weightSum += parseInt(weights[i].value);
		}
		if (weightSum != 100) {
			alert("Error: Entered Weights Does Not Add Up To 100");
		} else {
			let scores = document.getElementsByClassName("yourScores");
			let maxVals = document.getElementsByClassName("maxScores");
			let names = document.getElementsByClassName("catNames");
			let totalGrade = 0;
			for (let i = 0; i < scores.length; i ++) {
				if (isNaN(parseInt(scores[i].value)) || isNaN(parseInt(weights[i].value)) ||
					isNaN(parseInt(maxVals[i].value))) {
					alert("Error: Integer not entered for category " + names[i].value);
					badInput = true;
					break;
				} else {
					let yourGrade = parseInt(scores[i].value);
					let max = parseInt(maxVals[i].value);
					let weight = parseInt(weights[i].value);
					totalGrade += Math.round(yourGrade / max * weight);
				}
			}
			// prints out the calculated grade
			if (!badInput) {
				gradeDiv.innerHTML = "Your calculated grade is: " + totalGrade + "%";
			}

		}
	}
}) ();
