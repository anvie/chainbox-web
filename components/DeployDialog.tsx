import { FC, useCallback, useEffect, useState } from "react";
import Modal from "./Modal";
import fw from "../lib/FetchWrapper";
import Button from "./Button";

interface Props {
  show: boolean;
  projectId: string;
  onDeploy: (args:string[]) => void;
  onClose: () => void;
}

const DeployDialog: FC<Props> = ({ show, projectId, onDeploy, onClose }) => {
  const [parameters, setParameters] = useState<any[]>([]);

  const _defaultValues:any = {
    _baseTokenURI: `https://meta.chainbox.id/${projectId}/`,
  };

  const _onClose = () => {
    onClose();
  };

  const _fetchParameters = useCallback(async () => {
    fw.get(`/v1/project/${projectId}/constructor-args`)
      .then((data) => {
        console.log(
          "🚀 ~ file: DeployDialog.tsx ~ line 21 ~ fw.get ~ data",
          data
        );
        setParameters(data.result.parameters);
      })
      .catch((err) => {
        console.log(
          "🚀 ~ file: DeployDialog.tsx ~ line 24 ~ fw.get ~ err",
          err
        );
      });
  }, [projectId]);

  useEffect(() => {
    _fetchParameters();
  }, [_fetchParameters]);

  const _onDeploy = (event:any) => {
    event.preventDefault();
    const constructorArgs = parameters.map((param:any) => {
      return event.target[param.name].value;
    });
    onDeploy(constructorArgs);
    onClose();
  }

  const _isNumeric = (ty:string) => {
    return ["int", "uint", "uint8", "uint16", "uint32", "uint64", "uint128", "uint256"].includes(ty);
  }

  return (
    <Modal show={show} title="Deployment config" onClose={_onClose}>
      <form className="flex flex-col w-full" onSubmit={_onDeploy}>
        {parameters.map((param) => {
          return (
            <div key={param.name}>
              <label htmlFor="name" className="mb-2 italic">
                {param.name}:
              </label>
              {param.type == "address" && <input
                className="mb-4 border-b-2 p-2 w-full"
                id={param.name}
                name={param.name}
                type="text"
                defaultValue={_defaultValues[param.name] || ''}
                placeholder={param.type}
                required
                pattern="0x[a-fA-F0-9]{40}"
              /> }
              {_isNumeric(param.type) && <input
                className="mb-4 border-b-2 p-2 w-full"
                id={param.name}
                name={param.name}
                type="number"
                defaultValue={_defaultValues[param.name] || ''}
                placeholder={param.type}
                required
              /> }
              {param.type == "string" && <input
                className="mb-4 border-b-2 p-2 w-full"
                id={param.name}
                name={param.name}
                type="text"
                defaultValue={_defaultValues[param.name] || ''}
                placeholder={param.type}
                required
              /> }
            </div>
          );
        })}
        <div className="w-full flex space-x-5 items-end justify-end">
        <Button
          color="bg-red-600 text-white"
          caption="Cancel"
          onClick={_onClose}
        />
        <button
            type="submit"
            className="px-4 py-2 font-bold text-white bg-orange-500 rounded-xl hover:bg-orange-700"
          >
            Deploy
          </button>
      </div>
      </form>
      
    </Modal>
  );
};

export default DeployDialog;
