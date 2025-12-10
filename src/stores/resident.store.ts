import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { Constants } from '@/config/constants';

import type { ResidentContext } from '@/types/entity';

import residentService from '@/services/krama-resident.service';

interface ResidentStore {
  residents: ResidentContext[];
  activeResident: ResidentContext | null;
  loading: boolean;
  error: string | null;

  // Actions
  fetchContextResidents: () => Promise<void>;
  setActiveResident: (resident: ResidentContext) => void;
  clearResident: () => void;
}

export const useResidentStore = create<ResidentStore>()(
  persist(
    (set, get) => ({
      residents: [],
      activeResident: null,
      loading: false,
      error: null,

      fetchContextResidents: async () => {
        set({ loading: true, error: null });
        try {
          // residentService.getContextResidents already returns the array now (see service fix)
          const residents = await residentService.getContextResidents();
          set({ residents });

          const { activeResident } = get();
          if (residents.length > 0) {
            // Fix 'any' implicit type by typing 'r'
            const stillExists =
              activeResident && residents.find((r: ResidentContext) => r.id === activeResident.id);
            if (!activeResident || !stillExists) {
              set({ activeResident: residents[0] });
            }
          } else {
            set({ activeResident: null });
          }
        } catch (error) {
          set({ error: 'Failed to load residents', residents: [] }); // Safely reset to empty array
          console.error(error);
        } finally {
          set({ loading: false });
        }
      },

      setActiveResident: (resident) => set({ activeResident: resident }),

      clearResident: () => set({ residents: [], activeResident: null }),
    }),
    {
      name: Constants.LS_KEYS.RESIDENT_CONTEXT || 'resident-context', // Assuming a key, fall back to string if not in constants yet
      partialize: (state) => ({ activeResident: state.activeResident }), // Persist only active resident preference
    },
  ),
);
