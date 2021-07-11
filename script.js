let TC = document.querySelector(".ticket-container");
let allFilters = document.querySelectorAll(".filter");
let deleteButton = document.querySelector(".delete");
let modalVisible = false;
let selectedPriority = "pink";
let selectedTicketsColor = undefined;

function loadTickets(priority) {
    let allTaskData = localStorage.getItem("allTasks");
    if (allTaskData != null) {
        let data = JSON.parse(allTaskData);
        if(priority) {
            data = data.filter(function(ticket){
                return ticket.selectedPriority == priority;
            });
        }
        TC.innerHTML = "";
        for (let i = 0; i < data.length; i++) {
            let ticket = document.createElement("div");
            ticket.classList.add("ticket");
            ticket.innerHTML = `<div class="ticket-color ticket-color-${data[i].selectedPriority}"></div>
                    <div class="ticket-id">${data[i].taskId}</div>
                    <div class="task">
                        ${data[i].task}
                    </div>`;
            ticket.addEventListener("click", function (e) {
                if (e.currentTarget.classList.contains("active")) {
                    e.currentTarget.classList.remove("active");
                } else {
                    e.currentTarget.classList.add("active");
                }
            });
            TC.appendChild(ticket);
        }
    }
}
loadTickets();

for (let i = 0; i < allFilters.length; i++) {
    allFilters[i].addEventListener("click", filterHandler);
}

function filterHandler(e) {
    if (e.currentTarget.classList.contains("active")) {
        e.currentTarget.classList.remove("active");
        loadTickets();
    } else {
        let selectedFIlter = document.querySelector(".filter.active");
        if (selectedFIlter) {
            selectedFIlter.classList.remove("active");
        }
        e.currentTarget.classList.add("active");
        loadTickets(e.currentTarget.children[0].classList[0].split("-")[0]);
    }
}

let addButton = document.querySelector(".add");  // will access add button 

addButton.addEventListener("click", showModal);  // applying eventListener on the add button when clicked

function showModal(e) {
    if (!modalVisible) {  // if modal is not visible,then perform the next instructions
        let modal = document.createElement("div"); // creating div tag in the modal
        modal.classList.add("modal"); // adding modal class to the div tag

        // writing the content of div tag with backslash tick(`)
        modal.innerHTML = `<div class="task-to-be-added" spellcheck="false" data-type="false" contenteditable="true">
                        <span class="placeholder">Enter your text here</span>
                    </div>
                    <div class="priority-list">
                        <div class="pink-modal-filter modal-filter active"></div>
                        <div class="blue-modal-filter modal-filter"></div>
                        <div class="green-modal-filter modal-filter"></div>
                        <div class="yellow-modal-filter modal-filter"></div>
                    </div>`;
        TC.appendChild(modal);
        selectedPriority = "pink";
        let taskTyper = document.querySelector(".task-to-be-added");
        taskTyper.addEventListener("click", function (e) {
            if (e.currentTarget.getAttribute("data-type") == "false") {
                e.currentTarget.innerHTML = "";  // will empty the placeholder when clicked on it.
                e.currentTarget.setAttribute("data-type", "true");
            }
        });
        taskTyper.addEventListener("keypress", addTicket.bind(this, taskTyper));
        modalVisible = true;
        // accesing all the moadl filters(color btn)
        let modalFilters = document.querySelectorAll(".modal-filter");
        //applying eventListener on the selected modal i.e; click is the eventlistener 
        for (let i = 0; i < modalFilters.length; i++) {
            modalFilters[i].addEventListener("click", selectPriority);
        }
    }
}

// the main aim of selectedPriority function is to access the active class modal filter ,then remove that active class from that modalfilter and add tha active class to the clicked modal filter.
function selectPriority(e) {
    let activeFilter = document.querySelector(".modal-filter.active");  // will access the class(color-btn) on which active class is applied
    activeFilter.classList.remove("active");  // will then remove that active class from the previously accessed class
    selectedPriority = e.currentTarget.classList[0].split("-")[0];
    e.currentTarget.classList.add("active"); // will add active class to the clicked span color btn in modal filter
}

function addTicket(taskTyper, e) {
    if (e.key == "Enter" && e.shiftKey == false && taskTyper.innerText.trim() != "") {
        // let ticket = document.createElement("div");
        // ticket.classList.add("ticket");
        let id = uid();
        let task = taskTyper.innerText;
        // ticket.innerHTML = `<div class="ticket-color ticket-color-${selectedPriority}"></div>
        //             <div class="ticket-id">${id}</div>
        //             <div class="task">
        //                 ${task}
        //             </div>`;
        document.querySelector(".modal").remove();
        modalVisible = false;
        // ticket.addEventListener("click", function (e) {
        //     if (e.currentTarget.classList.contains("active")) {
        //         e.currentTarget.classList.remove("active");
        //     } else {
        //         e.currentTarget.classList.add("active");
        //     }
        // });
        // TC.appendChild(ticket);
        let allTaskData = localStorage.getItem("allTasks");
        if (allTaskData == null) {
            let data = [{ "taskId": id, "task": task, "selectedPriority": selectedPriority }];
            localStorage.setItem("allTasks", JSON.stringify(data));
        } else {
            let data = JSON.parse(allTaskData);
            data.push({ "taskId": id, "task": task, "selectedPriority": selectedPriority });
            localStorage.setItem("allTasks", JSON.stringify(data));
        }
        let selectedFilter = document.querySelector(".filter.active");
        if(selectedFilter) {
            let priority = selectedFilter.children[0].classList[0].split("-")[0];
            loadTickets(priority);
        } else {
            loadTickets();
        }
    } else if (e.key == "Enter" && e.shiftKey == false) {
        e.preventDefault(); // will prevent adding empty ticket to the project
        alert("you have not typed anything");  // will give alert box ehen empty task is added
    }
}

deleteButton.addEventListener("click", function (e) {
    let selectedTickets = document.querySelectorAll(".ticket.active");
    let allTasks = JSON.parse(localStorage.getItem("allTasks"));
    for (let i = 0; i < selectedTickets.length; i++) {
        selectedTickets[i].remove();
        allTasks = allTasks.filter(function (data) {
            return data.taskId != selectedTickets[i].querySelector(".ticket-id").innerText;
        })
    }
    localStorage.setItem("allTasks", JSON.stringify(allTasks));
});