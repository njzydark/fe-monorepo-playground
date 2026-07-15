import { type FormEvent, useEffect, useMemo, useState } from 'react'
import { Button } from '@base-ui/react/button'
import { Checkbox } from '@base-ui/react/checkbox'
import { Dialog } from '@base-ui/react/dialog'
import { Input } from '@base-ui/react/input'
import { Tabs } from '@base-ui/react/tabs'
import { todoFilters, type Todo } from 'example-shared'

import styles from '../app.module.less'
import { useTodoStore } from '../stores/todo-store'

export const TodosPage = () => {
  const [draftTitle, setDraftTitle] = useState('')
  const [editingId, setEditingId] = useState<number | undefined>()
  const [editingTitle, setEditingTitle] = useState('')
  const [apiDialogOpen, setApiDialogOpen] = useState(false)
  const [apiDraft, setApiDraft] = useState('')
  const {
    actionError,
    apiBaseUrl,
    createTodo,
    deleteTodo,
    error,
    filter,
    isCreating,
    isLoading,
    loadTodos,
    pendingTodoId,
    setApiBaseUrl,
    setFilter,
    todos,
    toggleTodo,
    updateTodo,
  } = useTodoStore()

  const filteredTodos = useMemo(() => {
    if (filter === 'active') {
      return todos.filter((todo) => !todo.completed)
    }

    if (filter === 'completed') {
      return todos.filter((todo) => todo.completed)
    }

    return todos
  }, [filter, todos])

  useEffect(() => {
    void loadTodos()
  }, [loadTodos])

  const handleCreateTodo = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!draftTitle.trim()) {
      return
    }

    const todo = await createTodo(draftTitle)

    if (todo) {
      setDraftTitle('')
    }
  }

  const startEditing = (todo: Todo) => {
    setEditingId(todo.id)
    setEditingTitle(todo.title)
  }

  const saveTodo = async (todo: Todo) => {
    if (!editingTitle.trim()) {
      return
    }

    const updatedTodo = await updateTodo(todo, editingTitle)

    if (updatedTodo) {
      setEditingId(undefined)
      setEditingTitle('')
    }
  }

  return (
    <section className={styles.page}>
      <header className={styles.pageHeader}>
        <p className={styles.eyebrow}>Full-stack starter</p>
        <h1 className={styles.title}>Todo CRUD</h1>
        <p className={styles.description}>A focused React example backed by Hono, Drizzle, and SQLite.</p>
      </header>

      <section className={styles.todoPanel}>
        <div className={styles.todoPanelTopbar}>
          <Tabs.Root
            className={styles.filterTabs}
            value={filter}
            onValueChange={(value) => {
              const nextFilter = todoFilters.find((todoFilter) => todoFilter.value === value)?.value

              if (nextFilter) {
                setFilter(nextFilter)
              }
            }}
          >
            <Tabs.List className={styles.filterBar} aria-label="Todo filters">
              {todoFilters.map((todoFilter) => (
                <Tabs.Tab
                  className={({ active }) =>
                    active ? `${styles.filterButton} ${styles.filterButtonActive}` : styles.filterButton
                  }
                  key={todoFilter.value}
                  value={todoFilter.value}
                >
                  {todoFilter.label}
                </Tabs.Tab>
              ))}
            </Tabs.List>
          </Tabs.Root>

          <Dialog.Root
            open={apiDialogOpen}
            onOpenChange={(open) => {
              setApiDialogOpen(open)

              if (open) {
                setApiDraft(apiBaseUrl)
              }
            }}
          >
            <Dialog.Trigger className={styles.secondaryButton}>API</Dialog.Trigger>
            <Dialog.Portal>
              <Dialog.Backdrop className={styles.dialogBackdrop} />
              <Dialog.Viewport className={styles.dialogViewport}>
                <Dialog.Popup className={styles.dialogPopup}>
                  <div className={styles.dialogHeader}>
                    <div>
                      <Dialog.Title className={styles.dialogTitle}>API</Dialog.Title>
                      <Dialog.Description className={styles.dialogDescription}>
                        Configure the base URL used by Todo actions.
                      </Dialog.Description>
                    </div>
                    <Dialog.Close className={styles.iconButton} aria-label="Close API settings">
                      <span className={styles.closeIcon} />
                    </Dialog.Close>
                  </div>

                  <form
                    className={styles.apiForm}
                    onSubmit={(event) => {
                      event.preventDefault()
                      setApiBaseUrl(apiDraft)
                      setApiDialogOpen(false)
                      void loadTodos()
                    }}
                  >
                    <label className={styles.themeField}>
                      <span className={styles.themeFieldLabel}>Base URL</span>
                      <Input
                        className={styles.todoInput}
                        placeholder="Same-origin proxy"
                        value={apiDraft}
                        onValueChange={(value) => {
                          setApiDraft(value)
                        }}
                      />
                    </label>
                    <p className={styles.apiHint}>
                      {apiBaseUrl ? `Current: ${apiBaseUrl}` : 'Current: same-origin proxy'}
                    </p>
                    <div className={styles.dialogActions}>
                      <Button
                        className={styles.secondaryButton}
                        type="button"
                        onClick={() => {
                          setApiDraft('')
                        }}
                      >
                        Proxy
                      </Button>
                      <Button className={styles.primaryButton} type="submit">
                        Save
                      </Button>
                    </div>
                  </form>
                </Dialog.Popup>
              </Dialog.Viewport>
            </Dialog.Portal>
          </Dialog.Root>
        </div>

        <form className={styles.todoForm} onSubmit={handleCreateTodo}>
          <Input
            className={styles.todoInput}
            disabled={isCreating}
            placeholder="Add a todo"
            value={draftTitle}
            onValueChange={(value) => {
              setDraftTitle(value)
            }}
          />
          <Button className={styles.primaryButton} disabled={isCreating} type="submit">
            {isCreating ? 'Adding' : 'Add'}
          </Button>
        </form>

        {error ? <p className={styles.errorText}>{error}</p> : null}
        {actionError ? <p className={styles.errorText}>{actionError}</p> : null}
        {isLoading ? <p className={styles.emptyText}>Loading todos...</p> : null}

        {!isLoading && filteredTodos.length === 0 ? <p className={styles.emptyText}>No todos in this view.</p> : null}

        <ul className={styles.todoList}>
          {filteredTodos.map((todo) => (
            <li className={styles.todoItem} data-completed={todo.completed} key={todo.id}>
              <label className={styles.todoCheckRow}>
                <Checkbox.Root
                  checked={todo.completed}
                  className={styles.todoCheckbox}
                  disabled={pendingTodoId === todo.id}
                  onCheckedChange={(checked) => {
                    void toggleTodo(todo, checked)
                  }}
                >
                  <Checkbox.Indicator className={styles.todoCheckboxIndicator}>
                    <span className={styles.todoCheckboxCheck} />
                  </Checkbox.Indicator>
                </Checkbox.Root>
                {editingId === todo.id ? (
                  <Input
                    className={styles.todoEditInput}
                    disabled={pendingTodoId === todo.id}
                    value={editingTitle}
                    onValueChange={(value) => {
                      setEditingTitle(value)
                    }}
                  />
                ) : (
                  <span className={styles.todoTitle}>{todo.title}</span>
                )}
              </label>

              <div className={styles.todoActions}>
                {editingId === todo.id ? (
                  <Button
                    className={styles.secondaryButton}
                    disabled={pendingTodoId === todo.id}
                    type="button"
                    onClick={() => {
                      void saveTodo(todo)
                    }}
                  >
                    {pendingTodoId === todo.id ? 'Saving' : 'Save'}
                  </Button>
                ) : (
                  <Button
                    className={styles.secondaryButton}
                    disabled={pendingTodoId === todo.id}
                    type="button"
                    onClick={() => {
                      startEditing(todo)
                    }}
                  >
                    Edit
                  </Button>
                )}
                <Button
                  className={styles.dangerButton}
                  disabled={pendingTodoId === todo.id}
                  type="button"
                  onClick={() => {
                    void deleteTodo(todo)
                  }}
                >
                  {pendingTodoId === todo.id ? 'Working' : 'Delete'}
                </Button>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </section>
  )
}
