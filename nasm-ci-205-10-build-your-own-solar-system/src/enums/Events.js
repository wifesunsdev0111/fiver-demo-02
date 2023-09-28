import { REACT_APP_BASE_URL } from '../utils/config';
export const TRACKING_ID = 'UA-171489797-27';

export const LOCALHOST = REACT_APP_BASE_URL + '/session';
export const RESTART_CONFIGS_URL = REACT_APP_BASE_URL + '/restart_config';

export const KEYPAD_EVENTS = {
  CATEGORY: 'Sessions',
  ACTION: 'Start',
  LABEL1: 'Start',
  LABEL2: 'Start-Keypad',
  VALUE: 0,
};
export const BUTTON_EVENTS = {
  CATEGORY: 'Button Usage',
  ACTION: 'Select Button',
  LABEL_START_OVER: 'Start Over',
  LABEL_BACK: 'Back to Start',
  LABEL_CLEAR_ALL: 'Clear All',
  LABEL_INSTRUCTIONS: 'Instructions',
  LABEL_WHAT_ABOUT: 'What About our Solar System',
  LABEL_TIMESOUT: 'Session times out',
  VALUE: 0,
};

export const ACTIVITY_EVENTS = {
  CATEGORY: 'Activity Selection',
  ACTION: 'Select Activity',
  LABEL1: 'InitialSelect',
  LABEL2: 'Switch',
  LABEL3: 'Explore the Icy Worlds',
  LABEL4: 'More about the Kuiper Belt',
  VALUE: 0,
};

export const SYSTEM_EVENTS = {
  CATEGORY: 'Solar System Events',
  ACTION: 'Solar System Event Achieved',
  LABEL: [
    'No Planets',
    'Stability',
    'Cometary Impact',
    'Interplanetary Crash',
    'A Star Ate Your Planet',
    'Asteroid Collision',
    "You're breaking up!",
    'Congratulations',
  ],
  VALUE: 0,
};

export const TUTORIAL_EVENTS = {
  CATEGORY: 'Tutorial Step Selection',
  ACTION: 'Select Tutorial Step',
  LABEL: ['Next-Add Planets;', 'Next-Events;', 'Lets Go!'],
  VALUE: 0,
};
export const SESSION_DURATION_EVENTS = {
  CATEGORY: 'Session Duration',
  ACTION: 'Session duration recorded',
  LABEL: 'The session duration was ',
};
