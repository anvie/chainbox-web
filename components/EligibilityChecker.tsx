import { FC } from "react";

interface Props {
  eligible: boolean;
}

const EligibilityChecker: FC<Props> = ({ eligible }) => {
  return (
    eligible ? (
      <div className="rounded-xl bg-yellow-100 p-5 text-black">
        <div className="text-lg text-green-600 font-semibold">
          Congratulation!
        </div>
        <p>You are registered and eligible!</p>
      </div>
    ) : null
  )
};
export default EligibilityChecker;

