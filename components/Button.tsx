import { FC, useEffect, useState } from "react";
import { Loading } from "./Loading";

interface Props {
  caption: string;
  color?: string;
  textColor?: string;
  loading?: boolean;
  onClick?: (event: any) => void;
}

const Button: FC<Props> = ({ caption, color, textColor, loading, onClick }) => {
  const buttonStyle = {
    minWidth: '100px'
  }
  
  return (
    <div
      className={`p-2 text-center border hover:shadow-xl cursor-pointer rounded-xl ${color} ${textColor}`}
      style={buttonStyle}
      onClick={(event) => onClick && onClick(event)}
    >
      {!loading && <div>{caption}</div>}
      {loading && <Loading className="loading" />}
    </div>
  );
};

export default Button;

