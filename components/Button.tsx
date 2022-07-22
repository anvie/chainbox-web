import { FC, useEffect, useState } from "react";

interface Props {
  caption: string;
  color?: string;
  onClick?: (event: any) => void;
}

const Button: FC<Props> = ({ caption, color, onClick }) => {
  const buttonStyle = {
    minWidth: '100px'
  }
  
  return (
    <div
      className={`p-2 text-white text-center border hover:shadow-xl cursor-pointer rounded-xl ${color === 'red' ? 'bg-red-600' : 'bg-violet-800'}`}
      style={buttonStyle}
      onClick={(event) => onClick && onClick(event)}
    >
      {caption}
    </div>
  );
};

export default Button;

