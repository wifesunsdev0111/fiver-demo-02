export const getDistance = (obj1, obj2) => {
  const distanceX = Math.abs(obj1.x - obj2.x);
  const distanceY = Math.abs(obj1.y - obj2.y);
  return Math.sqrt(Math.pow(distanceX, 2) + Math.pow(distanceY, 2));
};

export const getDistanceFromObject = (obj, x, y) => {
  return getDistance(obj, { x, y });
};
