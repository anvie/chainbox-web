import { FC, useCallback, useEffect, useState } from "react";
import Modal from "../../components/Modal";
import fw from "../../lib/FetchWrapper";
import { formatError } from "../../lib/Utils";

interface Props {
  show: boolean;
  currentAddress?: string;
  onClose: () => void;
  onSuccess: () => void;
}

const AddProjectDialog: FC<Props> = ({ show, onClose, onSuccess }) => {
  // const [name, setName] = useState("");
  // const [description, setDescription] = useState("");
  // const [symbol, setSymbol] = useState("");
  // const [author, setAuthor] = useState("");
  // const [authorEmail, setAuthorEmail] = useState("");
  // const [kind, setKind] = useState("");
  // const [capped, setCapped] = useState(false);
  // const [maxSupply, setMaxSupply] = useState("");
  const [error, setError] = useState("");

  const onSubmit = (event: any) => {
    event.preventDefault();
    const name = event.target.name.value;
    const description = event.target.description.value;
    const symbol = event.target.symbol.value;
    const author = event.target.author.value;
    const authorEmail = event.target.authorEmail.value;
    const kind = event.target.kind.value;
    const capped = event.target.capped.checked;
    console.log(
      "🚀 ~ file: AddProjectDialog.tsx ~ line 31 ~ onSubmit ~ capped",
      capped
    );
    const maxSupply:number = parseInt(event.target.maxSupply.value);
    setError("");

    fw.post(`/v1/add-project`, {
      name,
      description,
      symbol,
      author,
      authorEmail,
      kind,
      capped,
      maxSupply,
    }).then((resp) => {
      if (resp.result) {
        onSuccess();
        onClose();
      }else if (resp.errors || resp.error){
        setError(formatError(resp.errors || resp.error));
      }
    }).catch( (err)  =>{
      console.log("🚀 ~ file: AddProjectDialog.tsx ~ line 57 ~ onSubmit ~ err", err)
      setError(err.message);
    });
  };

  return (
    <Modal show={show} onClose={onClose} title={`Add new project`}>
      <div className="flex flex-col items-center justify-center">
        <form className="flex flex-col w-full md:w-96" onSubmit={onSubmit}>
          <label htmlFor="name" className="mb-2 italic">
            Project name:
          </label>
          <input
            className="mb-4 border-b-2 p-2 w-full"
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            required
          />
          <label htmlFor="description" className="mb-2 italic">
            Description:
          </label>
          <textarea
            className="mb-4 border-b-2 p-2 w-full"
            id="description"
            name="description"
          ></textarea>

          <label htmlFor="symbol" className="mb-2 italic">
            Symbol:
          </label>
          <input
            className="mb-4 border-b-2 p-2 w-full"
            id="symbol"
            name="symbol"
            type="text"
            autoComplete="symbol"
            required
          />

          <label htmlFor="author" className="mb-2 italic">
            Author:
          </label>
          <input
            className="mb-4 border-b-2 p-2 w-full"
            id="author"
            name="author"
            type="text"
            autoComplete="author"
            required
          />

          <label htmlFor="authorEmail" className="mb-2 italic">
            Author email:
          </label>
          <input
            className="mb-4 border-b-2 p-2 w-full"
            id="authorEmail"
            name="authorEmail"
            type="text"
            autoComplete="authorEmail"
            required
          />

          <label htmlFor="kind" className="mb-2 italic">
            Kind:
          </label>
          <div className="pl-5 pb-5">
            <select
              name="kind"
              id="kindSelection"
              className="border border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
            >
              {["ERC-721", "ERC-1155"].map((kind, index) => (
                <option key={index} value={kind}>
                  {kind}
                </option>
              ))}
            </select>
          </div>

          <div className=" pb-5">
            <div className="flex items-center">
              <input
                id="capped"
                type="checkbox"
                value="false"
                className="w-4 h-4 text-blue-600 bg-gray-100 rounded border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              />
              <label
                htmlFor="capped"
                className="ml-2 italic"
              >
                Capped
              </label>
            </div>
          </div>

          <label htmlFor="maxSupply" className="mb-2 italic">
            Max supply:
          </label>
          <input
            className="mb-4 border-b-2 p-2 w-full"
            id="maxSupply"
            name="maxSupply"
            type="number"
            autoComplete="days"
            min="0"
            defaultValue="0"
          />

          {error && <div className="bg-red-300 p-2 mb-5">
            {error}
          </div>}

          <button
            type="submit"
            className="px-4 py-2 font-bold text-white bg-blue-500 rounded-full hover:bg-blue-700"
          >
            Submit
          </button>
        </form>
      </div>
    </Modal>
  );
};

export default AddProjectDialog;
