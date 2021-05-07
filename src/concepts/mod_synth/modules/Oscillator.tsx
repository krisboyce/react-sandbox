import { Button, Card, makeStyles, Slider, useTheme } from "@material-ui/core";
import React, { FunctionComponent, useEffect, useRef, useState } from "react";

const useStyles = makeStyles(theme => ({
    content: {
        display: "flex",
        padding: theme.spacing(4),
        margin: theme.spacing(4),
        flexDirection: "column"
    }
}));

export type OscillatorProps = {
    audioContext: AudioContext,
    getOutput?: (node: AudioNode) => void
};

export const OscillatorModule: FunctionComponent<OscillatorProps> = ({ audioContext, getOutput }) => {
    const theme = useTheme();
    const classes = useStyles(theme);
    
    let oscillator = useRef(audioContext.createOscillator());
    let [waveType, setWaveType] = useState<"sine" | "square" | "triangle" | "sawtooth">("sine");
    let [frequency, setFrequency] = useState(110);

    useEffect(() => {
        oscillator.current.start();
    }, [oscillator])

    useEffect(() => {
        oscillator.current.type = waveType;
    }, [oscillator, waveType]);

    useEffect(() => {
        oscillator.current.frequency.linearRampToValueAtTime(frequency, audioContext.currentTime);
    }, [audioContext, oscillator, frequency]);

    return <Card className={classes.content}>
        Oscillator: {waveType} wave at {frequency}
        <div>
            <Button onClick={() => setWaveType('sine')}>Sine</Button>
            <Button onClick={() => setWaveType('square')}>Square</Button>
            <Button onClick={() => setWaveType('triangle')}>Triangle</Button>
            <Button onClick={() => setWaveType('sawtooth')}>Saw</Button>
            <Slider min={1} max={10000} step={0.1} value={frequency} onChange={(e, val) => {
                setFrequency(val as number);
            }}></Slider>
            <Button onClick={() => { if(getOutput) getOutput(oscillator.current) }}>Get Output</Button>
        </div>
    </Card>
}