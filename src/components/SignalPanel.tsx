import React, { useEffect, useState } from 'react';
import { Accordion, AccordionDetails, AccordionSummary, Box, Paper, Stack, Typography } from '@mui/material';
import D3Slider from './Visualizations/D3Slider';
import smoothnessScores from '../signals/signal-data/sensory/smoothness_ratings.json'
import { SignalTags } from './Visualizations/SignalTags';

interface WorryScore {
    signal_index: string;
    worry_score: number;
}

interface Smoothness {
    signal_id: string;
    smoothness: number;
    smoothness_keywords: string[];
    roughness_keywords: string[];
}

export const SignalPanel = (props: {signalId: number}) => {
    const [signalid, setsignalid] = useState<string>(`F${props.signalId}`);
    const [worryScore, setworryScore] = useState<number>(0);
    const [wavePlot, setWavePlot] = useState<string>('/wave-plots/F' + props.signalId + '_loop.png');
    const [sensoryData, setsensoryData] = useState<any>();
    const [emotionalData, setemotionalData] = useState<any>();
    const [associativeData, setassociativeData] = useState<any>();
    const [smoothness, setsmoothness] = useState<number>(0);
    const loadSensoryData = (sensoryData: any) => {
        setsensoryData(sensoryData);
    }
    const loadEmotionalData = (emotionalData: any) => {
        setemotionalData(emotionalData);
    }
    const loadAssociativeData = (associativeData: any) => {
        setassociativeData(associativeData);
    }
    useEffect(() => {
        setsignalid(`F${props.signalId}`);
        let f = require('../signals/signal-data/signal-descriptions/F' + props.signalId + '.json');
        if(f){
            loadSensoryData(f.sensory)
            loadEmotionalData(f.emotional)
            loadAssociativeData(f.associative)
        }
        setWavePlot('/wave-plots/F' + props.signalId + '_loop.png');
        let f2 = require('../signals/signal-data/emotions/worry-scores/worry_scores.json');
        if(f2)
            setworryScore(f2.find((word: WorryScore) => word.signal_index === props.signalId.toString()).worry_score);
        if(smoothnessScores){
            let score = smoothnessScores.find((word: Smoothness) => `F${props.signalId}` === word.signal_id)
            if(score)
                setsmoothness(score.smoothness)
        }
    }, [props]);
    return (
        <Paper sx = {{ width: '50%', height: '100vh', overflowY: 'auto', p: 2, bgcolor: 'grey.100', display: 'flex', flexDirection: 'column' }}>
            <Typography variant = "h2">
                {signalid}
            </Typography>
            <img src = {wavePlot} alt = "wave plot" width={"100%"} />
            <SignalTags signalIndex={props.signalId.toString()} />
            <Accordion>
                <AccordionSummary>
                    <Typography variant = "h6">Sensory descriptions</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography variant = "body1" >
                        Keywords
                    </Typography>
                    <Typography variant = "body2" >
                        {sensoryData?.keywords?.map((keyword: string) => {
                            return (
                                keyword + " "
                            )
                        })}
                    </Typography>
                    <Typography variant = "body1" >
                        Descriptions
                    </Typography>
                    {sensoryData?.descriptions?.map((description: string) => <Typography key={description} variant = "body2" >{description}</Typography>)}
                </AccordionDetails>
            </Accordion>
            <Accordion>
                <AccordionSummary>
                    <Typography variant = "h6">Emotional descriptions</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography variant = "body1" >
                        Keywords
                    </Typography>
                    <Typography variant = "body2" >
                        {emotionalData?.keywords?.map((keyword: string) => {
                            return (
                                keyword + " "
                            )
                        })}    
                    </Typography>
                    <Typography variant = "body1" >
                        Descriptions
                    </Typography>
                    {emotionalData?.descriptions?.map((description: string) => <Typography key={description} variant = "body2" >{description}</Typography>)}
                </AccordionDetails>
            </Accordion>
            <Accordion>
                <AccordionSummary>
                    <Typography variant = "h6">Associative descriptions</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography variant = "body1" >
                        Keywords
                    </Typography>
                    <Typography variant = "body2" >
                        {associativeData?.keywords?.map((keyword: string) => {
                            return (
                                keyword + " "
                            )
                        })}
                    </Typography>
                    <Typography variant = "body1" >
                        Descriptions
                    </Typography>
                    {associativeData?.descriptions?.map((description: string) => <Typography key={description} variant = "body2" >{description}</Typography>)}
                </AccordionDetails>
            </Accordion>
            <Box display="flex" flexDirection={"row"} flexWrap={"wrap"}>
                <D3Slider value={worryScore} title={"Worry score"} />
                <Stack alignItems={"center"}>
                        <Typography variant = "h6">Smoothness</Typography>
                        <Typography variant = "h6" >{smoothness}</Typography>
                </Stack>
            </Box>
        </Paper>
    )
}