import styles from "../styles/Sections.module.sass";
import Image from "next/image";
import imageLoader from "../imageLoader";
import React, { FC } from "react";

interface Props {
  question: string;
  answer: string;
}

const FaqQuestion: FC<Props> = ({ question, answer }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  return (
    <div className="w-full flex items-center justify-center mt-2">
      <div className={`${styles.faqSection} flex flex-col rounded-xl w-full md:w-1/2`}>
        <div className={`${styles.faqSectionTitle} flex cursor-pointer p-5`} onClick={() => setIsOpen(!isOpen)}>
          <div className={`${styles.textGradient} font-semibold`}>
            {question}
          </div>
          <div className="flex-grow"></div>
          <div className="icon-up-down">
            {isOpen ? (
              <svg
                width="24"
                height="24"
                viewBox="0 0 26 26"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M21.5799 16.3042L14.5166 9.24087C13.6824 8.4067 12.3174 8.4067 11.4833 9.24087L4.41992 16.3042"
                  stroke="#FBB265"
                  strokeWidth="2"
                  strokeMiterlimit="10"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            ) : (
              <svg
                width="24"
                height="24"
                viewBox="0 0 26 26"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M21.5799 9.6958L14.5166 16.7591C13.6824 17.5933 12.3174 17.5933 11.4833 16.7591L4.41992 9.6958"
                  stroke="#FBB265"
                  strokeWidth="2"
                  strokeMiterlimit="10"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </div>
        </div>

        <div>
        {isOpen ? <p className="pl-5 pr-5 pb-5">{answer}</p> : null}
        </div>
      </div>
    </div>
  );
};

export default FaqQuestion;

