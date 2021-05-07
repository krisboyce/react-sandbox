import { Button, Container, createStyles, makeStyles, useTheme } from "@material-ui/core";
import React, { FunctionComponent, useEffect, useState } from "react";
import { Amplifier } from "./modules/Amplifier";
import { Mixer } from "./modules/Mixer";
import { OscillatorModule } from "./modules/Oscillator";

const useStyles = makeStyles(theme => ({
    content: {
        display: "flex",
        padding: theme.spacing(4),
        flexDirection: 'column'
    }
}));

export const ModSynthConcept: FunctionComponent = () => {
    const theme = useTheme();
    const classes = useStyles(theme);

    let [audioContext, setContext] = useState<AudioContext>();
    let [oscillator, setOscillator] = useState<OscillatorNode>();
    let [oscillator2, setOscillator2] = useState<OscillatorNode>();
    let [selectedOutput, selectOutput] = useState<AudioNode>();

    useEffect(() => {
        if (audioContext) {
            if (!oscillator) {
                let osc = audioContext.createOscillator();
                osc.start();
                setOscillator(osc);
            }

            if (!oscillator2) {
                let osc = audioContext.createOscillator();
                osc.start();
                setOscillator2(osc);
            }
        }
    }, [audioContext, oscillator, oscillator2])

    function isOscillator(node: AudioNode): node is OscillatorNode{
        return 'frequency' in node;
    }

    function createContext(){
        if (!audioContext) setContext(new window.AudioContext());
    }
    const getSelected = () => selectedOutput;
    const getFrequency = () => {
        if (selectedOutput && isOscillator(selectedOutput)) {
            return selectedOutput.frequency;
        }
    }
    return audioContext ? <Container onClick={(e) => {if(e.button === 1) selectOutput(undefined)}} className={classes.content}>
        <Amplifier audioContext={audioContext} getInput={getSelected} getControl={getSelected}/>
        <Mixer audioContext={audioContext} channelCount={2} getInput={getSelected} getOutput={selectOutput}></Mixer>
        <OscillatorModule audioContext={audioContext} getOutput={selectOutput} />
        <OscillatorModule audioContext={audioContext} getOutput={selectOutput} />
        <OscillatorModule audioContext={audioContext} getOutput={selectOutput} />
    </Container> : <Button onClick={createContext}>Start Audio</Button>
};