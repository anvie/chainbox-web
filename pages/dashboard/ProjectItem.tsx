import { FC, useEffect } from "react";

export interface ItemProps {
  name: string;
  description: string;
  symbol: string;
  author: string;
  authorEmail: string;
  kind: string;
  capped: boolean;
  maxSupply: string;
  meta: any;
}

interface ProjectItemProps {
  onClick: () => void;
  item: ItemProps;
}

const ProjectItem: FC<ProjectItemProps> = ({ onClick, item }) => {
  return (
    <div className="flex flex-col justify-right bg-slate-200 text-gray-600 shadow-md">
      <div className="flex text-center w-full">
        <div className="bg-orange-300 p-1 w-full">{item.kind}</div>
      </div>
      <div className="flex flex-col p-5">
        <div className="font-medium" onClick={onClick}>
          {item.name}
        </div>

        <div className="text-sm">{item.description}</div>

        <div className="text-sm text-center mt-10 bg-gray-300 w-20 rounded-md">
          {item.meta.deployed ? "deployed" : "draft"}
        </div>
      </div>
    </div>
  );
};

export default ProjectItem;
