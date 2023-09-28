import React from 'react';
import {
  CONTENT_INTRO_1,
  CONTENT_INTRO_2,
  CONTENT_INTRO_3,
  CONTENT_EVENT_STABILITY,
  CONTENT_EVENT_ASTEROID_BREAKUP,
  CONTENT_CRASH_STAR_PLANET,
  CONTENT_CRASH_PLANET_PLANET,
  CONTENT_CRASH_ASTEROID,
  CONTENT_CRASH_COMET,
} from '../config/config';

const output = {
  keypadInfo: {
    keypadDescriptionText:
      'The keypad on the right lets you operate the program without using the touchscreen.',
    headphonesInstructionText:
      'If you also want to hear audio image descriptions and navigation information, plug headphones into the jack.',
    volumeInstructionText: 'Adjust Volume',
    readerSpeedInstructionText: 'Adjust Screen Reader Speed ',
    leftButtonInstructionText: 'Go to a Previous Item',
    rightButtonInstructionText: 'Advance to Next Item',
    centerButtonInstructionText: 'Select',
    useKeypadInstructionText:
      'To continue using this keypad, use the keypad to navigate and select the continue button. If opting to not use the keypad, use the touch screen to close this window.',
    continueButtonText: 'Continue',
    labelIgnore: 'ADA Instructions - 1',
    headphoneJackInstructionText: 'Headphone Jack',
    adaOverallHeadphoneText:
      'The keypad on the right lets you operate the program without using the touchscreen. To adjust volume, use the top two square buttons. To adjust the screen reader speed, use the right two square buttons. To go to a previous item, use the left arrow. To advance to the next item, use the right arrow. To select, use the center button. To continue using this keypad, use the keypad to navigate and select the continue button. If opting to not use the keypad, use the touch screen to close this window.',
  },
  general: {
    startOverButtonLabel: 'Start Over',
    startOverButtonAriaRoleDescription:
      'Button. Press the center key to select.',
  },
  attract: {
    title: (
      <>
        <span>BUILD YOUR OWN</span> <span>SOLAR SYSTEM</span>
      </>
    ),
    buttonLabel: 'Touch to Start',
    creditButtonLabel:
      'Credits, button. Press the center key to hear the list of people credited for this experience, or tab once for the Continue button.',
    creditAD:
      'A list of credits in the center of the screen. Tab once with the right arrow key for the list, or tab twice for the close button to return to the keypad introduction screen.',
    creditBoxAD:
      'Listen to the credits for the exhibit, or tab once with the right arrow key at any time for the close button to return to the main screen',
    closeButtonAD:
      'Close, button. Press the center key to return to the keypad introduction screen.',
    audioDescription:
      'In the background there is a colorful illustration of a solar system. In the foreground is a purple circle containing the title, “Build Your Own Solar System” in white text. In the lower right corner of the screen is a credits button. Press the center key on the keypad to begin.',
  },
  credits: [
    'California Institute of Technology',
    'National Aeronautics and Space Administration',
  ],
  intro: {
    audioDescription:
      'Instructions that explain how to build a Solar System are on the right side of the screen. There is an illustration on the left and a button labelled "Next" below the instructions. Tab once with the right arrow key to read the instructions, tab twice for the alt text, and tab three times for the button to go to the next step. A Close button is in the upper right corner, tab four times with the right arrow key to skip and close the instructions and begin the gameplay. A Start Over button is available in the bottom left corner throughout the experience, continue tabbing with the right arrow key to get to it',
    previousButtonLabel: 'Previous',
    previousButtonAriaRoleDescription:
      'Button. Press the center key to go back to the previous instruction',
    nextButtonLabel: 'Next',
    nextButtonAriaRoleDescription:
      'Button. Press the center key to go to the next instruction.',
    letsgoButtonLabel: 'Lets Go!',
    letsgoButtonAriaRoleDescription:
      'Button. Press the center key to begin the gameplay.',
    closeButtonAriaLabel: 'Close',
    closeButtonAriaRoleDescription:
      'button Press the center key to proceed directly to gameplay',
    instructionsAudioDescription:
      'Instructions that explain how to build a Solar System are on the right side of the screen. There is an illustration on the left and a button labelled "Next" below the instructions. Tab once with the right arrow key to read the instructions, tab twice for the alt text, and tab three times for the button to go to the next step. A Close button is in the upper right corner, tab four times with the right arrow key to skip and close the instructions and begin the gameplay. A Start Over button is available in the bottom left corner throughout the experience, continue tabbing with the right arrow key to get to it',
    instructions: [
      {
        title: 'Intro',
        ariaIndex: 'Instruction 1 of 3',
        thumb: CONTENT_INTRO_1,
        imgAlt:
          'An illustration of the solar system with lines around the sun showing the planets’ orbit.',
        heading: 'Build your own solar system',
        body1:
          'Solar systems are balancing acts. Gravity from every planetary body pulls at every other one—sometimes with catastrophic results.',
        body2:
          'Can you build a stable solar system, where gravitational forces balance each other?',
        audioTutorialGroup: 'One, Intro',
      },
      {
        title: 'Add Planets',
        ariaIndex: 'Instruction 2 of 3',
        thumb: CONTENT_INTRO_2,
        imgAlt:
          'Three planets are shown vertically on the screen. An index finger cursor is shown on the second planet, showing a drag and drop gesture.',
        heading: 'How to build your solar system',
        body1:
          'Select planets, comets and asteroids. Then drag and drop them anywhere around the star. Watch gravity take effect! Do you see any patterns?',
        body2: '',
        audioTutorialGroup: 'Two, Add Planets',
      },
      {
        title: 'Events',
        ariaIndex: 'Instruction 3 of 3',
        thumb: CONTENT_INTRO_3,
        imgAlt:
          'An image of what event pop-ups will look like: this example shows a dark blue box containing a dramatic image of two planets colliding, with the title “interplanetary crash” next to the image; lines to the right of the image represent where the text will appear, with a button labeled "Got it" below to dismiss the event and continue playing.',
        heading: 'Notable celestial events',
        body1:
          'Forces of gravity can trigger extraordinary events. We’ll let you know when big things happen!',
        body2: '',
        audioTutorialGroup: 'Three, Events',
      },
    ],
  },
  main: {
    audioDescription:
      "On the right side of the screen is the gameplay area, with a starry sky background and a bright orange circle representing a sun in the center. On the left are two boxes. The first box, titled “Pick some planets!” contains three planets. The second box, below it, labeled “Add comets and asteroids,” contains a comet and asteroids. Each has a sound associated with it, is interactive, and can be added into the gameplay area to orbit the sun. A Clear All button is in the bottom left corner of the gameplay area. A button to review the game's instructions is in the bottom right corner. Begin your experience by tabbing once with the right arrow key.",
    leftBarInstructions:
      'Use the up and down arrow keys to select a planet, comet, or asteroid, and press the center key to add it to the solar system. There are 5 objects that can be placed in orbit. Once added, the planet or object will be part of the solar system, and its corresponding sound will play. The more objects you add to the solar system, the busier it will sound',
    selectMenuItem1AriaLabel:
      'Planet 1 of 3, a small blue planet. Press the center key to add this planet to orbit the solar system.',
    selectMenuItem2AriaLabel:
      'Planet 2 of 3, a medium purple planet. Press the center key to add this planet to orbit the solar system.',
    selectMenuItem3AriaLabel:
      'Planet 3 of 3, a large orange planet. Press the center key to add this planet to orbit the solar system.',
    selectMenuItem4AriaLabel:
      'Comet 1 of 1, a bright blue streak. Press the center key to add this comet to orbit the solar system.',
    selectMenuItem5AriaLabel:
      'Asteroids 1 of 1, a group of grey rocks. Press the center key to add an asteroids belt to the solar system.',
    selectMenuItem5ArialLabel_grayed:
      'Asteroids 1 of 1, a greyed out group of grey rocks. All asteroids used, no more can be added to the solar system.',
    clearAllButtonLabel: 'Clear All',
    clearAllButtonAriaRoledescription:
      'Button. Press the center key to select.',
    instructionsButtonAriaRoledescription:
      'Button. Press the center key to select the instructions for the gameplay again.',
    exitEvent: {
      audioDescription: 'Gameplay is paused, a message is onscreen.',
      adTabAriaInstruction:
        'Tab once with the right arrow to exit the game, or tab twice to return to the gameplay.',
      adTabAriaInstructionEndEvent:
        'Tab once with the right arrow to learn more about our solar system, or tab twice to return to the gameplay.',
      yesButtonLabel: 'Yes, Start Over',
      yesButtonAriaRoledescription:
        'Button. Press the center key to return to the beginning of the program.',
      cancelButtonLabel: 'Cancel',
      cancelButtonAriaRoleDescription:
        'button. Press the center key to select and return to the gameplay.',
      closeButtonAriaLabel: 'Close',
      closeButtonAriaRoleDescription:
        'Button, Press the center key to select and return to the game',
      title: 'Are You Sure You Want to Exit Game?',
      description:
        'You will exit the game and your solar system will be erased.',
    },
    stabilityEvent: {
      audioDescription: 'Gameplay is paused, a message is onscreen.',
      title: 'Nice and Steady!',
      description:
        'Your planets have been orbiting for a while with no collisions. Keep it up!',
      imgUrl: CONTENT_EVENT_STABILITY,
      imgAlt:
        'A computer generated image shows the planets in a solar system and their respective orbits around a hot yellow sun.',
      gotItButtonAriaRoleDescription:
        'Button, Press the center key to return to the game.',
      closeButtonAriaLabel: 'Close',
      closeButtonAriaRoleDescription:
        'Button. Press the center key to go back to the game.',
    },
    asteroidBreakupEvent: {
      audioDescription: 'Gameplay is paused, a message is onscreen.',
      title: 'You’re Breaking Up!',
      description:
        'Your group of asteroids just had a breakup. It happens – gravity can force individual bodies into whole new orbits, far away from their original companions.',
      imgUrl: CONTENT_EVENT_ASTEROID_BREAKUP,
      imgAlt:
        'An image shows an asteroid exploding in a yellow burst, sending smaller chunks of rocks flying out.',
      gotItButtonAriaRoleDescription:
        'Button, Press the center key to return to the game.',
      closeButtonAriaLabel: 'Close',
      closeButtonAriaRoleDescription:
        'Button. Press the center key to go back to the game.',
    },
    events: {
      starCrash: {
        audioDescription: 'Gameplay is paused, a message is onscreen.',
        title: 'A Star Ate Your Planet',
        description:
          'Your planet has collided with its star! It can happen, particularly with young solar systems. The immense gravity from stars can devour young planets around them. ',
        imgUrl: CONTENT_CRASH_STAR_PLANET,
        imgAlt:
          'An image shows a smaller planet being engulfed in a yellow and orange explosion.',
        gotItButtonLabel: 'Got It',
        gotItButtonAriaRoleDescription:
          'Button, Press the center key to return to the game.',
        closeButtonAriaLabel: 'Close',
        closeButtonAriaRoleDescription:
          'Button. Press the center key to go back to the game.',
      },
      planetCol: {
        audioDescription: 'Gameplay is paused, a message is onscreen.',
        title: 'Interplanetary Crash!',
        description:
          'Uh oh! Your planets have collided. Don’t feel bad; it happens in real solar systems too, when they are still young and relatively unstable. ',
        imgUrl: CONTENT_CRASH_PLANET_PLANET,
        imgAlt:
          'A dramatic image of two planets colliding together, the surface of the left planet cracking under the bright light of the colliding planet on the right.',
        gotItButtonLabel: 'Got It',
        gotItButtonAriaRoleDescription:
          'Button, Press the center key to return to the game.',
        closeButtonAriaLabel: 'Close',
        closeButtonAriaRoleDescription:
          'Button. Press the center key to go back to the game.',
      },
      asteroidCol: {
        audioDescription: 'Gameplay is paused, a message is onscreen.',
        title: 'Asteroid Collision!',
        description:
          'Your asteroids left their orbit and crashed! Asteroids can get pulled into dangerous orbits fairly easily, given their small size. Asteroid collisions are still happening in our solar system.',
        imgUrl: CONTENT_CRASH_ASTEROID,
        imgAlt:
          'An image shows an asteroid breaking apart in an orange-tinted burst, sending smaller chunks of rocks flying out from the impact.',
        gotItButtonLabel: 'Got It',
        gotItButtonAriaRoleDescription:
          'Button, Press the center key to return to the game.',
        closeButtonAriaLabel: 'Close',
        closeButtonAriaRoleDescription:
          'Button. Press the center key to go back to the game.',
      },
      cometCol: {
        audioDescription: 'Gameplay is paused, a message is onscreen.',
        title: 'Cometary Impact!',
        description:
          'Comets travel vast distances in highly elliptical orbits. They are relatively small celestial objects, which can easily be pulled towards collision with other bodies.',
        imgUrl: CONTENT_CRASH_COMET,
        imgAlt:
          'An image shows a comet breaking apart in an orange-tinted burst, sending smaller chunks of rocks flying out from the impact.',
        gotItButtonLabel: 'Got It',
        gotItButtonAriaRoleDescription:
          'Button, Press the center key to return to the game.',
        closeButtonAriaLabel: 'Close',
        closeButtonAriaRoleDescription:
          'Button. Press the center key to go back to the game.',
      },
    },
    endEvents: {
      audioDescription: 'Gameplay is ended, a message is onscreen.',
      closeButtonAriaLabel: 'Close',
      closeButtonAriaRoleDescription:
        'Button, Press the center key to select and return to the game',
      endButtonLabel: 'What about our solar system?',
      endButtonAriaRoledescription: 'Button. Press the center key to select.',
      stable: {
        title: 'Congratulations',
        description: '', //TODO dynamic string(resolve)
      },
      relativelyStable: {
        title: 'Congratulations',
        description: '', //TODO dynamic string(resolve)
      },
      crashes: {
        title: 'BAM!',
        description: '', //TODO dynamic string(resolve)
      },
    },
  },
  outro: {
    audioDescription:
      'A balanced solar system with numerous colorful planets surrounding a hot orange star is shown on the right of the screen.',
    title: 'What about our solar system?',
    description:
      'Solar systems can be very unstable. Here in our neighborhood, Earth and the other planets have achieved balance over time—a kind of gravitational harmony. Back in the early days of our solar system, huge crashes were plentiful. Comets and asteroids still collide with planets today.',
    backToStartButtonLabel: 'Back to Start',
    backToStartButtonAriaRoledescription:
      'Button. Press the center key to select. ',
  },
};

export default output;
