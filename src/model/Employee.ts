interface Employee {
  _id: string;
  name: string;
  email: string;
  phone: string;
  departmentId: string;
  designation: string;
  doj: Date;
  status: 'Active' | 'Probation' | 'Terminated';
  personalInfo: {
    dob: Date;
    gender: string;
    maritalStatus: string;
    address: { permanent: string; temporary: string };
  };
  emergencyContact: { name: string; phone: string; relation: string };
  documents: string[]; 
}
