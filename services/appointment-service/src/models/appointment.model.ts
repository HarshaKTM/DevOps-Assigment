import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../config/database';

// Appointment attributes interface
interface AppointmentAttributes {
  id: number;
  patientId: number;
  doctorId: number;
  startTime: Date;
  endTime: Date;
  status: string; // 'scheduled', 'completed', 'canceled', 'no-show'
  type: string; // 'regular', 'follow-up', 'emergency', 'telemedicine'
  notes?: string;
  reason?: string;
  location?: string;
  createdBy: number;
  updatedBy?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

// For creating new instances with optional fields
interface AppointmentCreationAttributes extends Optional<AppointmentAttributes, 'id' | 'updatedBy' | 'createdAt' | 'updatedAt' | 'notes' | 'reason' | 'location'> {}

// Appointment model class
class Appointment extends Model<AppointmentAttributes, AppointmentCreationAttributes> implements AppointmentAttributes {
  public id!: number;
  public patientId!: number;
  public doctorId!: number;
  public startTime!: Date;
  public endTime!: Date;
  public status!: string;
  public type!: string;
  public notes?: string;
  public reason?: string;
  public location?: string;
  public createdBy!: number;
  public updatedBy?: number;
  
  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

// Initialize Appointment model
Appointment.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    patientId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'patient_id',
    },
    doctorId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'doctor_id',
    },
    startTime: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'start_time',
    },
    endTime: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'end_time',
    },
    status: {
      type: DataTypes.ENUM('scheduled', 'completed', 'canceled', 'no-show'),
      allowNull: false,
      defaultValue: 'scheduled',
    },
    type: {
      type: DataTypes.ENUM('regular', 'follow-up', 'emergency', 'telemedicine'),
      allowNull: false,
      defaultValue: 'regular',
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    reason: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    location: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    createdBy: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'created_by',
    },
    updatedBy: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'updated_by',
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: 'created_at',
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: 'updated_at',
    },
  },
  {
    sequelize,
    modelName: 'Appointment',
    tableName: 'appointments',
    timestamps: true,
    underscored: true,
    indexes: [
      {
        name: 'appointments_patient_id_idx',
        fields: ['patient_id'],
      },
      {
        name: 'appointments_doctor_id_idx',
        fields: ['doctor_id'],
      },
      {
        name: 'appointments_start_time_idx',
        fields: ['start_time'],
      },
    ],
  }
);

export default Appointment; 