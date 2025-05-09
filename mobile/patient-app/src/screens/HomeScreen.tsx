import React, { useEffect, useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {
  Card,
  Title,
  Paragraph,
  Button,
  Avatar,
  List,
  Divider,
  Text,
  useTheme,
} from 'react-native-paper';
import { format } from 'date-fns';

// Services
import { fetchUpcomingAppointments } from '../services/appointmentService';

// Types
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/types';
import { Appointment } from '../types/appointment';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

const HomeScreen = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const theme = useTheme();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadAppointments = async () => {
    try {
      setLoading(true);
      const data = await fetchUpcomingAppointments();
      setAppointments(data);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAppointments();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadAppointments();
    setRefreshing(false);
  };

  const navigateToBookAppointment = () => {
    navigation.navigate('BookAppointment');
  };

  const navigateToAppointmentDetails = (appointmentId: number) => {
    navigation.navigate('AppointmentDetails', { appointmentId });
  };

  const navigateToAllAppointments = () => {
    navigation.navigate('Appointments');
  };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Welcome Card */}
      <Card style={styles.welcomeCard}>
        <Card.Content>
          <Title style={styles.welcomeTitle}>Welcome Back!</Title>
          <Paragraph>Here's a summary of your upcoming appointments.</Paragraph>
          <Button
            mode="contained"
            style={{ marginTop: 16 }}
            onPress={navigateToBookAppointment}
          >
            Book New Appointment
          </Button>
        </Card.Content>
      </Card>

      {/* Upcoming Appointments */}
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.sectionHeader}>
            <Title>Upcoming Appointments</Title>
            <Button
              mode="text"
              onPress={navigateToAllAppointments}
              labelStyle={{ fontSize: 12 }}
            >
              View All
            </Button>
          </View>

          {loading ? (
            <ActivityIndicator
              size="large"
              color={theme.colors.primary}
              style={styles.loader}
            />
          ) : appointments.length > 0 ? (
            <View style={styles.appointmentsList}>
              {appointments.map((appointment, index) => (
                <React.Fragment key={appointment.id}>
                  <TouchableOpacity
                    onPress={() => navigateToAppointmentDetails(appointment.id)}
                    style={styles.appointmentItem}
                  >
                    <List.Item
                      title={`Dr. ${appointment.doctorName}`}
                      description={`${format(new Date(appointment.startTime), 'PPP')} at ${format(
                        new Date(appointment.startTime),
                        'p'
                      )}\n${appointment.type} appointment`}
                      left={(props) => (
                        <Avatar.Icon
                          {...props}
                          icon="doctor"
                          size={50}
                          style={{ backgroundColor: theme.colors.primary }}
                        />
                      )}
                    />
                  </TouchableOpacity>
                  {index < appointments.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </View>
          ) : (
            <View style={styles.emptyState}>
              <Paragraph>No upcoming appointments found.</Paragraph>
              <Button
                mode="contained"
                style={{ marginTop: 16 }}
                onPress={navigateToBookAppointment}
              >
                Book an Appointment
              </Button>
            </View>
          )}
        </Card.Content>
      </Card>

      {/* Health Reminders */}
      <Card style={styles.card}>
        <Card.Content>
          <Title>Health Reminders</Title>
          <List.Item
            title="Medication Reminder"
            description="Take your blood pressure medication today at 8:00 PM"
            left={(props) => <List.Icon {...props} icon="pill" />}
          />
          <Divider />
          <List.Item
            title="Lab Results"
            description="Your recent lab results are now available"
            left={(props) => <List.Icon {...props} icon="file-document" />}
          />
        </Card.Content>
      </Card>

      {/* Quick Actions */}
      <Card style={styles.card}>
        <Card.Content>
          <Title>Quick Actions</Title>
          <View style={styles.quickActions}>
            <TouchableOpacity
              style={styles.quickActionButton}
              onPress={() => navigation.navigate('DoctorsList')}
            >
              <Avatar.Icon
                icon="doctor"
                size={50}
                style={{ backgroundColor: theme.colors.primary }}
              />
              <Text style={styles.quickActionText}>Doctors</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.quickActionButton}
              onPress={() => navigation.navigate('MedicalRecords')}
            >
              <Avatar.Icon
                icon="file-document"
                size={50}
                style={{ backgroundColor: theme.colors.primary }}
              />
              <Text style={styles.quickActionText}>Records</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.quickActionButton}
              onPress={() => navigation.navigate('Medications')}
            >
              <Avatar.Icon
                icon="pill"
                size={50}
                style={{ backgroundColor: theme.colors.primary }}
              />
              <Text style={styles.quickActionText}>Medications</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.quickActionButton}
              onPress={() => navigation.navigate('Profile')}
            >
              <Avatar.Icon
                icon="account"
                size={50}
                style={{ backgroundColor: theme.colors.primary }}
              />
              <Text style={styles.quickActionText}>Profile</Text>
            </TouchableOpacity>
          </View>
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  welcomeCard: {
    marginBottom: 16,
    elevation: 4,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  card: {
    marginBottom: 16,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  loader: {
    padding: 20,
  },
  appointmentsList: {
    marginTop: 8,
  },
  appointmentItem: {
    paddingVertical: 4,
  },
  emptyState: {
    padding: 16,
    alignItems: 'center',
  },
  quickActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  quickActionButton: {
    width: '48%',
    alignItems: 'center',
    padding: 16,
    marginBottom: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 2,
  },
  quickActionText: {
    marginTop: 8,
    fontWeight: '500',
  },
});

export default HomeScreen; 