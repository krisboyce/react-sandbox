import { Button, makeStyles, Typography, useTheme } from "@material-ui/core";
import { Slider } from "@material-ui/core";
import Card from "@material-ui/core/Card";
import React, { FunctionComponent, useEffect, useRef, useState } from "react";

const useStyles = makeStyles(theme => ({
    content: {
        display: "flex",
        padding: theme.spacing(4),
        flexDirection: "column",
        margin: theme.spacing(4),
    }
}));

export type MixerProps = {
    audioContext: AudioContext,
    channelCount: number,
    getInput: () => AudioNode | undefined,
    getOutput: (output: AudioNode) => void
}

type GainChannel = {
    gain: GainNode,
    input?: AudioNode
};

export const Mixer: FunctionComponent<MixerProps> = ({ audioContext, channelCount, getInput, getOutput }) => {
    const theme = useTheme();
    const classes = useStyles(theme);

    const [channels, setChannels] = useState<GainChannel[]>([]);
    const masterChannel = useRef(audioContext.createGain());
    const [masterVolume, setMasterVolume] = useState(0.1);

    useEffect(() => {
        if (channels.length !== channelCount) {
            let newGains = [];
            for (let i = 0; i < channelCount; i++){
                let channel = { gain: audioContext.createGain() } as GainChannel;
                channel.gain.connect(masterChannel.current);
                newGains.push(channel);
            }
            setChannels(newGains);
        }
    }, [audioContext, channels, channelCount])

    useEffect(() => {
        masterChannel.current.gain.linearRampToValueAtTime(masterVolume, audioContext.currentTime);
    }, [audioContext, masterVolume])

    function connectInput(channel: GainChannel, input?: AudioNode) {
        if (channel.input) channel.input.disconnect();
        input?.connect(channel.gain);
        channel.input = input;
        console.log(channel);
        setChannels([...channels]);
    }

    function disconnectInput(channel: GainChannel) {
        channel.input?.disconnect();
        setChannels([...channels]);
    }

    function setVolume(gain: AudioParam, value: number) {
        gain.setValueAtTime(value, audioContext.currentTime);
        setChannels([...channels]);
    }

    return <Card className={classes.content}>
        <Typography variant="h5">Mixer</Typography>
        Master: {(masterVolume * 1000).toFixed(0)}
        <Slider min={0} max={0.1} step={0.001} value={masterVolume} onChange={(e, val) => setMasterVolume(val as number)}></Slider>
        {channels.map((x) => <div>
            <Slider min={0} max={1} step={0.01} value={x.gain.gain.value} onChange={(e, val) => setVolume(x.gain.gain, val as number)}></Slider>
            <Button onClick={() => { if (getInput) connectInput(x, getInput()) }}>Connect Input</Button>
        </div>)}
        <Button onClick={() => getOutput(masterChannel.current)}>Get Output</Button>
    </Card>
}