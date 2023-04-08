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

module.exports = todoList
