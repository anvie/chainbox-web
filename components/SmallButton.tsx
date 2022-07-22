import { FC, useEffect, useState } from "react";
import { Loading } from "./Loading";

interface Props {
  caption: string;
  color?: string;
  textColor?: string;
  className?: string;
  loading?: boolean;
  onClick?: (event: any) => void;
}

const Button: FC<Props> = ({ caption, color, textColor, className, loading, onClick }) => {
  const buttonStyle = {
    minWidth: '20px'
  }
  
  return (
    <div
      className={`${className} flex justify-center p-1 text-center w-auto h-8 hover:shadow-md cursor-pointer rounded-md ${color} ${textColor}`}
      style={buttonStyle}
      onClick={(event) => onClick && onClick(event)}
    >
      {!loading && <div>{caption}</div>}
      {loading && <Loading className="loading" />}
    </div>
  );
};

export default Button;

