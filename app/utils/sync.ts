// app/utils/sync.ts
import { AppState } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import { syncCategories, pullCategoriesFromBackend } from '../db/syncCategories';
import { database } from '../db/watermelon';

// Upsert logic for pulling remote categories into WatermelonDB
const upsertCategory = async (cat: any) => {
  const collection = database.get('categories');
  const existing = await collection.query().fetch();
  const found = existing.find((c: any) => c.id === cat.id);
  await database.write(async () => {
    if (found) {
      await found.update((rec: any) => {
        rec.name = cat.name;
        rec.color = cat.color;
        rec.icon = cat.icon;
        rec.is_default = cat.isDefault;
        rec.updated_at = cat.updatedAt;
      });
    } else {
      await collection.create((rec: any) => {
        rec._raw.id = cat.id;
        rec.name = cat.name;
        rec.color = cat.color;
        rec.icon = cat.icon;
        rec.is_default = cat.isDefault;
        rec.created_at = cat.createdAt;
        rec.updated_at = cat.updatedAt;
      });
    }
  });
};

export const setupCategorySync = () => {
  // Sync on app start
  syncCategories();
  pullCategoriesFromBackend(upsertCategory);

  // Sync on app resume
  AppState.addEventListener('change', (state) => {
    if (state === 'active') {
      syncCategories();
      pullCategoriesFromBackend(upsertCategory);
    }
  });

  // Sync on network reconnect
  NetInfo.addEventListener((state) => {
    if (state.isConnected) {
      syncCategories();
      pullCategoriesFromBackend(upsertCategory);
    }
  });
};
