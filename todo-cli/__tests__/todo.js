/* eslint-disable no-undef */
const todoList = require('../todo')

const { all, markAsComplete, add, overdue, dueLater, dueToday } = todoList()

const formattedDate = (d) => {
  return d.toISOString().split('T')[0]
};
const Todaydate = new Date()

describe('ToDolist Test Suite', () => {
  beforeAll(() => {
    add({
      title: 'new todo',
      completed: false,
      dueDate: new Date().toISOString().slice(0, 10)
    })
  })
  test('creating a new todo', () => {
    const countToDoitems = all.length
    add({
      title: 'Test todo',
      completed: false,
      dueDate: new Date().toISOString().slice(0, 10)
    })
    expect(all.length).toBe(countToDoitems + 1)
  })
  test('marking a todo as completed', () => {
    expect(all[0].completed).toBe(false)
    markAsComplete(0)
    expect(all[0].completed).toBe(true)
  })
  test('retrieval of overdue items test', () => {
    const sampledate = formattedDate(
      new Date(new Date().setDate(Todaydate.getDate() - 1))
    )
    const sampletodo = {
      title: 'Sample overdue testcase',
      dueDate: sampledate,
      completed: false
    }
    add(sampletodo)
    expect(overdue().length).toBe(1)
  })
  test('retrieval of due later items test', () => {
    const sampledate = formattedDate(
      new Date(new Date().setDate(Todaydate.getDate() + 1))
    )
    const sampletodo = {
      title: 'Sample due later testcase',
      dueDate: sampledate,
      completed: false
    }
    add(sampletodo)
    expect(dueLater().length).toBe(1)
  })
  test('retrieval of due today items test', () => {
    expect(dueToday().length).toEqual(2)
  })
})
