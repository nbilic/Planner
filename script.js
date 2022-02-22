const current = new Date();
const currentMonth = current.getMonth();
const displayedMonth = document.querySelector(".current-month");
let displayedYear = current.getFullYear();
let offset = 0;

const months = {
  0: "January",
  1: "February",
  2: "March",
  3: "April",
  4: "May",
  5: "June",
  6: "July",
  7: "August",
  8: "September",
  9: "October",
  10: "November",
  11: "December",
};

const days = {
  1: "Monday",
  2: "Tuesday",
  3: "Wednesday",
  4: "Thursday",
  5: "Friday",
  6: "Saturday",
  0: "Sunday",
};
const daysInMonth = (year, month) => new Date(year, month, 0).getDate();

displayedMonth.innerText = `${
  months[current.getMonth()]
} ${current.getFullYear()}`;

// User clicks to go backwards on the calendar
document.querySelector(".prev-month").addEventListener("click", () => {
  offset--;
  const n = 12 + (current.getMonth() + (offset % -12));
  if (n % 12 === 11 && (n + 1) % 12 === 0) displayedYear--;
  displayedMonth.innerText = `${months[n % 12]} ${displayedYear}`;
  renderCalendar(displayedYear, (n % 12) + 1);
});

// User clicks to go forwards on the calendar
document.querySelector(".next-month").addEventListener("click", () => {
  offset++;
  const n = 12 + (current.getMonth() + (offset % 12));
  if ((n - 1) % 12 === 11 && n % 12 === 0) displayedYear++;
  displayedMonth.innerText = `${months[n % 12]} ${displayedYear}`;
  renderCalendar(displayedYear, (n % 12) + 1);
});

// Display the calendar
const renderCalendar = (year, month) => {
  document.querySelector(".calendar-body").innerHTML = null;
  let counter = 0;
  const tasks = JSON.parse(localStorage.getItem("Task"));

  // Display empty squares for every day before the 1st of the month
  if (new Date(year, month - 1, 1).getDay() !== 1) {
    const difference = Math.abs(new Date(year, month - 1, 0).getDay());
    for (let i = 0; i < difference; i++, counter++) {
      const emptyBox = document.createElement("div");
      emptyBox.classList.add("calendar-box");
      emptyBox.classList.add("calendar-box-empty");
      document.querySelector(".calendar-body").append(emptyBox);
    }
  }
  for (let i = 1; i <= daysInMonth(year, month); i++, counter++) {
    const box = document.createElement("div");
    box.innerText = i;
    box.classList.add("calendar-box");
    document.querySelector(".calendar-body").append(box);

    // Color the day to display a task is due that day
    tasks.forEach((task) => {
      if (task.status === "active" && task.date === `${i}/${month}/${year}`) {
        box.classList.add("task-pending");
      }
    });

    // Opens modal with the form
    box.addEventListener("click", () => {
      document.querySelector(".task-date").innerText = `${i}/${month}/${year}`;
      const modal = document.querySelector(".modal");
      const closeButton = document.querySelector(".close");
      modal.style.display = "flex";
      closeButton.addEventListener("click", () => {
        modal.style.display = "none";
      });

      window.onclick = function (event) {
        if (event.target == modal) {
          modal.style.display = "none";
        }
      };
    });
  }
};

// Submit the form
document.querySelector(".submit-form").addEventListener("click", (e) => {
  const modal = document.querySelector(".modal");
  const taskTitle = document.getElementById("task-title");
  const taskDesc = document.getElementById("task-desc");
  const taskDate = document.querySelector(".task-date");
  const Task = {
    title: taskTitle.value,
    desc: taskDesc.value,
    date: taskDate.innerText,
    status: "active",
  };

  // Check if title is > 0
  if (Task.title.length === 0) {
    const titleInput = document.getElementById("task-title");
    titleInput.placeholder = "Task title is required!";
    titleInput.style.borderColor = "red";
  } else {
    taskDesc.value = "";
    taskTitle.value = "";
    let taskArray = JSON.parse(localStorage.getItem("Task"));
    if (!taskArray) localStorage.setItem("Task", JSON.stringify([Task]));
    else {
      taskArray.push(Task);
      localStorage.setItem("Task", JSON.stringify(taskArray));
      renderCalendar(displayedYear, Task.date.split("/")[1]);
    }

    listOutTasks();
    modal.style.display = "none";
  }
});

