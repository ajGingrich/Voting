'use strict';

(function () {

   var addButton = document.querySelector('.btn-add');
   var deleteButton = document.querySelector('.btn-delete');
   var nextOptionNumber = 3;
   var optionsContainer;

   addButton.addEventListener('click', function () {

      optionsContainer = document.getElementById("options");

      var newDiv = document.createElement("div");
      newDiv.className = "form-group";

      var newInput = document.createElement("input");
      newInput.type = "text";
      newInput.className = "form-control";
      newInput.name = "option" + nextOptionNumber.toString();
      newInput.placeholder = "Option " + nextOptionNumber.toString();

      newDiv.appendChild(newInput);
      optionsContainer.appendChild(newDiv);

      nextOptionNumber++;
      console.log(nextOptionNumber);

   }, false);

    deleteButton.addEventListener('click', function () {

        optionsContainer = document.getElementById("options");
        //check out how many children the container has to verify there are at least two options
        if (optionsContainer.childElementCount > 2) {
            optionsContainer.removeChild(optionsContainer.lastChild);
            nextOptionNumber--;
        }
        else {
            alert('There must be a at least two options');
        }

    }, false);


})();
