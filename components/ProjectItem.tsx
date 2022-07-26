import { FC, useEffect, useState } from "react";
import Button from "./Button";
import SmallButton from "./SmallButton";
import fw from "../lib/FetchWrapper";
import { useRouter } from "next/router";

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
  _id: string;
}

interface ProjectItemProps {
  onClick: () => void;
  item: ItemProps;
}

const ProjectItem: FC<ProjectItemProps> = ({ onClick, item }) => {
  const router = useRouter();
  

  return item ? (
    <div className="flex mt-2 mr-2 flex-col justify-right bg-slate-200 text-gray-600 shadow-md w-60">
      <div className="flex text-center w-full">
        <div className="bg-orange-300 p-1 w-full">NFT ({item.kind})</div>
      </div>
      <div className="flex flex-col p-5">
        <div className="font-medium" onClick={onClick}>
          {item.name}
        </div>

        <div className="text-sm h-20 text-ellipsis overflow-hidden">{item.description}</div>

        {/* <div className="text-sm text-center mt-10 bg-gray-300 w-20 rounded-md">
          {item.meta.deployed ? "deployed" : "draft"}
        </div> */}

        <SmallButton
          caption="DETAIL"
          onClick={()=> router.push(`/dashboard/project#${item._id}`)}
          color="bg-blue-200"
          textColor="text-gray-500"
          className="mt-2"
        />
      </div>
    </div>
  ) : <div />;
};

export default ProjectItem;
