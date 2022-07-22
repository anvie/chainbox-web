import styles from "../styles/Sections.module.sass";
import FaqSection from "./FaqSection";

const Section1 = () => {
  const faqs = [,];
  return (
    <div
      id="faq"
      className="section-2 w-full md:pl-20 md:pr-20 pt-10 pb-10 grid place-items-center relative"
    >
      <div className="flex items-center justify-center">
        <div
          className={`${styles.sectionTitle} ${styles.textGradient} block mt-4 lg:inline-block lg:mt-0 mr-4 font-extrabold text-transparent bg-clip-text`}
        >
          FAQ
        </div>
      </div>

      <FaqSection
        question="What is this?"
        answer="It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English."
      />
      <FaqSection
        question="What the difference?"
        answer="Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like)."
      />
    </div>
  );
};

export default Section1;

