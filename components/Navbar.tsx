import styles from "../styles/Home.module.sass";
import Link from "next/link";
import { useRouter } from "next/router";
import { FC, useEffect, useState } from "react";
import { userAccess } from "../lib/UserAccess";
import { shortenAddress } from "../lib/Utils";

type LinksType = Array<{ href: string; label: string; onClick?: () => void }>;

const DEFAULT_LINKS: LinksType = [];

interface Props {
  links?: LinksType;
  noDasboard?: boolean;
}

const Navbar: FC<Props> = ({ links, noDasboard }) => {
  const router = useRouter();

  const [currentAccount, setCurrentAccount] = useState<string | null>(null);

  const _links: LinksType = links || DEFAULT_LINKS;

  useEffect(() => {
    const subs = userAccess.access?.subscribe((access: any) => {
      console.log(
        "🚀 ~ file: Navbar.tsx ~ line 31 ~ userAccess.access.subscribe ~ access",
        access
      );
      if (access) {
        setCurrentAccount(access.ethAddress);
      }
    });

    return () => {
      subs?.unsubscribe();
    };
  }, []);

  const doLogout = () => {
    userAccess.logout();
    setTimeout(() => {
      router.reload();
    }, 500);
  };

  return (
    <nav className={`items-center justify-center flex-wrap p-5 w-full mb-5 hidden md:flex bg-slate-200`}>
      <div className="block md:hidden">
        <button className="flex items-center px-3 py-2 border rounded hover:text-white hover:border-white">
          <svg
            className="fill-current h-3 w-3"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <title>Menu</title>
            <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
          </svg>
        </button>
      </div>
      <div className="w-full text-center items-center lg:w-auto">
        <div className="text-sm flex lg:space-x-10">
          <Link href="/" passHref={true}>
            <div className="block mt-4 lg:inline-block lg:mt-0 mr-4 cursor-pointer font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-orange-300 to-pink-600 text-lg">
              Home
            </div>
          </Link>

          {_links &&
            _links.map(({ href, label, onClick }) => {
              const path = router.asPath.trim();
              const frag = path.split("#")[1];
              const isActive =
                href.includes("#") && frag === href.split("#")[1];
              if (onClick) {
                return (
                  <div
                    key={label}
                    onClick={(ev) => onClick && onClick()}
                    className={`${isActive ? "underline" : ""} block mt-4 lg:inline-block lg:mt-0  mr-4 text-lg cursor-pointer`}
                  >
                    {label}
                  </div>
                );
              } else {
                return (
                  <Link href={href} passHref={true} key={label}>
                    <div
                      className={`${isActive ? "underline" : ""} block mt-4 lg:inline-block lg:mt-0 mr-4 text-lg cursor-pointer`}
                    >
                      {label}
                    </div>
                  </Link>
                );
              }
            })}

          {!noDasboard &&
          router.pathname !== "/dashboard" &&
          !router.pathname.startsWith("/cp") ? (
            <Link href="/dashboard" passHref={true}>
              <div className="block mt-4 lg:inline-block lg:mt-0 cursor-pointer from-orange-300 to-pink-600 text-lg">
                Dashboard
              </div>
            </Link>
          ) : null}

          {currentAccount && (
            <Link href="/dashboard#profile" passHref={true}>
              <div className="flex items-center text-center align-center pl-5">
              <div className="block mt-5 lg:inline-block lg:mt-0 cursor-pointer text-transparent bg-clip-text bg-gradient-to-br from-orange-300 to-pink-600 text-sm">
                {shortenAddress(currentAccount)}
              </div>
              </div>
            </Link>
          )}

          {currentAccount && (
            <div className="flex items-center text-center align-center">
            <div
              className="block mt-5 items-center  ml-5 lg:inline-block lg:mt-0 text-sm cursor-pointer"
              onClick={doLogout}
            >
              [logout]
            </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
