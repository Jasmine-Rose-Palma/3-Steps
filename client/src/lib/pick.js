export function pickRandom(list, excludeId) {
  if (list.length === 0) {
    return null;
  }
  const pool = list.filter((item) => item.id !== excludeId);
  const finalPool = pool.length > 0 ? pool : list;
  const randomIndex = Math.floor(Math.random() * finalPool.length);
  return finalPool[randomIndex];
}
