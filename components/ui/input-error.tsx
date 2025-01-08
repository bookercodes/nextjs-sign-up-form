import React from "react"

interface InputErrorProps {
  message?: [string]
}

const InputError: React.FC<InputErrorProps> = ({ message }) => {
  if (!message) return null

  return <p className="text-sm font-medium text-destructive">{message}</p>
}

export default InputError
