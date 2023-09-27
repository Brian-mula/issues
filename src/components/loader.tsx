import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

export default function Loader() {
  return (
    <div className="min-h-screen w-full pt-20 mr-auto ml-auto">
     <Skeleton count={6} />
    </div>
  )
}
