import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../config/database';
import bcrypt from 'bcryptjs';

// Patient attributes interface
interface PatientAttributes {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  dateOfBirth: Date;
  gender: string;
  phone: string;
  address: string;
  medicalHistory?: string;
  emergencyContact?: string;
  insuranceInfo?: string;
  lastLogin?: Date;
  role: string;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

// For creating new instances with optional fields
interface PatientCreationAttributes extends Optional<PatientAttributes, 'id' | 'role' | 'isActive' | 'lastLogin' | 'createdAt' | 'updatedAt'> {}

// Patient model class
class Patient extends Model<PatientAttributes, PatientCreationAttributes> implements PatientAttributes {
  public id!: number;
  public firstName!: string;
  public lastName!: string;
  public email!: string;
  public password!: string;
  public dateOfBirth!: Date;
  public gender!: string;
  public phone!: string;
  public address!: string;
  public medicalHistory?: string;
  public emergencyContact?: string;
  public insuranceInfo?: string;
  public lastLogin?: Date;
  public role!: string;
  public isActive!: boolean;
  
  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  
  // Instance methods
  async comparePassword(candidatePassword: string): Promise<boolean> {
    return bcrypt.compare(candidatePassword, this.password);
  }
}

// Initialize Patient model
Patient.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    firstName: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    dateOfBirth: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    gender: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    medicalHistory: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    emergencyContact: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    insuranceInfo: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    lastLogin: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    role: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: 'patient',
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: 'Patient',
    tableName: 'patients',
    timestamps: true,
    hooks: {
      // Hash password before saving
      beforeCreate: async (patient: Patient) => {
        const salt = await bcrypt.genSalt(10);
        patient.password = await bcrypt.hash(patient.password, salt);
      },
      // Hash password before updating if changed
      beforeUpdate: async (patient: Patient) => {
        if (patient.changed('password')) {
          const salt = await bcrypt.genSalt(10);
          patient.password = await bcrypt.hash(patient.password, salt);
        }
      },
    },
  }
);

export default Patient; 