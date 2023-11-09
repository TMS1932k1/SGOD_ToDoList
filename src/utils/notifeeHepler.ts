import notifee, {TimestampTrigger, TriggerType} from '@notifee/react-native';
import {ToDo} from '../types';
import Moment from 'moment';

export const createPermissionNotification = async () => {
  // Request permissions (required for iOS)
  await notifee.requestPermission();

  // Create a channel (required for Android)
  await notifee.createChannel({
    id: 'updateid',
    name: 'Update detail',
  });
};

export const createDisplayNotification = async (
  title?: string,
  body?: string,
) => {
  await notifee.displayNotification({
    id: 'update',
    title: title ?? "Update's detail",
    body: body ?? "This is update's detail of todo app",
    android: {
      channelId: 'updateid',
      actions: [
        {
          title: 'Read',
          pressAction: {
            id: 'read',
          },
        },
      ],
    },
  });
};

export const createTriggerNotification = async (todo: ToDo) => {
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
      },
    },
    trigger,
  );
};

export const cancleNotifee = async (id: string) => {
  await notifee.cancelNotification(id);
};
