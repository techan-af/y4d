export interface User {
  _id?: string
  email: string
  password: string
  name: string
  createdAt: Date
}

export interface Project {
  _id?: string
  title: string
  description: string
  shortDescription: string
  image: string
  location: string
  targetBeneficiaries: number
  currentBeneficiaries: number
  startDate: string
  endDate: string
  category: string
  requirements: string[]
  status?: "active" | "completed" | "paused" | "closed" // add "closed" here
  createdAt: Date
}

export interface Registration {
  _id?: string
  projectId: string
  userId?: string
  name: string
  email: string
  phone: string
  aadhaarCard: string
  address: string
  age: number
  gender: string
  occupation: string
  familySize: number
  monthlyIncome: number
  status: "pending" | "approved" | "rejected"
  createdAt: Date
}

export interface RegistrationWithProject extends Registration {
  project: {
    _id: string
    title: string
    category: string
    location: string
  }
}
