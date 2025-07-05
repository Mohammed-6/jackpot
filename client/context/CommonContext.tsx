import { Matka } from "@/src/admin/types/matka";
import axios from "axios";
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";

type AuthType = "login" | "register";

interface CommonContextProps {
  showAuthModal: boolean;
  authType: AuthType;
  openAuthModal: (type: AuthType) => void;
  closeAuthModal: () => void;
  customerId: number;
  customerLogin: (customer: {
    customerId: number;
    customer: string;
    wallet: number;
  }) => void;
  customerLogout: () => void;
  matkas: Matka[];
  walletBalance: number;
  updateWallet: (amount: number) => void;
}

const CommonContext = createContext<CommonContextProps | undefined>(undefined);

export const CommonProvider = ({ children }: { children: ReactNode }) => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authType, setAuthType] = useState<AuthType>("login");
  const [customerId, setCutomerId] = useState<number>(0);
  const [matkas, setMatkas] = useState<Matka[]>([]);
  const [walletBalance, setWalletBalance] = useState<number>(0);

  const BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL + "/api/matka";
  useEffect(() => {
    if (matkas.length === 0) {
      getAllMatkasAPI();
    }
  }, []);
  const getAllMatkasAPI = async () => {
    await axios.get(`${BASE_URL}`).then((res) => {
      setMatkas(res.data);
    });
  };

  useEffect(() => {
    // if (window !== undefined) {
    if (localStorage.getItem("customerId") !== undefined) {
      setCutomerId(Number(localStorage.getItem("customerId")));
      setWalletBalance(Number(sessionStorage.getItem("wallet")));
      //   }
    }
  }, []);

  const openAuthModal = (type: AuthType) => {
    setAuthType(type);
    setShowAuthModal(true);
  };

  const customerLogin = (customer: {
    customerId: number;
    customer: string;
    wallet: number;
  }) => {
    setCutomerId(customer.customerId);
    localStorage.setItem("customerId", String(customer.customerId));
    localStorage.setItem("customer", String(customer.customer));
    setWalletBalance(customer.wallet);
    sessionStorage.setItem("wallet", String(customer.wallet));
  };

  const customerLogout = () => {
    setCutomerId(0);
    localStorage.removeItem("customerId");
    localStorage.removeItem("customer");
  };

  const closeAuthModal = () => {
    setShowAuthModal(false);
  };

  const updateWallet = (amount: number) => {
    setWalletBalance(amount);
    sessionStorage.setItem("wallet", String(amount));
  };

  return (
    <CommonContext.Provider
      value={{
        showAuthModal,
        authType,
        openAuthModal,
        closeAuthModal,
        customerLogin,
        customerId,
        customerLogout,
        matkas,
        walletBalance,
        updateWallet,
      }}
    >
      {children}
    </CommonContext.Provider>
  );
};

export const useCommon = () => {
  const context = useContext(CommonContext);
  if (!context) throw new Error("useCommon must be used within CommonProvider");
  return context;
};
