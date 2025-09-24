function App() {
  fetch(import.meta.env.VITE_API_URL).then((res) => console.log({ res }))

  return (
    <div className="container">
      <h1 className="text-primary">Hello, Bootstrap!</h1>
      <button className="btn btn-success">Click Me</button>
    </div>
  )
}

export default App
