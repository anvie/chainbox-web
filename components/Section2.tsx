import styles from "../styles/Sections.module.sass";
import Image from "next/image";
import imageLoader from "../imageLoader";

const Section1 = () => {
  return (
    <div id="about" className="w-full pl-5 pr-5 md:pl-20 md:pr-20 pt-10 pb-10 items-center justify-center content-center flex flex-col md:flex-row">
      <div
        className={`${styles.overview} justify-center items-left flex flex-col`}
      >
        <div className="block font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-orange-300 to-pink-600 text-xl">
          Chainbox
        </div>

        <p className={`${styles.description} max-w-xl pt-10`}>
        Build Web3 project in no time.
        </p>
        <p className={`${styles.description} max-w-xl pt-2`}>
        Auto generated smart contract, deploy into several blockchains,
        and integrate with the web frontend.
        </p>
        <p className={`${styles.description} max-w-xl pt-2`}>
        All in one place.
        </p>
      </div>

      <div className="image-art">
        <Image
          src="hero-image.png"
          alt="Chainbox art"
          height="294"
          width="400"
          loader={imageLoader}
        />
      </div>
    </div>
  );
};

export default Section1;

