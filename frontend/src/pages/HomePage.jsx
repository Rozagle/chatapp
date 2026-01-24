import toast from 'react-hot-toast'

const HomePage = () => {
  return (
    <div data-theme="retro" className="min-h-screen flex items-center justify-center">
      <h1 className="text-4xl font-bold">

        HOME PAGE (RETRO)
      </h1>
<button
  onClick={() => toast.success("hellooo")}
  className="btn btn-primary mt-4"
>
  Show Toast
</button>


    </div>
    
  )
}

export default HomePage
