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
let eventArr = [];
let arrTd = [];
let currentMonday = getCurrentMonday();
let indexCurentMonday = 0;
let valueFilterName = "reset";
let currentElem = null;
create.addEventListener("click", checkForm);
cancel.addEventListener('click', cleanForm);
addNewParty.addEventListener('click', addNewMember);
let startDate = getCurrentMonday();


function createContainer() {
    let container = createTag(document.body, 'div', "container");
    let head = createTag(container, 'div', "head");
    createTag(head, "h1", "", "calendar");
    createTag(head, "select", "filterByName").addEventListener('change', filterName);
    createSelect(selectPartys, document.getElementById("filterByName"), "option");
    createTag(head, "button", "", "New event +").addEventListener("click", showForm);
    createTag(head, "button", "", "< Previous week").addEventListener('click', previousWeek);
    createTag(head, "button", "", "Next week >").addEventListener('click', nextWeek);
    createTable(startDate);
};

function returnThisWeek() {
    indexCurentMonday = 0;
    reRenderTable();
};

function showForm() {
    form.style.display = "block";
    setPosition(form);
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
    if (eventArr[indexCurentMonday].has(cell)) {
        createMessageUpper("This time is booked out");
        return;
    };
    if (inputName.value.trim() == "" || selected.length == 0) {
        createMessageUpper("Please fill out the form");
        return;
    };
    createNewEvent(cell, selected);
};

function filterName(event) {
    if (event) valueFilterName = event.currentTarget.value;
    eventArr[indexCurentMonday].forEach((item, cell) => {
        if (!(typeof(cell) == "string")) {
            cell.setAttribute("class", "green");
            item.classColor = "green";
            if (item.participants.indexOf(valueFilterName) != -1) {
                cell.setAttribute("class", "pink");
                item.classColor = "pink";
            };
        };
    });
};


function createNewEvent(cell, selected) {
    let map = eventArr[indexCurentMonday]
    let objForm = {
        name: inputName.value,
        participants: selected,
        classColor: "green"
    };
    map.set(cell, objForm);
    decorated(cell, objForm);
};

function cleanForm() {
    inputName.value = " ";
    selectDay.selectedIndex = 0;
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

function decorated(cell, objForm) {
    cell.setAttribute("class", "green");
    cell.innerHTML = objForm.name;
    let a = createTag(cell, 'button', 'button', "X");
};

function newMap(currentMonday) {
    let map = new Map();
    map.set("monday", stringData(currentMonday));
    eventArr.push(map);
    return map;
};

function removeEvent(button) {
    let cell = button.parentNode;
    let flag = confirm("You relly want to delete events?");
    if (flag == false) return;
    cell.removeAttribute("class");
    cell.innerHTML = " ";
    removeEventFromArr(cell);
};

function removeEventFromArr(cell) {
    eventArr[indexCurentMonday].delete(cell);
};

function createTable(startDate) {
    let startMonday = new Date(startDate);
    newMap(startDate);
    let timetable = createTag(container, 'table', 'table');
    arrTime.forEach((item, index) => {
        let tr = createTag(timetable, "tr");
        arrDay.forEach((value, i) => {
            if (index == 0) {
                if (value == "Name") {
                    createTag(tr, 'th', "", value).setAttribute("currentDay", stringData(startMonday));
                } else {
                    createTag(tr, 'th', "", value + startMonday.getDate());
                    startMonday.setDate(startMonday.getDate() + 1);
                }
            } else {
                if (i == 0) createTag(tr, 'td', "", item);
                else arrTd.push(createTag(tr, 'td'));
            };
        });
    });
    setPosition(container);
};

function createTag(parent, tag, id, text) {
    let name = document.createElement(tag);
    if (text) name.innerHTML = text;
    if (id) name.setAttribute("id", id);
    parent.append(name);
    return name;
}

function getCurrentMonday() {
    let currentDate = new Date();
    let day = currentDate.getDay();
    currentDate.setDate(currentDate.getDate() - day + 1);
    return currentDate;
};

function reRenderTable() {
    let map;
    renameHeaders();
    arrTd.forEach(item => {
        if (item.innerHTML) {
            item.innerHTML = "";
            item.removeAttribute("class");
        };
    });
    eventArr.forEach((item, index) => {
        if (item.get("monday") == stringData(currentMonday)) {
            map = item;
            indexCurentMonday = index;
            item.forEach((value, key) => {
                if (!(typeof(key) == "string")) {
                    key.setAttribute("class", value.classColor);
                    key.innerHTML = value.name;
                    createTag(key, 'button', 'button', "X");
                };
            });
            filterName();
        };
    });
    if (!map) {
        map = newMap(currentMonday);
        indexCurentMonday = eventArr.length - 1;
    }
};



function getArrTh() {
    return Array.from(document.getElementsByTagName("th"));
}

function renameHeaders(currentMonday) {
    let data = new Date(currentMonday);
    getArrTh().forEach((item, index) => {
        if (index == 0) {
            item.setAttribute('currentDay', stringData(currentMonday));
        } else {
            let days = item.innerHTML.split(" ");
            item.innerHTML = days[0] + " " + data.getDate();
            data.setDate(data.getDate() + 1);
        }
    });
};

function nextWeek() {
    currentMonday = new Date(currentMonday.getFullYear(), currentMonday.getMonth(), currentMonday.getDate() + 7);
    reRenderTable();
};

function previousWeek() {
    currentMonday = new Date(currentMonday.getFullYear(), currentMonday.getMonth(), currentMonday.getDate() - 7);
    reRenderTable();
};

function stringData(date) {
    return "" + date.getFullYear() + " " + date.getMonth() + " " + date.getDate();
}

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
createSelect(selectPartys.slice(1), partys, "option");
createSelect(arrTime.slice(1), selectedTime, "option");
createSelect(arrDay.slice(1), selectDay, "option");
createContainer();
let table = document.getElementById('table');
table.onmouseover = function(event) {
    if (currentElem) return;
    let target = event.target.closest('td');
    if (!target) return;
    if (!target.innerHTML) return;
    if (target.cellIndex == 0) return;
    if (!table.contains(target)) return;
    currentElem = target;
    target.innerHTML += "<span> participants: " + eventArr[indexCurentMonday].get(target).participants.join(", ") + "</span>"
};


table.onmouseout = function(event) {
    if (!currentElem) return;
    let relatedTarget = event.relatedTarget;
    while (relatedTarget) {
        if (relatedTarget == currentElem) return;
        relatedTarget = relatedTarget.parentNode;
    }
    if (currentElem.lastElementChild.tagName == "SPAN") currentElem.lastElementChild.remove();


    currentElem = null;
};
table.addEventListener("click", removeCell);

function removeCell(event) {
    let target = event.target;

    if (target.tagName != 'BUTTON') return;

    removeEvent(target);
};