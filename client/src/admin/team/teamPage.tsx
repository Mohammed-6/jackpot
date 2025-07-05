"use client";
import { useState } from "react";
import {
  Plus,
  User,
  Edit,
  Trash2,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import { Layout } from "../layout";
import { RolesProvider, useRoles } from "@/context/team/RolesContext";
import { TeamMember } from "../types/team/team";
import { TeamProvider, useTeams } from "@/context/team/TeamContext";

const permissionOptions = [
  "view_logs",
  "submit_logs",
  "assign_tasks",
  "edit_projects",
  "view_reports",
];

export default function TeamPage() {
  return (
    <>
      <Layout>
        <TeamProvider>
          <RolesProvider>
            <Content />
          </RolesProvider>
        </TeamProvider>
      </Layout>
    </>
  );
}
const Content = () => {
  const { teamList, addMember, updateMember, deleteMember } = useTeams();
  const { roles } = useRoles();
  const [form, setForm] = useState<TeamMember>({
    _id: "",
    name: "",
    email: "",
    phone: "",
    role: "",
    password: "",
  });
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId !== null) {
      updateMember(form);
      setEditingId(null);
    } else {
      addMember(form);
    }
    setForm({
      _id: "",
      name: "",
      email: "",
      phone: "",
      role: "",
      password: "",
    });
  };

  const handleEdit = (member: TeamMember) => {
    const data = {
      ...member,
      role: typeof member.role === "string" ? member.role : member.role._id,
    };
    setForm(data);
    setEditingId(member._id);
  };

  const handleDelete = (id: string) => {
    deleteMember(id);
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white space-y-6">
      <h1 className="text-2xl font-bold flex items-center gap-2">
        <User size={24} /> Team Members
      </h1>

      {/* Add/Edit Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-4 rounded shadow space-y-4"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 text-sm font-medium">Name</label>
            <input
              name="name"
              placeholder="Name"
              value={form.name}
              onChange={handleChange}
              required
              className="border p-2 rounded w-full"
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium">Email</label>
            <input
              name="email"
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
              className="border p-2 rounded w-full"
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium">Phone</label>
            <input
              name="phone"
              type="tel"
              placeholder="Phone"
              value={form.phone}
              onChange={handleChange}
              required
              className="border p-2 rounded w-full"
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium">Password</label>
            <input
              name="password"
              type="password"
              placeholder="Password"
              onChange={handleChange}
              required={!form.password}
              className="border p-2 rounded w-full"
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium">Role</label>
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              required
              className="border p-2 rounded w-full"
            >
              <option value="">Select Role</option>
              {roles.map((role) => (
                <option key={role._id} value={role._id}>
                  {role.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {editingId !== null ? "Update Member" : "Add Member"}
        </button>
      </form>

      {/* Member List */}
      <div className="bg-white rounded shadow">
        <table className="w-full table-auto text-left border-t">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3">Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Role</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {teamList.map((member, i) => (
              <tr key={i} className="border-t hover:bg-gray-50">
                <td className="p-3">{member.name}</td>
                <td className="p-3">{member.email}</td>
                <td className="p-3">{member.role.name}</td>
                <td className="p-3 text-right space-x-2">
                  <button
                    onClick={() => handleEdit(member)}
                    className="text-blue-600 hover:underline"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(member._id)}
                    className="text-red-600 hover:underline"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
            {teamList.length === 0 && (
              <tr>
                <td colSpan={5} className="p-4 text-center text-gray-500">
                  No team members yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
