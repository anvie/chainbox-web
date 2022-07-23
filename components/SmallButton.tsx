import { FC, useEffect, useState } from "react";
import { Loading } from "./Loading";

interface Props {
  caption: string;
  color?: string;
  textColor?: string;
  className?: string;
  loading?: boolean;
  disabled?: boolean;
  onClick?: (event: any) => void;
}

const Button: FC<Props> = ({
  caption,
  color,
  textColor,
  className,
  loading,
  disabled,
  onClick,
}) => {
  const buttonStyle = {
    minWidth: "20px",
  };

  let _className = className;
  let _color = color;

  if (disabled) {
    _color = "bg-gray-300";
  } else {
    _className = `${_className} cursor-pointer`;
  }

  return (
    <div
      className={`${_className} flex justify-center p-1 text-center w-auto h-8 hover:shadow-md rounded-md ${_color} ${textColor}`}
      style={buttonStyle}
      onClick={(event) => onClick && onClick(event)}
    >
      {!loading && <div>{caption}</div>}
      {loading && <Loading className="loading" />}
    </div>
  );
};

export default Button;
