import NodeCache from 'node-cache';

const cache = new NodeCache();

export const timeBasedCache = (key: string, data: any, ttl: number) => {
  cache.set(key, data, ttl);
};

export const tagBasedCache = (tag: string, key: string, data: any) => {
    const taggedData: { [key: string]: any } = cache.get(tag) || {};
    taggedData[key] = data;
    cache.set(tag, taggedData);
  };

export const writeThroughCache = (key: string, data: any) => {
  cache.set(key, data);
  // Implement write to database logic here
};

export const writeBehindCache = (key: string, data: any) => {
  cache.set(key, data);
  setTimeout(() => {
    // Implement write to database logic here
  }, 5000); // Delay write to database
};

export const getCachedData = (key: string) => {
  return cache.get(key);
};

export const invalidateTag = (tag: string) => {
  cache.del(tag);
};

// Cache Replacement Policies
export const lruCache = new NodeCache({ stdTTL: 100, maxKeys: 100, useClones: false });
export const lfuCache = new NodeCache({ stdTTL: 100, maxKeys: 100, useClones: false });
export const fifoCache = new NodeCache({ stdTTL: 100, maxKeys: 100, useClones: false });