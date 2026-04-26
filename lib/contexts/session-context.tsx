// This file is used to manage the user's session and authentication state
"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface User {
  _id: string;
  name: string;
  email: string;
}

interface SessionContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  logout: () => Promise<void>;
  checkSession: () => Promise<void>;
}

const BACKEND_BACKEND_API_URL = process.env.BACKEND_BACKEND_API_URL || "http://localhost:3001"

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const checkSession = async () => {
    try {
      const token = localStorage.getItem("token");
      console.log(
        "SessionContext: Token from localStorage:",
        token ? "exists" : "not found"
      );

      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }

      const response = await fetch(`${BACKEND_BACKEND_API_URL}/api/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });


      if (response.ok) {
        const data = await response.json();
        const userData = data.user;
        const { password, ...safeUserData } = userData;
        setUser(safeUserData);
        // toast.success("Session Checked Successfully!", {
        //   // description: "Your session has been checked successfully.",
        //   duration: 3000,
        //   position: "top-center",
        // })
      } else {
        toast.error("Failed to Get User Data! Please Try Again.", {
          // description: "Failed to get user data!",
        })
        setUser(null);
        localStorage.removeItem("token");
      }
    } catch (error) {
      console.error("SessionContext: Error checking session:", error);
      toast.error("Error Checking Session! Please Try Again.", {
        // description: "Error checking session!",
      })
      setUser(null);
      localStorage.removeItem("token");
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        await fetch(`${BACKEND_BACKEND_API_URL}/api/auth/logout`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }
    } catch (error) {
      console.error("Logout Error:", error);
      toast.error("Logout Failed! Please Try Again.", {
        // description: "Logout failed!",
      })
    } finally {
      localStorage.removeItem("token");
      setUser(null);
      router.push("/");
    }
  };

  useEffect(() => {
    checkSession();
  }, []);

  return (
    <SessionContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        logout,
        checkSession,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error("useSession Must be Used Within a SessionProvider!");
  }
  return context;
}