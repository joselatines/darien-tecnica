export default function ErrorHandler({ errMsg }: { errMsg: string }) {
  return (
    <div className="min-vh-100 bg-light">
      <main className="container py-5">
        <div className="text-center">
          <div className="alert alert-danger d-inline-block p-4">
            <h4 className="alert-heading">{errMsg}</h4>
            <p>Algo inesperado ha ocurrido</p>
            <button className="btn btn-primary" onClick={() => window.location.reload()}>
              Recargar página
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}
