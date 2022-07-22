import styles from "../styles/Home.module.sass";
import Link from "next/link";
import { useRouter } from "next/router";
import { FC } from "react";
import { UserContext } from "../lib/UserContext";

type LinksType = Array<{ href: string; label: string; onClick?: () => void }>;

const DEFAULT_LINKS: LinksType = [
  { href: "/#about", label: "About" },
  { href: "/#faq", label: "FAQ" },
];

interface Props {
  links?: LinksType;
}

const Navbar: FC<Props> = ({ links }) => {
  const router = useRouter();

  const _links: LinksType = links || DEFAULT_LINKS;

  return (
    <nav className={`items-center justify-center flex-wrap p-6 hidden md:flex`}>
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
      <div className="w-full block lg:flex lg:items-center lg:w-auto">
        <div className="text-sm flex-row lg:space-x-10">
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
                    className={`${
                      isActive ? "underline" : ""
                    } block mt-4 lg:inline-block lg:mt-0  mr-4 text-lg cursor-pointer`}
                  >
                    {label}
                  </div>
                );
              } else {
                return (
                  <Link href={href} passHref={true} key={label}>
                    <div
                      className={`${
                        isActive ? "underline" : ""
                      } block mt-4 lg:inline-block lg:mt-0  mr-4 text-lg cursor-pointer`}
                    >
                      {label}
                    </div>
                  </Link>
                );
              }
            })}

          {router.pathname !== "/dashboard" &&
          !router.pathname.startsWith("/cp") ? (
            <Link href="/dashboard" passHref={true}>
              <div className="block mt-4 lg:inline-block lg:mt-0 cursor-pointer text-transparent bg-clip-text bg-gradient-to-br from-orange-300 to-pink-600 text-lg">
                Dashboard
              </div>
            </Link>
          ) : null}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

