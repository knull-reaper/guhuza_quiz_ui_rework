import React from 'react';

type MascotStatus = 'greeting' | 'correct' | 'incorrect' | 'proud';

interface MascotProps {
  status: MascotStatus;
}

const mascotData = {
  greeting: {
    image: '/mascot/greetingMascot.svg',
    message: "Let's start!",
  },
  correct: {
    image: '/mascot/proudMascot.svg',
    message: 'Good Job!',
  },
  incorrect: {
    image: '/mascot/sadMascot.svg',
    message: 'Try Again!',
  },
  proud: {
    image: '/mascot/proudMascot.svg',
    message: 'Amazing!',
  },
};

export const Mascot: React.FC<MascotProps> = ({ status }) => {
  const { image, message } = mascotData[status];

  return (
    <div className="hidden lg:flex flex-col items-center justify-center w-64">
      <img src={image} alt="Mascot" className="w-48 h-48 object-contain" />
      <div className="mt-4 text-center font-semibold text-lg p-2 bg-background rounded-lg shadow-md">
        {message}
      </div>
    </div>
  );
};
