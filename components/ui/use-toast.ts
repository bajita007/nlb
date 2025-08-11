"use client"

import type React from "react"

import { useEffect, useState } from "react"

const TOAST_LIMIT = 1
const TOAST_REMOVE_DELAY = 1000000

type ToastType = "default" | "destructive"

type Toast = {
  id: string
  title?: string
  description?: string
  action?: React.ReactNode
  variant?: ToastType
}

let count = 0

function genId() {
  count = (count + 1) % Number.MAX_VALUE
  return count.toString()
}

type ToasterToast = Toast & {
  id: string
  title?: string
  description?: string
  action?: React.ReactNode
  variant?: ToastType
}

const actionTypes = {
  ADD_TOAST: "ADD_TOAST",
  UPDATE_TOAST: "UPDATE_TOAST",
  DISMISS_TOAST: "DISMISS_TOAST",
  REMOVE_TOAST: "REMOVE_TOAST",
} as const

const listeners: ((state: ToasterToast[]) => void)[] = []

let memoryState: ToasterToast[] = []

function dispatch(action: any) {
  memoryState = reducer(memoryState, action)
  listeners.forEach((listener) => {
    listener(memoryState)
  })
}

interface Action {
  type: keyof typeof actionTypes
  toast?: ToasterToast
  toastId?: string
}

function reducer(state: ToasterToast[], action: Action): ToasterToast[] {
  switch (action.type) {
    case "ADD_TOAST":
      return [
        ...state,
        {
          id: genId(),
          ...action.toast,
        } as ToasterToast,
      ].slice(0, TOAST_LIMIT)

    case "UPDATE_TOAST":
      return state.map((t) => (t.id === action.toastId ? { ...t, ...action.toast } : t))

    case "DISMISS_TOAST": {
      const toastId = action.toastId

      if (toastId) {
        return state.map((t) =>
          t.id === toastId
            ? {
                ...t,
              }
            : t,
        )
      }
      return state
    }

    case "REMOVE_TOAST":
      if (action.toastId === undefined) {
        return []
      }
      return state.filter((t) => t.id !== action.toastId)

    default:
      return state
  }
}

function useToast() {
  const [state, setState] = useState<ToasterToast[]>(memoryState)

  useEffect(() => {
    listeners.push(setState)
    return () => {
      const index = listeners.indexOf(setState)
      if (index > -1) {
        listeners.splice(index, 1)
      }
    }
  }, [state])

  return {
    toasts: state,
    toast: (props: Toast) => {
      const id = genId()

      const update = (props: Toast) =>
        dispatch({
          type: "UPDATE_TOAST",
          toast: props,
          toastId: id,
        })

      const dismiss = () => dispatch({ type: "DISMISS_TOAST", toastId: id })

      dispatch({
        type: "ADD_TOAST",
        toast: {
          ...props,
          id,
        },
      })

      // Auto-dismiss after 3 seconds
      setTimeout(() => {
        dispatch({ type: "REMOVE_TOAST", toastId: id })
      }, 3000)

      return {
        id,
        dismiss,
        update,
      }
    },
    dismiss: (toastId?: string) => dispatch({ type: "DISMISS_TOAST", toastId }),
  }
}

export { useToast }
