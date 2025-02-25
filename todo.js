let form=document.getElementById("form")
let todoInput=document.getElementById("todo-input")
let todoItemContainer=document.getElementById("todo-item-container")
let error=document.getElementById("error")
let button= document.getElementById("button")
let mainContainer=document.querySelector(".main-container")
let clickSound=document.getElementById("checkSound")
// todo array
let newArray=[]
let editingSignal=-1

// event listener for the form
form.addEventListener("submit",collectTodo)
function collectTodo(event){
  event.preventDefault()
  let todoInputValue=todoInput.value
  console.log(todoInputValue)
  if(todoInputValue.length===0){
    alert("😒😒😒")
    return
  }else if(editingSignal>=0){
      newArray=newArray.map(function(item,index){
         if(editingSignal===index){
          return{
            todoItem:todoInputValue,
            completed:item.completed
          }
         }else{
          return{
            todoItem:item.todoItem,
            completed:item.completed
          }
         }
      })
      button.textContent="Add Todo Item"
  }else{
    const todoObject={
      todoItem:todoInputValue,
      completed:false
    }
    newArray.push(todoObject)
  }
   

  // push object to an array
  localStorage.setItem("todoItems",JSON.stringify(newArray))
  form.reset()
  showTodo()
}

function fetchTodo(){
  if(localStorage.getItem("todoItems")){
    newArray=JSON.parse(localStorage.getItem("todoItems"))
  }
  showTodo()
}
fetchTodo()

// show todo on UI
function showTodo(){
  todoItemContainer.innerText=""

  if (newArray.length === 0) {
    todoItemContainer.style.display = "none"; // Hide if empty
    return;
  } else {
    todoItemContainer.style.display = "block"; // Show when items exist
  }

  newArray.forEach(function(item,index){
   let todoPrint= item.todoItem

   let todoItemDiv=document.createElement("div")
   todoItemDiv.classList.add("todo-item")
   todoItemDiv.setAttribute("id",`${index}`)

   let leftSideDiv=document.createElement("div")
   leftSideDiv.classList.add("left-side")

   let uncheckedIcon=document.createElement("i")
   uncheckedIcon.classList.add("fa-regular","fa-circle")
   uncheckedIcon.setAttribute("data-action","checked")

   let checkedIcon=document.createElement("i")
   checkedIcon.classList.add("fa-solid" ,"fa-circle-check")
   checkedIcon.setAttribute("data-action","checked")
    
   let todoText=document.createElement("p")
   todoText.textContent=todoPrint
   todoText.setAttribute("data-action","checked")

   leftSideDiv.style.color=document.body.classList.contains("dark-mode")?"black":"black"


   let rightSideDiv=document.createElement("div")
   rightSideDiv.classList.add("right-side")
   rightSideDiv.style.color=document.body.classList.contains("dark-mode")?"black":"black"

   let editIcon=document.createElement("i")
   editIcon.classList.add("fa-solid", "fa-pen")
   editIcon.setAttribute("data-action","edit")
   editIcon.setAttribute("title","Edit")

   let deleteIcon=document.createElement("i")
   deleteIcon.classList.add("fa-solid", "fa-trash")
   deleteIcon.setAttribute("data-action","delete")
   deleteIcon.setAttribute("title","delete")

   if(item.completed===false){
     leftSideDiv.append(uncheckedIcon,todoText)
     rightSideDiv.append(editIcon,deleteIcon)
     todoItemDiv.append(leftSideDiv,rightSideDiv)
     todoItemContainer.append(todoItemDiv)
     
   }else{
    leftSideDiv.append(checkedIcon,todoText)
     rightSideDiv.append(editIcon,deleteIcon)
     todoItemDiv.append(leftSideDiv,rightSideDiv)
     todoItemContainer.append(todoItemDiv)
     
   }
  })

}
showTodo()

todoItemContainer.addEventListener("click",targetTodoItem)
function targetTodoItem(e){
  let targetOfUser=e.target
   let grandParent=targetOfUser.parentElement.parentElement
   if(!grandParent.classList.contains("todo-item"))return
   console.log(grandParent)
   
   let todoId=Number(grandParent.id)
   let clickedAction=targetOfUser.dataset.action

  if(clickedAction==="checked"){
    let previousState = newArray[todoId].completed; // Store previous state
    checkATodoItem(todoId);
      let newState = newArray[todoId].completed; // Check new state
      if (!previousState && newState) { // Play sound only if changing from false -> true
          clickSound.play();
          let sound=setTimeout(()=>{
             alert("weldone 🎉 you just completed a task")
          },1000)
          
      }
  
  }else if(clickedAction==="edit"){
    editTodo(todoId)
  }
  else if(clickedAction==="delete"){
    deleteTodo(todoId)
  }
}

// How to check
function checkATodoItem(ID){
    newArray=newArray.map(function(item,index){
      if(index===ID){
        return{
          todoItem:item.todoItem,
          completed:!item.completed
        }
       
      }else{
        return{
          todoItem:item.todoItem,
          completed:item.completed
        }
        
      }
   }) 
   showTodo()
}

// how to edit
function editTodo(ID){
  if(newArray[ID].completed){
   alert("You cannot edit a  checked Todo item")
   
    return
  }
  todoInput.value=newArray[ID].todoItem
  button.textContent="Update Todo"
  editingSignal=ID
}

// deleting todo
function deleteTodo(ID){
  newArray=newArray.filter(function(item,index){
      return index!==ID
  })
  
  showTodo()
}



const but = document.getElementById("theme-toggle");

 but.addEventListener("click", function() {

     if (this.dataset.theme === "light") {
        this.dataset.theme = "dark";
        document.body.style.backgroundColor = "black";
         todoItemContainer.style.backgroundColor="black"
         todoItemContainer.style.border="1px solid white"
          
         let children = todoItemContainer.children;

         for (let child of children) {
             let grandchildren = child.children; // Get grandchildren
             for (let grandchild of grandchildren) {
                 grandchild.style.color = "black"; // Change grandchild's color
             }
         }
         
         
        document.body.style.color = "white";
        mainContainer.style.backgroundColor="black"
        mainContainer.style.border="1px solid white"
        but.textContent="Switch to Light mode"
        document.body.classList.add("dark-mode");
        
     } else {
        this.dataset.theme = "light";
        document.body.style.backgroundColor = "white";
        mainContainer.style.backgroundColor="#dedcdc"
            todoItemContainer.style.backgroundColor="white"

        document.body.style.color = "black";
        document.body.classList.remove("dark-mode");
         but.innerText="Switch to Dark mode"
         
     }
    console.log("Current theme:", this.dataset.theme);
   
    
    
 });
 