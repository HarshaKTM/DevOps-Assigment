import { PubSub } from '@google-cloud/pubsub';
import { setupLogging } from '../config/logging';

// Initialize logger
const logger = setupLogging();

// Initialize PubSub client
const pubSubClient = new PubSub();

// Topic names from environment variables
const TOPIC_APPOINTMENT_CREATED = process.env.PUBSUB_TOPIC_APPOINTMENT_CREATED || 'appointment-created';
const TOPIC_APPOINTMENT_UPDATED = process.env.PUBSUB_TOPIC_APPOINTMENT_UPDATED || 'appointment-updated';
const TOPIC_APPOINTMENT_CANCELED = process.env.PUBSUB_TOPIC_APPOINTMENT_CANCELED || 'appointment-canceled';

// Topic references
let appointmentCreatedTopic: any;
let appointmentUpdatedTopic: any;
let appointmentCanceledTopic: any;

// Setup PubSub topics
export const setupPubSub = async () => {
  try {
    // Get or create topics
    [appointmentCreatedTopic] = await pubSubClient.topic(TOPIC_APPOINTMENT_CREATED).get({ autoCreate: true });
    [appointmentUpdatedTopic] = await pubSubClient.topic(TOPIC_APPOINTMENT_UPDATED).get({ autoCreate: true });
    [appointmentCanceledTopic] = await pubSubClient.topic(TOPIC_APPOINTMENT_CANCELED).get({ autoCreate: true });
    
    logger.info('PubSub topics initialized successfully');
    return true;
  } catch (error) {
    logger.error('Error setting up PubSub:', error);
    throw error;
  }
};

// Publish appointment created event
export const publishAppointmentCreated = async (appointment: any) => {
  try {
    const messageId = await appointmentCreatedTopic.publish(Buffer.from(JSON.stringify(appointment)));
    logger.info(`Published appointment created event with ID: ${messageId}`);
    return messageId;
  } catch (error) {
    logger.error('Error publishing appointment created event:', error);
    throw error;
  }
};

// Publish appointment updated event
export const publishAppointmentUpdated = async (appointment: any) => {
  try {
    const messageId = await appointmentUpdatedTopic.publish(Buffer.from(JSON.stringify(appointment)));
    logger.info(`Published appointment updated event with ID: ${messageId}`);
    return messageId;
  } catch (error) {
    logger.error('Error publishing appointment updated event:', error);
    throw error;
  }
};

// Publish appointment canceled event
export const publishAppointmentCanceled = async (appointment: any) => {
  try {
    const messageId = await appointmentCanceledTopic.publish(Buffer.from(JSON.stringify(appointment)));
    logger.info(`Published appointment canceled event with ID: ${messageId}`);
    return messageId;
  } catch (error) {
    logger.error('Error publishing appointment canceled event:', error);
    throw error;
  }
}; 