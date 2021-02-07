let arrTime = [" ", "9:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"];
let arrDay = ["Name", "Monday ", "Tuesday ", "Wednesday ", "Thursday ", "Friday "];
let form = document.getElementById('form');
let selectedTime = document.getElementById('time');
let selectDay = document.getElementById('day');
let inputName = document.getElementById('name');
let cancel = document.getElementById('Cancel');
let create = document.getElementById('Create');
let partys = document.getElementById('Participants');
let addNewParty = document.getElementById('addNewParty');
let inputNewParty = document.getElementById('newParty');
let selectPartys = ["reset", "Чебурашка", "Крокодил Гена", "Шапокляк", "Крыса Лариса"];
let littleButton = document.getElementById("littleButton");
let eventMap = new Map;
create.addEventListener("click", checkForm);
cancel.addEventListener('click', cleanForm);
addNewParty.addEventListener('click', addNewMember);


function removeEvent(event) {
    let cell = event.currentTarget.parentNode;
    let flag = confirm("You relly want to delete events?");
    if (flag == false) return;
    eventMap.delete(cell);
    cell.setAttribute("class","cornsilk")
    cell.innerHTML = " ";
    cell.removeEventListener("click", removeEvent);
}

function filterName(event) {
    let value = event.currentTarget.value;
    eventMap.forEach((item, cell)=>{
        cell.setAttribute("class","green");
        if(item.participants.indexOf(value) != -1){
            cell.setAttribute("class","pink");
        }
    });
};

function addNewMember() {
    if (inputNewParty.value == "") {
        return
    }
    createTag(partys, "option", " ", inputNewParty.value);
    createTag(document.getElementById('filterByName'), "option", "", inputNewParty.value);
    inputNewParty.value == "";
}

function checkForm() {
    let time = arrTime.indexOf(selectedTime.value);
    let day = arrDay.indexOf(selectDay.value);
    let cell = table.rows[time].cells[day];
    let selected = Array.from(partys.selectedOptions).map(option => option.value);

    if (eventMap.has(cell)) {
        createMessageUpper("This time is booked out");
        return;
    };
    if (inputName.value.trim() == "" || selected.length == 0) {
        createMessageUpper("Please fill out the form");
        return;
    };
    createNewEvent(cell, selected);
};

function createNewEvent(cell, selected) {
    
    let objForm = {
        name: inputName.value,
        participants: selected,
    };
    decorated(cell, objForm);
    eventMap.set(cell, objForm);
};

function decorated(cell, objForm) {
    cell.setAttribute("class","green");
    cell.innerHTML = objForm.name;
    let button = createTag(cell, 'button', 'littleButton', "X").addEventListener("click", removeEvent);
    
};

function cleanForm() {
    inputName.value = " ";
    selectDay.value = "Monday";
    selectedTime.value = "9:00";
    newParty.value = " ";
    partys.value = " ";
    form.style.display = "none";
};

function createMessageUpper(error) {
    let message = createTag(document.body, 'div', "message", error);
    let coords = form.getBoundingClientRect();
    message.style.left = coords.left + "px";
    message.style.bottom = coords.bottom + "px";
    message.style.width = form.offsetWidth + 'px';
    setTimeout(() => message.remove(), 2000);
};

function showForm() {
    form.style.display = "block";
    setPosition(form);
};

function createContainer() {
    let container = createTag(document.body, 'div', "container");
    let head = createTag(container, 'div', "head");
    createTag(head, "h1", "", "calendar");
    createTag(head, "select", "filterByName").addEventListener('change', filterName);
    createSelect(selectPartys, document.getElementById("filterByName"), "option");
    createTag(head, "button", "", "New event +").addEventListener("click", showForm);
    createTable();
};


function createTable() {
    let timetable = createTag(container, 'table', 'table');
    arrTime.forEach((item, index) => {
        let tr = createTag(timetable, "tr");
        arrDay.forEach((value, i) => {
            if (index == 0) {
                if (value == "Name") {
                   createTag(tr, 'th', "", value);
                } else {
                    createTag(tr, 'th', "", value);
                }
            } else {
                if (i == 0) createTag(tr, 'td', "", item);
                else {
                   createTag(tr, 'td');
                }
            };
        });
    });
    setPosition(container);
};


function setPosition(elem) {
    let centerX = document.documentElement.clientWidth;
    let centerY = document.documentElement.clientHeight;
    let width = elem.offsetWidth;
    let height = elem.offsetHeight;
    elem.style.left = (centerX - width) / 2 + 'px';
    elem.style.top = (centerY - height) / 2 + 'px';
};

function createSelect(arr, parent, tag) {
    arr.forEach(item => {
        createTag(parent, tag, "", item).setAttribute("value", item);
    });
};

function createTag(parent, tag, id, text) {
    let name = document.createElement(tag);
    if (text) name.innerHTML = text;
    if (id) name.setAttribute("id", id);
    parent.append(name);
    return name;
}

createSelect(selectPartys.slice(1), partys, "option");
createSelect(arrTime.slice(1), selectedTime, "option");
createSelect(arrDay.slice(1), selectDay, "option");
createContainer();
let table = document.getElementById('table');