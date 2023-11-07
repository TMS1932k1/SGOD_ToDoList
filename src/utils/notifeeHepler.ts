import notifee, {
  AndroidLaunchActivityFlag,
  TimestampTrigger,
  TriggerType,
} from '@notifee/react-native';
import {ToDo} from '../types';
import Moment from 'moment';

export const createTriggerNotification = async (todo: ToDo) => {
  // Request permissions (required for iOS)
  await notifee.requestPermission();

  // Create a channel (required for Android)
  const channelId = await notifee.createChannel({
    id: todo.id,
    name: todo.title,
  });

  var date = new Date(todo.deadline).getTime();

  // Create a time-based trigger
  const trigger: TimestampTrigger = {
    type: TriggerType.TIMESTAMP,
    timestamp: date - 5 * 60000,
  };

  // Create a trigger notification
  await notifee.createTriggerNotification(
    {
      id: todo.id,
      title: todo.title,
      body: `${todo.content} at ${Moment(date).format('lll')}`,
      data: {todo: todo},
      android: {
        channelId: channelId,
        pressAction: {
          id: todo.id,
          launchActivity: 'default',
          launchActivityFlags: [AndroidLaunchActivityFlag.SINGLE_TOP],
        },
      },
    },
    trigger,
  );
};

export const cancleNotifee = async (id: string) => {
  await notifee.cancelNotification(id);
};
