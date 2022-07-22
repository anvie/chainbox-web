import { BehaviorSubject } from "rxjs";
import Router from "next/router";

const accessSubject = new BehaviorSubject(
  process.browser && JSON.parse(localStorage.getItem("user_access") as string)
);

export const userAccess = {
  access: accessSubject.asObservable(),
  get accessValue() {
    return accessSubject.value;
  },
  authenticate,
  logout,
  clear
};

function authenticate(ethAddress: string, token: string) {
  localStorage.setItem("user_access", JSON.stringify({ ethAddress, token }));
  accessSubject.next({ ethAddress, token });
}

function logout() {
  // remove access from local storage, publish null to access subscribers and redirect to login page
  clear();
  Router.push("/dashboard");
}

function clear(){
  localStorage.removeItem("user_access");
  accessSubject.next(null);
}
