import Shimmer from './Shimmer';
import SkeletonElement from './SkeletonElement';

const SkeletonArticle = () => {
  

  return (
    <div className={`skeleton-wrapper `}>
      <div className="skeleton-article">
        <SkeletonElement type="title" />
        <SkeletonElement type="text" />
        <SkeletonElement type="text" />
        
      </div>
      <Shimmer />
    </div>
  )
}

export default SkeletonArticle;