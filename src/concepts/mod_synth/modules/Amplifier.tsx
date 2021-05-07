import { Card, makeStyles, Typography, useTheme } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import React, { FunctionComponent, useEffect, useRef, useState } from "react";

const useStyles = makeStyles(theme => ({
    content: {
        display: "flex",
        padding: theme.spacing(4),
        flexDirection: "column",
        margin: theme.spacing(4),
    }
}));

type AmplifierProps = {
    audioContext: AudioContext,
    getInput: () => AudioNode | undefined,
    getControl?: () => AudioNode | undefined
};

export const Amplifier: FunctionComponent<AmplifierProps> = ({ audioContext, getInput, getControl }) => {
    const theme = useTheme();
    const classes = useStyles(theme);

    let input = useRef<AudioNode>();
    let control = useRef<AudioNode>();
    let gain = useRef(audioContext.createGain());
    let [enabled, setEnabled] = useState(false);

    useEffect(() => {
        if (enabled && control.current) gain.current.connect(audioContext.destination);
        else gain.current.disconnect();
    }, [audioContext, enabled, gain])

    function connectInput() {
        if (input.current) input.current.disconnect();

        let newInput = getInput();
        if (newInput) {
            newInput.disconnect();
            newInput.connect(gain.current);
        }

        input.current = newInput;
    }

    function connectControl() {
        if (!getControl) return;

        let newControl = getControl();

        if (newControl) {
            newControl.connect(gain.current.gain);
        }

        control.current = newControl;
    }

    function toggleOutput() {
        setEnabled(!enabled);
    }

    return <Card className={classes.content}>
        <Typography variant="h5">Amplifier { enabled ? "on" : "off"}</Typography>
        <Button onClick={toggleOutput}>Toggle Output</Button>
        <Button onClick={connectInput}>Connect Input</Button>
        <Button onClick={connectControl}>Connect Control</Button>
    </Card>
};