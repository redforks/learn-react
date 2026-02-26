import { useState } from 'react'

function Square() {
  const [value, setValue] = useState<string | null>(null)

  function handleClick() {
    setValue(value === 'X' ? null : 'X')
  }

  return (
    <button
      type="button"
      className="bg-white border border-zinc-500 text-2xl font-bold size-8 -mr-px -mt-px text-center"
      onClick={handleClick}
    >
      {value}
    </button>
  )
}

export default function Board() {
  return (
    <div className="table border-collapse">
      <div className="table-row">
        <Square />
        <Square />
        <Square />
      </div>
      <div className="table-row">
        <Square />
        <Square />
        <Square />
      </div>
      <div className="table-row">
        <Square />
        <Square />
        <Square />
      </div>
    </div>
  )
}
