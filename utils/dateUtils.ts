import { DateTime } from 'luxon';

function calculateAge(birthdate: string) {
  const nowDateTime = DateTime.now();
  const birthdateDateTime = DateTime.fromFormat(birthdate, 'yyyyMMdd');
  const diff = nowDateTime.diff(birthdateDateTime).as('years');
  return Math.floor(diff);
}

export { calculateAge };
