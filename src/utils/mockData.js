export const mockUser = {
  id: '1',
  name: 'Ahmed Khan',
  email: 'ahmed.khan@ubl.com.pk',
  role: 'EAMVU_OFFICER',
  phone: '+92-300-1234567'
};

export const mockApplications = [
  {
    id: '1',
    losId: 'UBL-2024-001234',
    applicantName: 'Muhammad Ali Khan',
    applicantPhone: '+92-300-1234567',
    loanType: 'CashPlus Loan',
    amount: 'PKR 2,500,000',
    priority: 'High',
    address: 'House 123, Block A, Gulshan-e-Iqbal, Karachi',
    status: 'Pending',
    assignedDate: '2024-01-15',
    documents: [
      {
        id: '1',
        name: 'CNIC Front & Back',
        type: 'CNIC',
        status: 'Pending',
        required: true
      },
      {
        id: '2',
        name: 'Last 3 Months Salary Slips',
        type: 'Salary Slip',
        status: 'Pending',
        required: true
      },
      {
        id: '3',
        name: 'Last 6 Months Bank Statement',
        type: 'Bank Statement',
        status: 'Pending',
        required: true
      }
    ],
    notes: 'Applicant works at ABC Company. Visit during office hours.'
  },
  {
    id: '2',
    losId: 'UBL-2024-001235',
    applicantName: 'Fatima Ahmed',
    applicantPhone: '+92-321-9876543',
    loanType: 'Personal Auto Loan',
    amount: 'PKR 800,000',
    priority: 'Medium',
    address: 'Flat 456, DHA Phase 2, Karachi',
    status: 'In Progress',
    assignedDate: '2024-01-14',
    documents: [
      {
        id: '4',
        name: 'CNIC Front & Back',
        type: 'CNIC',
        status: 'Collected',
        required: true
      },
      {
        id: '5',
        name: 'Vehicle Registration Book',
        type: 'Other',
        status: 'Pending',
        required: true
      },
      {
        id: '6',
        name: 'Insurance Documents',
        type: 'Other',
        status: 'Pending',
        required: true
      }
    ],
    notes: 'Vehicle is Honda City 2020 model. Verify ownership documents.'
  },
  {
    id: '3',
    losId: 'UBL-2024-001236',
    applicantName: 'Hassan Raza',
    applicantPhone: '+92-333-5555555',
    loanType: 'SME ASAAN Loan',
    amount: 'PKR 5,000,000',
    priority: 'High',
    address: 'Office 789, Clifton Commercial Area, Karachi',
    status: 'Pending',
    assignedDate: '2024-01-16',
    documents: [
      {
        id: '7',
        name: 'CNIC Front & Back',
        type: 'CNIC',
        status: 'Pending',
        required: true
      },
      {
        id: '8',
        name: 'Business Registration Certificate',
        type: 'Other',
        status: 'Pending',
        required: true
      },
      {
        id: '9',
        name: 'Last 2 Years Tax Returns',
        type: 'Other',
        status: 'Pending',
        required: true
      },
      {
        id: '10',
        name: 'Property Documents (if collateral)',
        type: 'Property Documents',
        status: 'Pending',
        required: false
      }
    ],
    notes: 'Business: Electronics Store. Visit during business hours (10 AM - 8 PM).'
  },
  {
    id: '4',
    losId: 'UBL-2024-001237',
    applicantName: 'Ayesha Malik',
    applicantPhone: '+92-301-7777777',
    loanType: 'Classic Credit Card Loan',
    amount: 'PKR 500,000',
    priority: 'Low',
    address: 'Apartment 12, F-Block, Johar Town, Lahore',
    status: 'Pending',
    assignedDate: '2024-01-17',
    documents: [
      {
        id: '11',
        name: 'CNIC Front & Back',
        type: 'CNIC',
        status: 'Pending',
        required: true
      },
      {
        id: '12',
        name: 'Employment Letter',
        type: 'Other',
        status: 'Pending',
        required: true
      },
      {
        id: '13',
        name: 'Last 3 Months Bank Statement',
        type: 'Bank Statement',
        status: 'Pending',
        required: true
      }
    ],
    notes: 'Teacher at Government College. Available after 3 PM.'
  },
  {
    id: '5',
    losId: 'UBL-2024-001238',
    applicantName: 'Tariq Ahmed',
    applicantPhone: '+92-345-8888888',
    loanType: 'Ameen Drive Loan',
    amount: 'PKR 1,200,000',
    priority: 'Medium',
    address: 'Shop 45, Main Market, Model Town, Islamabad',
    status: 'In Progress',
    assignedDate: '2024-01-13',
    documents: [
      {
        id: '14',
        name: 'CNIC Front & Back',
        type: 'CNIC',
        status: 'Collected',
        required: true
      },
      {
        id: '15',
        name: 'Driving License',
        type: 'Other',
        status: 'Collected',
        required: true
      },
      {
        id: '16',
        name: 'Vehicle Documents',
        type: 'Other',
        status: 'Pending',
        required: true
      }
    ],
    notes: 'Taxi driver. Best to visit at taxi stand in the evening.'
  }
];