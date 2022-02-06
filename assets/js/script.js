let tasks = ['', '', '', '', '', '', '', '', ''];
let now = new moment();

//hour is time block ID + 9;


// on click of the p element, turn it into a textarea
$('.schedule').on("click", 'p', function() {
    let text = $(this)
                .text()
                .trim();
                console.log('editing: '+text);
    let classPreservation = $(this).attr("class");
    let textInput = $("<textarea>")
                .addClass("form-control "+ classPreservation)
                .val(text);
    $(this).replaceWith(textInput);
    textInput.trigger("focus");
} );

// on save button press, save textArea to p and local storage
$(".time-block .saveBtn").on("click", function() {
    let textAreaEl = $(this).siblings('textarea');
    let textInput = textAreaEl.val().trim();
    console.log('saving: '+ textInput);

    let classPreservation = textAreaEl.attr("class").replace("form-control ","");

    let hour = $(this)
        .closest('.time-block')
        .index();

    // save updated task to Local Storage
    tasks[hour] = textInput;
    saveTasks();

    // recreate and replace p element
    let taskPEl = $("<p>")
                .addClass(classPreservation)
                .text(textInput);
    textAreaEl.replaceWith(taskPEl);
})

/* 
// Set an interval to auto update task classes for past-present-future
setInterval(() => {
    $('.time-block').each( (index, el) =>{
        auditTask(el);
    });
}, ((1000* 60) * 30));
 */

// Audit tasks to determine past/present/future
auditTask = (element) => {
   /* 
    * evalTime = elementTimeHour - currentTimeHour
    * if evalTime is negative, the block is in the past;
    * if evalTime is 0, the block is in the present;
    * if evalTime is positive, block is in the future.
    * Set coloring tasks appropriately
    **/
    let elemID = element.id;
    let timeEval = 9 + parseInt(elemID, 10) - moment().hour();
    
    if(timeEval < 0){
        $("#"+ elemID).addClass("past");
    } else if(timeEval === 0){
        $("#"+ elemID).addClass('present');
    } else {
        $("#"+ elemID).addClass('future');
    }
};

// load tasks function
loadTasks = () => {
    tasks = JSON.parse( localStorage.getItem("tasks") );

    $('.time-block').each( (index, el) =>{
        el.querySelector("p").innerHTML = tasks[index];
        
        auditTask(el);
    });

};

//save tasks function
saveTasks =() => {
    localStorage.setItem("tasks", JSON.stringify(tasks) );
};

//on page load:
//set current date
$("#currentDay").text(moment().format("MMMM Do YYYY"));
//run load tasks
loadTasks();