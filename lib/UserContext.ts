import React from "react";


interface UserSession {
  address: string | null;
}

const UserContext = React.createContext<UserSession | null>(null);


export type { UserSession };
export { UserContext };
