/** @jsx jsx */
import React, { useReducer, createContext, useEffect, useRef } from 'react'
import { css, jsx } from '@emotion/core'
import TopBar from './TopBar'
import SideBar from './SideBar'
import Content from './Content'
import PlayBar from './PlayBar'
import media from '../../media.json'

export const StoreContext = createContext(null)
const DEFAULT_PLAYLIST = 'home'
const DEFAULT_VOLUME = 0.65

const initialState = {
  media,
  addToPlaylistId: '',
  currentPlaylist: DEFAULT_PLAYLIST,
  currentSongId: '',
  currentTime: 0,
  duration: 0,
  playing: false,
  playlists: {
    home: new Set(media.ids),
    favorites: new Set()
  },
  volume: DEFAULT_VOLUME
}

const reducer = (state, action) => {
  switch (action.type) {
    case 'ADD_PLAYLIST':
      return {
        ...state,
        playlists: { ...state.playlists, [action.playlist]: new Set() }
      }
    case 'SET_PLAYLIST':
      return {
        ...state,
        currentPlaylist: action.playlist
      }
    case 'ADD_TO_PLAYLIST':
      return { ...state, addToPlaylistId: action.songId }
    case 'ABORT_ADD_TO_PLAYLIST':
      return { ...state, addToPlaylistId: '' }
    case 'ADD_FAVORITE':
      state.playlists.favorites.add(action.songId)
      return { ...state }
    case 'REMOVE_FAVORITE':
      state.playlists.favorites.delete(action.songId)
      return { ...state }
    case 'PLAY':
      console.log('action.songId: ' + action.songId)
      return {
        ...state,
        playing: true,
        currentSongId: action.songId || state.currentSongId
      }
    case 'PAUSE':
      return { ...state, playing: false }
    case 'SAVE_TO_PLAYLIST':
      state.playlists[action.playlist].add(state.addToPlaylistId)
      return { ...state, addToPlaylistId: '' }
    case 'SET_CURRENT_TIME':
      return { ...state, currentTime: action.time }
    case 'SET_DURATION':
      return { ...state, duration: action.duration }
    case 'SET_PLAYLIST':
      return { ...state, currentPlaylist: action.playlist }
    case 'SET_VOLUME':
      return { ...state, volume: parseFloat(action.volume) }
  }
  return state
}

const MusicPlayer = () => {
  const [state, dispatch] = useReducer(reducer, initialState)
  const audioRef = useRef()

  useEffect(() => {
    if (state.playing) {
      audioRef.current.load()
      audioRef.current.play()
    } else audioRef.current.pause()
  }, [state.playing, state.currentSongId])

  useEffect(() => {
    audioRef.current.volume = state.volume
  }, [state.volume])

  const song = state.media[state.currentSongId]

  return (
    <StoreContext.Provider value={{ state, dispatch }}>
      <div className="MusicPlayer" css={CSS}>
        <TopBar />
        <SideBar></SideBar>
        <Content />
        <PlayBar />

        <audio
          ref={audioRef}
          src={
            song && song.title
              ? `./media/${song.title} - ${song.artist}.mp3`
              : ''
          }
          onLoadedMetadata={() =>
            dispatch({
              type: 'SET_DURATION',
              duration: audioRef.current.duration
            })
          }
          onTimeUpdate={e =>
            dispatch({ type: 'SET_CURRENT_TIME', time: e.target.currentTime })
          }
        />
      </div>
    </StoreContext.Provider>
  )
}

const CSS = css`
  height: 100%;
  width: 100%;
  display: flex;
  position: relative;
  color: white;
`

export default MusicPlayer
