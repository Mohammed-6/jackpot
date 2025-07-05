export type TeamMember = {
    _id: string;
    name: string;
    email: string;
    password: string;
    role: string|{_id: string, name:string};
    phone: string;
  };
  
export type AttendanceRecord = {
  id: number;
  teamMember: string;
  date: string;
  status: "Present" | "Absent";
};

export type FilterParams = {
  teamMemberId: string;
  fromDate: string;
  toDate: string;
};