// Toggle active tasks display
document.querySelector(".active-task-toggle").addEventListener("click", () => {
  document.querySelector(".active-task-toggle").classList.add("active");
  document.querySelector(".past-task-toggle").classList.remove("active");
  const active = document.querySelector(".task-display");
  const history = document.querySelector(".history-task");
  active.classList.remove("hidden");
  history.classList.add("hidden");
});

// Toggle past tasks display
document.querySelector(".past-task-toggle").addEventListener("click", () => {
  document.querySelector(".active-task-toggle").classList.remove("active");
  document.querySelector(".past-task-toggle").classList.add("active");
  const active = document.querySelector(".task-display");
  const history = document.querySelector(".history-task");
  active.classList.add("hidden");
  history.classList.remove("hidden");
});

// Display all of the tasks
const listOutTasks = () => {
  const activeTasks = document.querySelector(".active-task");
  const historyTasks = document.querySelector(".history-task");
  const taskArray = JSON.parse(localStorage.getItem("Task"));
  if (!taskArray) {
    activeTasks.innerText = "You have no tasks left!";
    historyTasks.innerText = "No past tasks to display!";
  } else {
    activeTasks.innerText = null;
    historyTasks.innerText = null;
    taskArray.forEach((task) => {
      const element = document.createElement("div");
      const elementTitle = document.createElement("h4");
      const elementBody = document.createElement("p");
      const resolveIcon = document.createElement("i");
      const deleteIcon = document.createElement("i");
      const taskHeader = document.createElement("div");
      const iconDiv = document.createElement("div");

      elementTitle.classList.add("task-body");

      resolveIcon.classList.add("fas");
      resolveIcon.classList.add("fa-check-circle");
      deleteIcon.classList.add("fas");
      deleteIcon.classList.add("fa-trash-alt");

      task.status === "active" && iconDiv.append(resolveIcon);
      iconDiv.append(deleteIcon);
      iconDiv.classList.add("hidden");

      elementTitle.innerHTML = `${task.title} - ${task.date}`;
      elementBody.innerText = task.desc;

      taskHeader.append(elementTitle);
      taskHeader.append(iconDiv);

      element.append(taskHeader);
      element.append(elementBody);

      taskHeader.classList.add("task-header");
      task.status === "active"
        ? activeTasks.appendChild(element)
        : historyTasks.appendChild(element);

      element.classList.add("task-item");

      element.addEventListener("mouseover", () => {
        iconDiv.classList.remove("hidden");
      });

      element.addEventListener("mouseout", () => {
        iconDiv.classList.add("hidden");
      });

      resolveIcon.addEventListener("click", () => {
        const filterTasks = taskArray.filter((x) => x !== task);
        task.status = "completed";
        filterTasks.push(task);

        localStorage.setItem("Task", JSON.stringify(filterTasks));
        activeTasks.innerHTML = null;
        historyTasks.innerHTML = null;
        listOutTasks();
        renderCalendar(displayedYear, task.date.split("/")[1]);
      });

      deleteIcon.addEventListener("click", () => {
        const filterTasks = taskArray.filter((x) => x !== task);
        localStorage.setItem("Task", JSON.stringify(filterTasks));
        activeTasks.innerHTML = null;
        historyTasks.innerHTML = null;
        listOutTasks();
        renderCalendar(displayedYear, task.date.split("/")[1]);
      });
    });
  }

  if (activeTasks.childElementCount === 0)
    activeTasks.innerText = "You have no tasks left!";
  if (historyTasks.childElementCount === 0)
    historyTasks.innerText = "No past tasks to display!";
};

// Run on startup
listOutTasks();
renderCalendar(current.getFullYear(), current.getMonth() + 1);
