/** @jsx jsx */
import React, { useContext, useCallback } from 'react'
import { css, jsx } from '@emotion/core'
import { StoreContext } from './index'
import media from '../../media.json'

const formatTime = inputSeconds => {
  let seconds = Math.floor(inputSeconds % 60)
  if (seconds < 10) seconds = `0${seconds}`

  const minutes = Math.floor(inputSeconds / 60)

  return `${minutes}:${seconds}`
}

const handleProgress = (currentTime, duration) => 600 * (currentTime / duration)

const PlayBar = ({ children }) => {
  const { state, dispatch } = useContext(StoreContext)
  const song = state.media[state.currentSongId]

  const playOrPause = () =>
    state.playing ? dispatch({ type: 'PAUSE' }) : dispatch({ type: 'PLAY' })

  const setVolume = useCallback(e =>
    dispatch({ type: 'SET_VOLUME', volume: e.target.value })
  )

  return (
    <div className="Playbar" css={CSS}>
      <div className="left">
        {song && (
          <>
            <div>{song.title}</div>

            <div className="artist">{song.artist}</div>
          </>
        )}
      </div>

      <div className="middle">
        <div className="player-controls-buttons">
          <div className="button-setting">
            <PlayPrevious isCurrentSong={state.currentSongId} />
          </div>

          <div className="play-pause-circle" onClick={playOrPause}>
            <i
              className={`fa fa-${state.playing ? 'pause' : 'play'}`}
              style={{ transform: state.playing ? '' : 'translateX(1.5px)' }}
            />
          </div>
          <div className="button-setting">
            <PlayNext isCurrentSong={state.currentSongId} />
            {/* <i className="fa fa-step-forward" aria-hidden="true"></i> */}
          </div>
        </div>

        <div style={{ marginTop: 2.5 }}>
          <span>{formatTime(Math.floor(state.currentTime))}</span>

          <div className="progress-container">
            <div
              className="bar"
              style={{
                width: handleProgress(state.currentTime, state.duration)
              }}
            />
          </div>

          <span>{formatTime(state.duration)}</span>
        </div>
      </div>

      <div className="right">
        <i className="fa fa-volume-up" />

        <input
          type="range"
          min="0"
          max="1"
          value={state.volume}
          step="0.01"
          style={{ marginLeft: 10 }}
          onChange={setVolume}
        />
      </div>
    </div>
  )
}

const PlayPrevious = isCurrentSong => {
  const { dispatch } = useContext(StoreContext)
  var keys = media.ids
  console.log(String(keys))
  var current = Object.values(isCurrentSong)
  console.log(current)

  var index = keys.indexOf(String(current))
  console.log(String(index))
  var songId = keys[index - 1]
  console.log('next song: ' + String(songId))

  return (
    <i
      className="fa fa-step-backward"
      aria-hidden="true"
      onClick={() => dispatch({ type: 'PLAY', songId })}
    ></i>
  )
}

const PlayNext = isCurrentSong => {
  const { dispatch } = useContext(StoreContext)
  var keys = media.ids
  console.log(String(keys))
  var current = Object.values(isCurrentSong)
  console.log(current)

  var index = keys.indexOf(String(current))
  console.log(String(index))
  var songId = keys[index + 1]
  console.log('next song: ' + String(songId))

  return (
    <i
      className="fa fa-step-forward"
      aria-hidden="true"
      onClick={() => dispatch({ type: 'PLAY', songId })}
    ></i>
  )
}

const CSS = css`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 80px;
  background: #282828;
  z-index: 99;
  padding: 0 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;

  .left {
    width: 30%;
    min-width: 180px;
    -webkit-box-pack: start;
    -ms-flex-pack: start;
    justify-content: flex-start;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    position: relative;
    -webkit-transform: translateX(0);
    transform: translateX(0);
    -webkit-transition: -webkit-transform 0.25s cubic-bezier(0.3, 0, 0, 1);
    transition: -webkit-transform 0.25s cubic-bezier(0.3, 0, 0, 1);
    transition: transform 0.25s cubic-bezier(0.3, 0, 0, 1);
    transition: transform 0.25s cubic-bezier(0.3, 0, 0, 1),
      -webkit-transform 0.25s cubic-bezier(0.3, 0, 0, 1);

    .artist {
      font-size: 14px;
      color: '#999999';
      margin-top: 5px;
    }
  }

  .middle {
    display: flex;
    -webkit-box-direction: normal;
    width: 40%;
    max-width: 722px;
    -webkit-box-orient: vertical;
    -ms-flex-direction: column;
    flex-direction: column;
    -webkit-box-pack: center;
    -ms-flex-pack: center;
    justify-content: center;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;

    .button-setting {
      --button-size: 32px;
      color: #b3b3b3;
      position: relative;
      width: var(--button-size);
      min-width: var(--button-size);
      height: var(--button-size);
      display: -webkit-box;
      display: -ms-flexbox;
      display: flex;
      -webkit-box-align: center;
      -ms-flex-align: center;
      align-items: center;
      -webkit-box-pack: center;
      -ms-flex-pack: center;
      justify-content: center;
      background: transparent;
      border: none;
    }

    .button-setting:hover {
      color: #ffff;
    }

    .player-controls-buttons {
      margin-bottom: 3px;
      width: 224px;
      -webkit-box-pack: justify;
      -ms-flex-pack: justify;
      justify-content: space-between;
      -webkit-box-orient: horizontal;
      -ms-flex-flow: row nowrap;
      flex-flow: row nowrap;
      display: flex;
      -webkit-box-direction: normal;
    }

    .fa-play,
    .fa-pause {
      font-size: 14px;
    }

    .play-pause-circle {
      width: 35px;
      height: 35px;
      border: 1px solid white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
    }

    .progress-container {
      width: 414px;
      height: 5px;
      position: relative;
      background-color: #4f4f4f;
      margin-top: 10px;
      display: inline-flex;
      margin: 10px 10px 0px 10px;

      .bar {
        height: 100%;
        background-color: rgb(167 167 167);
      }
    }
  }

  .right {
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-orient: horizontal;
    -webkit-box-direction: normal;
    -ms-flex-direction: row;
    flex-direction: row;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-pack: end;
    -ms-flex-pack: end;
    justify-content: flex-end;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    -webkit-box-flex: 1;
    -ms-flex-positive: 1;
    flex-grow: 1;
    .fa-volume-up,
    .fa-volume-off {
      font-size: 20px;
    }
  }
`

export default PlayBar
