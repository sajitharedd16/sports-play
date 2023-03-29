/* eslint-disable no-var */
/* eslint-disable eqeqeq */
/* eslint-disable no-undef */
const todoList = () => {
  all = []
  const add = (todoItem) => {
    all.push(todoItem)
  }
  const markAsComplete = (index) => {
    all[index].completed = true
  }

  const overdue = () => {
    arr = all.filter(
      (item) => item.dueDate < new Date().toISOString().slice(0, 10)
    )
    return arr
  }

  const dueToday = () => {
    arr = all.filter(
      (item) => item.dueDate === new Date().toISOString().slice(0, 10)
    )
    return arr
  }

  const dueLater = () => {
    arr = all.filter(
      (item) => item.dueDate > new Date().toISOString().slice(0, 10)
    )
    return arr
  }

  const toDisplayableList = (list) => {
    displayablestring = list.map((item) =>
          `${item.completed ? '[x]' : '[ ]'} ${item.title} ${item.dueDate === new Date().toISOString().slice(0, 10) ? '' : item.dueDate}`
    ).join('\n')
    return displayablestring.trimEnd()
  }

  return {
    all,
    add,
    markAsComplete,
    overdue,
    dueToday,
    dueLater,
    toDisplayableList
  }
}

const todos = todoList()

const formattedDate = (d) => {
  return d.toISOString().split('T')[0]
}

var d = new Date()
const today = formattedDate(d)
const yesterday = formattedDate(new Date(d.setDate(d.getDate() - 1)))
const tomorrow = formattedDate(new Date(d.setDate(d.getDate() + 2)))

todos.add({ title: 'Submit assignment', dueDate: yesterday, completed: false })
todos.add({ title: 'Pay rent', dueDate: today, completed: true })
todos.add({ title: 'File taxes', dueDate: tomorrow, completed: false })

console.log('My Todo-list\n')

console.log('Overdue')
var overdues = todos.overdue()
var formattedOverdues = todos.toDisplayableList(overdues)
console.log(formattedOverdues)
console.log()

console.log('Due Today')
let itemsDueToday = todos.dueToday()
let formattedItemsDueToday = todos.toDisplayableList(itemsDueToday)
console.log(formattedItemsDueToday)
console.log()

console.log('Due Later')
let itemsDueLater = todos.dueLater()
let formattedItemsDueLater = todos.toDisplayableList(itemsDueLater)
console.log(formattedItemsDueLater)

module.exports = todoList
