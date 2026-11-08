// components/AuthContext.tsx
"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type UserRole = "client" | "contractor";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  organization: string;
  role: UserRole;
  avatar: string;
  accountStatus: "VERIFIED" | "PENDING";
}

const CLIENT_PROFILE: UserProfile = {
  id: "usr_acme_corp",
  name: "Sarah Jenkins",
  email: "billing@acmecloud.io",
  organization: "Acme Cloud Corp",
  role: "client",
  avatar: "🏢",
  accountStatus: "VERIFIED",
};

const CONTRACTOR_PROFILE: UserProfile = {
  id: "usr_alex_rivera",
  name: "Alex Rivera",
  email: "alex.rivera@devmail.com",
  organization: "Rivera Engineering LLC",
  role: "contractor",
  avatar: "👨‍💻",
  accountStatus: "VERIFIED",
};

interface AuthContextType {
  user: UserProfile;
  loginAs: (role: UserRole) => void;
  isSignInOpen: boolean;
  setIsSignInOpen: (open: boolean) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: CLIENT_PROFILE,
  loginAs: () => {},
  isSignInOpen: false,
  setIsSignInOpen: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile>(CLIENT_PROFILE);
  const [isSignInOpen, setIsSignInOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("resolvai_auth_role");
    if (saved === "contractor") {
      setUser(CONTRACTOR_PROFILE);
    } else {
      setUser(CLIENT_PROFILE);
    }
  }, []);

  const loginAs = (role: UserRole) => {
    if (role === "contractor") {
      setUser(CONTRACTOR_PROFILE);
      localStorage.setItem("resolvai_auth_role", "contractor");
    } else {
      setUser(CLIENT_PROFILE);
      localStorage.setItem("resolvai_auth_role", "client");
    }
    setIsSignInOpen(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loginAs,
        isSignInOpen,
        setIsSignInOpen,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

