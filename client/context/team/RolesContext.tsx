"use client";

import {
  addRoleAPI,
  deleteRoleAPI,
  listRoleAPI,
  updateRoleAPI,
} from "@/src/admin/query/team/roles";
import { Role, RolesContextType } from "@/src/admin/types/team/roles";
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { toast } from "react-toastify";

const RolesContext = createContext<RolesContextType | undefined>(undefined);

export const RolesProvider = ({ children }: { children: ReactNode }) => {
  const [roles, setRoles] = useState<Role[]>([]);

  useEffect(() => {
    const loadFirst = async () => {
      await listRoleAPI()
        .then((res: any) => {
          setRoles(res.data);
        })
        .catch((error) => {
          toast.error(error.response.data.error);
          console.log(error);
        });
    };
    loadFirst();
  }, []);

  const addRole = async (role: Role) => {
    await addRoleAPI(role)
      .then((res: any) => {
        toast.success("Role added successfully");
        setRoles((prev) => [...prev, res.data]);
      })
      .catch((error) => {
        toast.error(error.response.data.error);
        console.log(error);
      });
  };

  const updateRole = async (updatedRole: Role) => {
    await updateRoleAPI(updatedRole)
      .then((res: any) => {
        toast.success("Role updated successfully");
        setRoles((prev) =>
          prev.map((role) =>
            role._id === updatedRole._id ? updatedRole : role
          )
        );
      })
      .catch((error) => {
        toast.error(error.response.data.error);
        console.log(error);
      });
  };

  const deleteRole = async (id: string) => {
    await deleteRoleAPI(id)
      .then((res: any) => {
        toast.success("Role deleted successfully");
        setRoles((prev) => prev.filter((role) => role._id !== id));
      })
      .catch((error) => {
        toast.error(error.response.data.error);
        console.log(error);
      });
  };

  return (
    <RolesContext.Provider value={{ roles, addRole, updateRole, deleteRole }}>
      {children}
    </RolesContext.Provider>
  );
};

// Custom hook
export const useRoles = () => {
  const context = useContext(RolesContext);
  if (!context) {
    throw new Error("useRoles must be used within a RolesProvider");
  }
  return context;
};
