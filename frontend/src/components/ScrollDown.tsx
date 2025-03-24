import { useNavigate } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';

const ScrollDown = () => {
   const navigate = useNavigate();

  const navigateToGames = () => {
    navigate('/games');
  };
  return (
    <div className="flex flex-col items-center gap-1 text-white cursor-pointer sm:mb-5 md:mb-20 lg:mb-30 ">
      <span  onClick={navigateToGames} 
      >Scroll down</span>
      <ChevronDown onClick={navigateToGames} 
      className="animate-bounce" />
    </div>
  );
};

export default ScrollDown;