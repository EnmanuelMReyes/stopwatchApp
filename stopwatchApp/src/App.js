import React, { useState, useRef } from 'react';
import './App.css';

const App = () => {
    const [timer, setTimer] = useState(0)
    //for button
    const [isActive, setIscative] = useState(false)
    const [isStarted, setIsStarted] = useState(false)
    const [isStopped, setIsStopped] = useState(false)
    //for lap
    const [laptimer, setLapTimer] = useState(0)
    const [hasLap, setLap] = useState(false)
    const [LapDetails, setLapDetails] = useState([])
    const [LapIndex, setLapIndex] = useState(1)

    const increment = useRef(null)
    const lapIncrement = useRef(null)

    const handleStart = () => {
        setIscative(true);
        setIsStarted(true);
        statTimer();
    }

    const handleStop = () => {
        setIsStopped(true)
        setIsStarted(false)
        stopTimer()
    }

    const handleLap = () => {
        if (!hasLap) {
            setLap(true);
        }

        if (laptimer == 0) {
            let newLapTime = laptimer;
            newLapTime = timer;
            console.log('first lap:' + newLapTime);

            SaveNewLap(LapIndex, getLapTime(newLapTime), getOverAllTime(timer), false, false, newLapTime);
            startLapTimer();
        } else {
            SaveNewLap(LapIndex, getLapTime(laptimer), getOverAllTime(timer), false, false, laptimer);
            setLapTimer(0);
        }
    }

    function SaveNewLap(index, lapTime, overAllTime, hi, lo, time) {
        const obj = LapDetails;
        const newObj = { id: index, lapTIme: lapTime, overallTime: overAllTime, hi: false, lo: false, time: time };
        obj.push(newObj);

        obj.sort((a, b) => b.id - a.id);
        console.log(obj)

        SetHigh()

        setLapIndex((p) => p + 1)
        setLapDetails(obj);
    }

    function SetHigh() {
        const obj = LapDetails;

        if (obj.length > 2) {
            clearHiLo()

            const mx = obj.reduce((a, b) => a.time > b.time ? a : b);
            mx.hi = true;
            let indexData = obj.findIndex((x) => x.id == mx.id);
            obj[indexData] = mx;

            const min = obj.reduce((a, b) => a.time < b.time ? a : b);
            min.lo = true;
            let minIndexData = obj.findIndex((x) => x.id == min.id);
            obj[minIndexData] = min;

            setLapDetails(obj);
        }
    }

    function clearHiLo() {
        const obj = LapDetails;
        obj.forEach((x) => x.hi = false);
        obj.forEach((x) => x.lo = false);

        setLapDetails(obj)
    }

    function getLapTime(laptimer) {
        const m = `0${Math.floor(laptimer / 6000)}`.slice(-2);
        const s = `0${Math.floor(laptimer / 100)}`;
        const gfs = `0${Math.floor(s % 60)}`.slice(-2);
        const ms = `0${laptimer}`.slice(-2);

        return `${m}:${gfs}.${ms}`;
    }

    const getOverAllTime = (timer) => {
        const m = `0${Math.floor(timer / 6000)}`.slice(-2);
        const s = `0${Math.floor(timer / 100)}`;
        const gfs = `0${Math.floor(s % 60)}`.slice(-2);
        const ms = `0${timer}`.slice(-2)

        return `${m}:${gfs}.${ms}`;
    }

    const handleResume = () => {
        setIsStopped(false)
        setIsStarted(true);
        statTimer();

        if (hasLap) {
            startLapTimer();
        }
    }

    const handleReset = () => {
        setIscative(false);
        setIsStarted(false);
        setIsStopped(false);
        setLap(false)

        stopTimer()
        resetTimer()
        setLapIndex(1)
    }

    //timers control
    const statTimer = () => {
        increment.current = setInterval(() => {
            setTimer((timer) => timer + 1)
        }, 10)
    }

    const stopTimer = () => {
        clearInterval(increment.current)

        if (hasLap) {
            clearInterval(lapIncrement.current)
        }
    }

    const resetTimer = () => {
        setTimer(0)

        if (hasLap) {
            setLap(false)
            setLapTimer(0)
            setLapDetails([])
        }
    }

    const startLapTimer = () => {
        lapIncrement.current = setInterval(() => {
            setLapTimer((laptimer) => laptimer + 1)
        }, 10)
    }

    const showInFormat = () => {
        const m = `0${Math.floor(timer / 6000)}`.slice(-2);
        const s = `0${Math.floor(timer / 100)}`;
        const gfs = `0${Math.floor(s % 60)}`.slice(-2);
        const ms = `0${timer}`.slice(-2)


        return (<span id='time-container'><span>{m} : </span><span>{gfs} . </span><span>{ms}</span></span>)
    }

    const lapShowInFormat = () => {
        const m = `0${Math.floor(laptimer / 6000)}`.slice(-2);
        const s = `0${Math.floor(laptimer / 100)}`;
        const gfs = `0${Math.floor(s % 60)}`.slice(-2);
        const ms = `0${laptimer}`.slice(-2)


        return (<span id='time-container-lap'><span>{m} : </span><span>{gfs} . </span><span>{ms}</span></span>)
    }

    return (
        <div className='main'>
            <div className='timer'>{showInFormat(timer)}  </div>
            {
                hasLap ?
                    <div id='lap-content'>
                        <div className='timer-lap'>{lapShowInFormat(timer)}</div>
                        <div>
                            <table>
                                <thead>
                                    <tr>
                                        <th>Lap</th>
                                        <th>Lap times</th>
                                        <th>Overall time</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        LapDetails.map((detail) => {
                                            return (
                                                < tr key={detail.id} className={detail.hi == true ? 'hi' : detail.lo == true ? 'lo' : ''}  >
                                                    <td>{detail.id}</td>
                                                    <td>{detail.lapTIme}</td>
                                                    <td>{detail.overallTime}</td>
                                                </tr>)
                                        })
                                    }
                                </tbody>
                            </table>
                        </div>
                    </div> : <div></div>
            }
            <div className='buttons-sect'>{
                isStarted ? <div>
                    <button onClick={handleStop} name='stop-btn'>Stop</button>
                    <button onClick={handleLap} name='lap-btn'>Lap</button>
                </div> : isStopped ?
                        <div>
                            <button onClick={handleResume} name='resume-btn'>Resume</button>
                            <button onClick={handleReset} name='reset-btn'>Reset</button>
                        </div> :
                        <button onClick={handleStart} name='start-btn'>Start</button>

            }
            </div>
        </div >
    );
}

export default App;
