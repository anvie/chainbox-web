import styles from "../styles/Home.module.sass";
import Image from "next/image";
import imageLoader from "../imageLoader";

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className="flex flex-col place-items-center items-center justify-center pt-10">
        {/* <Image
          src="Chainbox-logo.png"
          alt="Chainbox Logo"
          width={300}
          height={300}
          loader={imageLoader}
        />

        <div className="promoted-by text-center pt-10">
          <div>Powered by</div>
          <Image
            src="xxx.svg"
            alt="Chainbox, Inc."
            width={300}
            height={60}
            loader={imageLoader}
          />
        </div> */}

        <div className="pt-10 pb-10 text-center">
          Copyright &copy; 2022 Chainbox. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;

