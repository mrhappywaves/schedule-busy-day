// Set currentDate variable
var currentDate = moment().format("MMMM Do, YYYY");
// Set currentHour variable
var currentHour = moment().format('h:mm:ss a');
// Use jQuery to select the container div via a proper class
var blockContainer = $('.container');

// Displaying the date and time 
var interval = setInterval(function() {
    var currentTime = moment();
    $('#currentDay').html(currentTime.format('YYYY MMMM DD') + ' '
                    + currentTime.format('dddd')
                    .substring(0,3).toUpperCase());
    $('#currentDay').html(currentDate + " " + currentTime.format('hh:mm:ss A'));
}, 100);

// Set workDate variable
var workDate = moment();

// Use jQuery to create a time block
var newTimeBlock = function (blockHour) {

    // Set up the elements
    var blockSection = $('<section>');
    var blockTime = $('<time>');
    var blockInput = $('<textarea>');
    var blockButton = $('<button>');

    blockSection.addClass('row time-block hour-row');

    // Set the time field
    blockTime.text(blockHour + ':00');
    blockTime.addClass('col-2 hour');

    // Check localStorage for saved content for the hour in question
    getDateTime = workDate.format('YYYYMMDD') + blockHour + ':00';
    eventText = localStorage.getItem(getDateTime) || '';
    if (eventText) {
        blockInput.text(eventText);
    }

    // Create the textarea with potentially earlier saved data.
    blockInput.addClass('col-8 blocktext');
    if (blockHour < currentHour.currentHour) {
        blockInput.addClass('past');
    } else if (blockHour === currentHour.currentHour) {
        blockInput.addClass('present');
    } else {
        blockInput.addClass('future');
    }
    blockInput.css('color', 'black');

    // Save button
    blockButton.html('<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M14 3h2.997v5h-2.997v-5zm9 1v20h-22v-24h17.997l4.003 4zm-17 5h12v-7h-12v7zm14 4h-16v9h16v-9z"/></svg>');
    blockButton.addClass('col-2 saveBtn')

    // Add elements to DOM
    blockSection.append(blockTime);
    blockSection.append(blockInput);
    blockSection.append(blockButton);

    return blockSection;
}

var clickHandler = function (event) {
    // Save the text from the textarea inside the current time-block. Use the hour as a key.
    var saveDateTime = workDate.format('YYYYMMDD') + event.delegateTarget.children[0].innerText;
    localStorage.setItem(saveDateTime, event.delegateTarget.children[1].value);
    event.delegateTarget.children[1].value = '';
    updateDayTasks();
}

var prevHandler = function() {
    workDate.subtract(1, 'days'); 
    updateWorkDay();
}

var nextHandler = function() {
    workDate.add(1, 'days');
    updateWorkDay();
}

var todayHandler = function() {
    workDate = moment();
    updateWorkDay();
}

var updateWorkDay = function() {
    $('.workDay').text(workDate.format('dddd, MMM Do'));
    updateDayTasks();
}

var updateDayTasks = function () {
    
    var rowArray = $('.blocktext');
    var hour = workDayFisrtH;

    for (var i = 0; i < rowArray.length; i++) { 
        rowArray[i].value = '';
        rowArray[i].classList.remove('present', 'past', 'future');
        getDateTime = workDate.format('YYYYMMDD') + hour + ':00';
        eventText = localStorage.getItem(getDateTime) || '';
        if (eventText) {
            rowArray[i].value = eventText;
        }
        if (moment(getDateTime, 'YYYYMMDDhh:mm').isBefore(moment(), 'hour') ) {
            rowArray[i].classList.add('past');
        } else if (workDate.isSame(moment(), 'day') && hour === moment().hour()) {
            rowArray[i].classList.add('present');
        } else {
            rowArray[i].classList.add('future');
        }
        hour++;
    }
}

const workDayFisrtH = 5 // Setting the start of the workday to 5AM
const workDayLastH = 22 // Setting the last working hour to start at 10PM

var init = function () {

    // Create working header

    $('.workDay').text(workDate.format('dddd, MMM Do'));

    for (var i = workDayFisrtH; i <= workDayLastH; i++) {
        blockContainer.append(newTimeBlock(i));
    }

    $('.hour-row').on('click', 'button', clickHandler);
    $('.prevBtn').on('click', prevHandler);
    $('.nextBtn').on('click', nextHandler);
    $('.todayButton').on('click', todayHandler);
}

// Set up the click handler on the time-block and use delegation.

init();