import { Comic } from '../types';
import { renderHook, act } from '@testing-library/react-hooks';
import { ComicProvider, ComicContext } from '../context/ComicContext';
import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

jest.mock('@react-native-async-storage/async-storage');

describe('ComicContext', () => {
  it('adds a comic locally', async () => {
    const wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
      <ComicProvider>{children}</ComicProvider>
    );
    const { result } = renderHook(() => React.useContext(ComicContext), { wrapper });

    const comic: Comic = { id: '1', title: 'Test', panels: [] };

    await act(async () => {
      await result.current.addComic(comic);
    });

    expect(result.current.comics.length).toBe(1);
    expect(AsyncStorage.setItem).toHaveBeenCalled();
  });
});
