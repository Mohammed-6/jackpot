"use client";
import { useState } from "react";
import { ShieldCheck, Pencil, Trash, Plus } from "lucide-react";
import { Layout } from "../layout";
import { Permission, Role } from "../types/team/roles";
import { RolesProvider, useRoles } from "@/context/team/RolesContext";

const defaultModules = [
  "Projects",
  "Daily Logs",
  "Materials",
  "Reports",
  "Team",
];

export default function RolesPage() {
  return (
    <>
      <Layout>
        <RolesProvider>
          <Content />
        </RolesProvider>
      </Layout>
    </>
  );
}

const Content = () => {
  const { roles: rolesList, addRole, updateRole, deleteRole } = useRoles();

  const [roles, setRoles] = useState<Role[]>([]);
  const [newRoleName, setNewRoleName] = useState("");
  const [editingRoleId, setEditingRoleId] = useState<string | null>(null);

  const defaultPermissions = defaultModules.map((mod) => ({
    module: mod,
    view: false,
    create: false,
    update: false,
    delete: false,
  }));

  const [permissions, setPermissions] =
    useState<Permission[]>(defaultPermissions);

  const handleToggle = (index: number, type: keyof Permission) => {
    const updated = [...permissions];
    updated[index][type] = !updated[index][type];
    setPermissions(updated);
  };

  const handleAddRole = () => {
    if (!newRoleName.trim()) return;

    const newRole: Role = {
      _id: "",
      name: newRoleName,
      permissions: JSON.parse(JSON.stringify(permissions)),
    };

    addRole(newRole);
    // resetForm();
  };

  const handleEditRole = (role: Role) => {
    setNewRoleName(role.name);
    setPermissions(JSON.parse(JSON.stringify(role.permissions)));
    setEditingRoleId(role._id);
  };

  const handleUpdateRole = () => {
    const updatedRole: Role = {
      _id: editingRoleId!,
      name: newRoleName,
      permissions: JSON.parse(JSON.stringify(permissions)),
    };
    updateRole(updatedRole as any);
    resetForm();
  };

  const handleDeleteRole = (id: string) => {
    deleteRole(id);
  };

  const resetForm = () => {
    setNewRoleName("");
    setPermissions(defaultPermissions);
    setEditingRoleId(null);
  };

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold flex items-center gap-2">
        <ShieldCheck size={24} /> Role Management
      </h1>

      {/* Role Form */}
      <div className="bg-white shadow rounded p-4 space-y-4">
        <div>
          <label className="block font-medium mb-1">Role Name</label>
          <input
            type="text"
            value={newRoleName}
            onChange={(e) => setNewRoleName(e.target.value)}
            placeholder="e.g. Project Manager"
            className="border p-2 w-full rounded"
          />
        </div>

        <div>
          <h2 className="font-semibold mb-2">Permissions</h2>
          <table className="w-full text-left text-sm border">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 border">Module</th>
                <th className="p-2 border">View</th>
                <th className="p-2 border">Create</th>
                <th className="p-2 border">Update</th>
                <th className="p-2 border">Delete</th>
              </tr>
            </thead>
            <tbody>
              {permissions.map((perm, idx) => (
                <tr key={idx} className="border-t">
                  <td className="p-2 border">{perm.module}</td>
                  {(["view", "create", "update", "delete"] as const).map(
                    (type) => (
                      <td className="p-2 border text-center" key={type}>
                        <input
                          type="checkbox"
                          checked={perm[type]}
                          onChange={() => handleToggle(idx, type)}
                        />
                      </td>
                    )
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <button
          onClick={editingRoleId ? handleUpdateRole : handleAddRole}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {editingRoleId ? "Update Role" : "Add Role"}
        </button>
      </div>

      {/* Existing Roles */}
      <div className="bg-white rounded shadow p-4">
        <h2 className="text-lg font-semibold mb-2">Existing Roles</h2>
        {rolesList.length === 0 ? (
          <p className="text-gray-500">No roles created yet.</p>
        ) : (
          <ul className="space-y-3">
            {rolesList.map((role) => (
              <li
                key={role._id}
                className="border p-3 rounded flex justify-between items-center"
              >
                <div>
                  <h3 className="font-bold">{role.name}</h3>
                  <p className="text-sm text-gray-500">
                    Permissions:{" "}
                    {role.permissions
                      .filter((p) => p.view || p.create || p.update || p.delete)
                      .map((p) => `${p.module}`)
                      .join(", ") || "None"}
                  </p>
                </div>
                <div className="space-x-2">
                  <button
                    onClick={() => handleEditRole(role)}
                    className="text-blue-600 hover:underline text-sm"
                  >
                    <Pencil size={16} className="inline-block mr-1" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteRole(role._id)}
                    className="text-red-600 hover:underline text-sm"
                  >
                    <Trash size={16} className="inline-block mr-1" />
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};
