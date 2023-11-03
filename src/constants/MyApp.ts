import {Filter} from '../types';

export const MyApp = {
  filter: [
    {label: Filter.All, value: Filter['All']},
    {label: Filter.DONE, value: Filter['DONE']},
    {label: Filter.TODO, value: Filter['TODO']},
  ],
};
