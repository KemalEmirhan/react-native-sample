import { StyleSheet, View, Text, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { theme } from '@/theme';
import { registerForPushNotificationsAsync } from '@/utils/registerForPushNotificationsAsync';
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { useEffect, useState } from 'react';
import { intervalToDuration, isBefore } from 'date-fns';
import TimeSegment from '@/components/TimeSegment';
import { getFromStorage, saveToStorage } from '@/utils/storage';

const frequency = 10 * 1000; // 10 seconds from now
export const countdownStorageKey = 'countdown';

type CountdownStatus = {
  isOverdue: boolean;
  distance: ReturnType<typeof intervalToDuration>;  // { years: 0, months: 0, days: 0, hours: 0, minutes: 0, seconds: 0 }
}

export type PersistedCountdownState = {
  currentNotificationId: string | undefined;
  completedAtTimestamps: number[];
}

export default function Counter() {
  const [countdownState, setCountdownState] = useState<PersistedCountdownState>({
    currentNotificationId: undefined,
    completedAtTimestamps: [],
  });

  const [status, setStatus] = useState<CountdownStatus>({
    isOverdue: false,
    distance: {},
  });

  const [isLoading, setIsLoading] = useState(true);

  const lastCompletedTimestamp = countdownState?.completedAtTimestamps.at(0);

  useEffect(() => {
    const loadPersistedState = async () => {
      const persistedState = await getFromStorage(countdownStorageKey);
      if (persistedState) {
        setCountdownState(JSON.parse(persistedState));
      }
    };
    loadPersistedState();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const timestamp = lastCompletedTimestamp ? lastCompletedTimestamp + frequency : Date.now();
      if (lastCompletedTimestamp) {
        setIsLoading(false);
      }
      const isOverdue = isBefore(timestamp, new Date());
      const distance = intervalToDuration(isOverdue ? { start: timestamp, end: Date.now() } : { start: Date.now(), end: timestamp });
      setStatus({ isOverdue, distance });
    }, 1000);
    return () => clearInterval(interval);
  }, [lastCompletedTimestamp]);

  const scheduleNotification = async () => {
    let pushNotificationId;
    const status = await registerForPushNotificationsAsync();
    if (status === 'granted') {
      const notification = {
        title: 'Notification',
        body: 'This is a notification',
      };
      pushNotificationId = await Notifications.scheduleNotificationAsync({
        content: notification,
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
          seconds: frequency / 1000,
        },
      });
    } else {
      if (Device.isDevice) {
        Alert.alert(
          'Unable to schedule notification',
          'Enable the notification permission in the settings'
        );
      }
    }

    if (countdownState?.currentNotificationId) {
      await Notifications.cancelScheduledNotificationAsync(countdownState.currentNotificationId);
    }

    const newCountdownState: PersistedCountdownState = {
      currentNotificationId: pushNotificationId,
      completedAtTimestamps: countdownState ? [Date.now(), ...countdownState.completedAtTimestamps] : [Date.now()],
    };

    setCountdownState(newCountdownState);
    await saveToStorage(countdownStorageKey, JSON.stringify(newCountdownState));
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.black} />
      </View>
    );
  }

  return (
    <View style={[styles.container, status.isOverdue && styles.containerOverdue]}>
      {status.isOverdue ? (
        <Text style={[styles.heading, status.isOverdue && styles.whiteText]}>Thing overdued by</Text>
      ) : (
        <Text style={[styles.heading, status.isOverdue && styles.whiteText]}>Thing due in...</Text>
      )}
      <View style={styles.timeSegments}>
        <TimeSegment number={status.distance.days ?? 0} unit="Days" textStyle={status.isOverdue ? styles.whiteText : {}} />
        <TimeSegment number={status.distance.hours ?? 0} unit="Hours" textStyle={status.isOverdue ? styles.whiteText : {}} />
        <TimeSegment number={status.distance.minutes ?? 0} unit="Minutes" textStyle={status.isOverdue ? styles.whiteText : {}} />
        <TimeSegment number={status.distance.seconds ?? 0} unit="Seconds" textStyle={status.isOverdue ? styles.whiteText : {}} />
      </View>
      <TouchableOpacity
        onPress={scheduleNotification}
        style={styles.button}
        activeOpacity={0.8}
      >
        <Text style={styles.buttonText}>Schedule Notification</Text>
      </TouchableOpacity>
    </View>
  );
}
 
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.white,
  },
  containerOverdue: {
    backgroundColor: theme.colors.red,
  },
  whiteText: {
    color: theme.colors.white,
  },
  heading: {
    fontSize: 24,
    fontWeight: 700,
    marginBottom: 24,
  },
  timeSegments: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    backgroundColor: theme.colors.black,
    padding: 12,
    borderRadius: 6,
  },
  buttonText: {
    color: theme.colors.white,
    fontSize: 16,
    fontWeight: 700,
    textAlign: 'center',
    textTransform: 'uppercase',
  },
});
