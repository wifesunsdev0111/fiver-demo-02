import { useEffect, useState } from 'react';
import { RESTART_CONFIGS_URL } from '../../enums/Events.js';

const DEFAULT_VALS = {
  time: '05:00',
  isOn: true,
};
export default function useReloadApp() {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  function parseTime(timeString) {
    const [hours, minutes] = timeString
      .split(':')
      .map((str) => parseInt(str, 10));
    return { hours, minutes };
  }
  async function fetchData() {
    try {
      const response = await fetch(RESTART_CONFIGS_URL);
      const responseData = await response.json();
      setData(responseData);
      setIsLoading(false);
    } catch (error) {
      console.error('fetching error: ', error);
    }
  }

  //only fetch time once when the app loads
  useEffect(() => {
    fetchData();
  }, []);

  //compare current time against config time, if matches, reload the app
  useEffect(() => {
    const intervalId = setInterval(() => {
      console.log('RELOAD DATA', data);
      let timeObject =
        data && Object.keys(data).length !== 0
          ? parseTime(data.time)
          : parseTime(DEFAULT_VALS.time);

      let isOn = data ? data.isOn : DEFAULT_VALS.isOn;

      const currentDate = new Date();

      if (
        currentDate.getHours() === timeObject.hours &&
        currentDate.getMinutes() === timeObject.minutes &&
        isOn &&
        !isLoading
      ) {
        window.location.reload();
      }
    }, 30000);

    return () => {
      clearInterval(intervalId);
    };
  }, [data, isLoading]);
}
