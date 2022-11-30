function eventListeners() {
  const showBtn = document.getElementById("btn");
  const questionCard = document.querySelector(".box");
  const closeBtn = document.querySelector(".cross-btn");
  const form = document.getElementById("form");
  const feedback = document.querySelector(".feedback");
  const questionInput = document.getElementById("question-input");
  const answerInput = document.getElementById("answer-input");
  const questionList = document.getElementById("questions-list");

  let id;

  //new ui instance
  const ui = new UI();
  //retrieve questions from local storage
  let data = ui.retrieveLocalStorgage();
  if (data.length > 0) {
    id = data[data.length - 1].id + 1;
  } else {
    id = 1;
  }
  data.forEach(function (question) {
    ui.addQuestion(questionList, question);
  });
  //show question form
  showBtn.addEventListener("click", function () {
    ui.showQuestion(questionCard);
  });
  //hide question form
  closeBtn.addEventListener("click", function () {
    ui.hideQuestion(questionCard);
  });
  //add question
  form.addEventListener("submit", function (event) {
    event.preventDefault();

    const questionValue = questionInput.value;
    const answerValue = answerInput.value;

    if (questionValue === "" || answerValue === "") {
      feedback.classList.add("showItem", "alert-danger");
      feedback.textContent = "Cannot add empty values";

      setTimeout(function () {
        feedback.classList.remove("alert-danger", "showItem");
      }, 3000);
    } else {
      const question = new Question(id, questionValue, answerValue);
      data.push(question);
      ui.addToLocalStorage(data);
      id++;
      ui.addQuestion(questionList, question);
      ui.clearFields(questionInput, answerInput);
    }
  });
  //work with a question
  questionList.addEventListener("click", function (event) {
    event.preventDefault();
    if (event.target.classList.contains("delete")) {
      let id = event.target.dataset.id;

      questionList.removeChild(
        event.target.parentElement.parentElement.parentElement
      );
      // rest of data
      let tempData = data.filter(function (item) {
        return item.id !== parseInt(id);
      });
      data = tempData;
      ui.addToLocalStorage(data);
    } else if (event.target.classList.contains("toggle-ans")) {
      event.target.nextElementSibling.classList.toggle("showItem");
    } else if (event.target.classList.contains("edit")) {
      //delete question from DOM
      let id = event.target.dataset.id;
      questionList.removeChild(
        event.target.parentElement.parentElement.parentElement
      );

      //show question in question card
      ui.showQuestion(questionCard);
      //find specific question clicked
      const tempQuestion = data.filter(function (item) {
        return item.id === parseInt(id);
      });
      // rest of data
      let tempData = data.filter(function (item) {
        return item.id !== parseInt(id);
      });
      data = tempData;
      questionInput.value = tempQuestion[0].title;
      questionInput.value = tempQuestion[0].answer;
    }
  });
}
//Contructor function responsible for the display
function UI() {
  //show question card
  UI.prototype.showQuestion = function (element) {
    element.classList.add("showItem");
  };
  //hide question card
  UI.prototype.hideQuestion = function (element) {
    element.classList.remove("showItem");
  };
  //add question
  UI.prototype.addQuestion = function (element, question) {
    const div = document.createElement("div");
    div.classList.add("col-md-4");
    div.innerHTML = `<div class="ans-box">
        <div class="question-list">${question.title}</div>
        <div class="toggle-ques">
        <a href="#" class="toggle-ans">Show/Hide Answer</a>
      </div>
      <h3 class="answer mb-3">${question.answer}</h3>
      <div class="buttons">
   
         <button class="btn-edit edit" id="edit" data-id="${question.id}">Edit</button>
         <button class="btn-edit delete" id="delete" data-id="${question.id}">Delete</button>
        </div>
       </div>`;
    element.appendChild(div);
  };
  //add to Local Storage
  UI.prototype.addToLocalStorage = function (data) {
    localStorage.clear();
    const dataJSON = JSON.stringify(data);
    localStorage.setItem("flash-questions", dataJSON);
  };
  //retrieve from localStorage
  UI.prototype.retrieveLocalStorgage = function () {
    let savedQuestions = localStorage.getItem("flash-questions");
    if (savedQuestions) {
      const savedQuestionsParsed = JSON.parse(savedQuestions);
      return savedQuestionsParsed;
    } else {
      return (savedQuestions = []);
    }
  };

  //clear fields
  UI.prototype.clearFields = function (question, answer) {
    question.value = "";
    answer.value = "";
  };
}
//Constructor function responsible for each question
function Question(id, title, answer) {
  this.id = id;
  this.title = title;
  this.answer = answer;
}
// dom event listener to run when content is loaded
document.addEventListener("DOMContentLoaded", function () {
  eventListeners();
});
