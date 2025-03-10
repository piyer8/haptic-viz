import React, { useEffect, useState } from 'react';
import { Signal } from '../types/SignalTypes';
import { Accordion, AccordionDetails, AccordionSummary, Paper, Typography } from '@mui/material';
import Grid from "@mui/material/Grid2"
export const SignalPanel = (props: {signalId: number}) => {
    const [signalid, setsignalid] = useState<string>(`F${props.signalId}`);
    const [signalData, setsignalData] = useState<Signal[]>([]);
    const [wavePlot, setWavePlot] = useState<string>('/wave-plots/F' + props.signalId + '_loop.png');
    const [sensoryData, setsensoryData] = useState<any>();
    const [emotionalData, setemotionalData] = useState<any>();
    const [associativeData, setassociativeData] = useState<any>();
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
            setsignalData(f);
            loadSensoryData(f.sensory)
            loadEmotionalData(f.emotional)
            loadAssociativeData(f.associative)
        }
        setWavePlot('/wave-plots/F' + props.signalId + '_loop.png');
    }, [props]);
    return (
        <Paper sx = {{ width: '50%', height: '100vh', overflowY: 'auto', p: 2, bgcolor: 'grey.100', display: 'flex', flexDirection: 'column' }}>
            <Typography variant = "h2">
                {signalid}
            </Typography>
            <img src = {wavePlot} alt = "wave plot" width={"100%"} />
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
                
        </Paper>
    )
}