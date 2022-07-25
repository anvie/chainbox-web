import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.sass";
import styles2 from "../styles/Sections.module.sass";
import Navbar from "../components/Navbar";
import Section1 from "../components/Section1";
import Section2 from "../components/Section2";
import React, { FC } from "react";
import imageLoader from "../imageLoader";
import FAQ from "../components/FAQ";

import { UserContext } from "../lib/UserContext";

const Home: NextPage = () => {
  return (
    <div className={`${styles.container} pt-16 md:pt-0`}>
      <Head>
        <title>Chainbox</title>
        <meta name="description" content="Simplified Web3 Generator" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <UserContext.Provider value={{ address: "0x0" }}>
      <Navbar />
      </UserContext.Provider>

      <main className={`${styles.main} home`}>
        {/* <Section1 /> */}
        <Section2 />
      </main>


      {/* <FAQ /> */}

      <footer className={styles.footer}>
        <div className="flex flex-col place-items-center items-center justify-center pt-10">
          {/* <div className="blur-dot-blue2 hidden md:block" /> */}
          {/* <Image
            src="Chainbox-logo.png"
            alt="Chainbox Logo"
            width={300}
            height={300}
            loader={imageLoader}
          /> */}
          <div className="pt-10 pb-10 text-center">
            Copyright &copy; 2022 Chainbox. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};


export default Home;

