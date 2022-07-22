import { FC } from "react";
import Image from "next/image";
import imageLoader from "../imageLoader";

interface Props {
  className?: string;
}

export const Loading: FC<Props> = ({ className }) => {
  return (
    <div className={className}>
      <Image src="loading2.svg" alt="loading animation" loader={imageLoader} width="25%" height="25%" />
    </div>
  );
};


