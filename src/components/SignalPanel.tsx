import React, { useEffect, useMemo, useState } from 'react';
import { Box, Paper, Typography } from '@mui/material';
import { SignalTags } from './Visualizations/SignalTags';
import RawData from './RawData';
import signalData from '../signals/signal-data/signal-descriptions/all_signals_edited.json';
import { IndividualKeywordPlot } from './Visualizations/IndividualKeywordPlot';
import { PlutchikChart } from './Visualizations/PlutchikChart';
import emotionCategories from '../signals/signal-data/signal-tags/emotional/tagged-signals.json';

import { send_ws_pcm_signal } from '../Websocket/websocket';
import { load_and_send_pcm } from '../Websocket/load_and_send_pcm';

interface EmotionValues{
    joy: number;
    trust: number;
    fear: number;
    surprise: number;
    sadness: number;
    disgust: number;
    anger: number;
    anticipation: number;
}

export const SignalPanel = (props: {signalId: number}) => {
    const [signalid, setsignalid] = useState<string>(`F${props.signalId}`);
    const [worryScore, setworryScore] = useState<number>(0);
    const [wavePlot, setWavePlot] = useState<string>('/wave-plots/F' + props.signalId + '_loop.png');
    const [sensoryData, setsensoryData] = useState<any>();
    const [emotionalData, setemotionalData] = useState<any>();
    const [associativeData, setassociativeData] = useState<any>();
    const [sensoryKeywords, setsensoryKeywords] = useState<string[]>([]);
    const [emotionalKeywords, setemotionalKeywords] = useState<string[]>([]);
    const [associativeKeywords, setassociativeKeywords] = useState<string[]>([]);
    const [emotionValues, setemotionValues] = useState<Record<string, number>>();
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
        (async () => {
          const url = `/Signals_all/${signalid}_loop.wav`;
          const response = await fetch(url);
      
          if (!response.ok) {
            console.error(`Failed to fetch ${url}: ${response.statusText}`);
            return;
          }
      
          const blob = await response.blob();
          const file = new File([blob], `${signalid}_loop.wav`, { type: blob.type });
      
          try {
            await load_and_send_pcm(file);
          } catch (err) {
            console.error(`Failed to load PCM from ${file.name}:`, err);
          }
        })();
      }, [signalid]);

    useEffect(() => {
        let signal =signalData.find((signal: any) => signal.signal_id === `${props.signalId}`);
        if(signal){
            setsensoryKeywords(signal.sensory.keywords[0].split(',').map((word) => word.trim().toLowerCase()));
            setemotionalKeywords(signal.emotional.keywords[0].split(',').map((word) => word.trim().toLowerCase()))
            setassociativeKeywords(signal.associative.keywords[0].split(',').map((word) => word.trim().toLowerCase()));
        }
    }, [props.signalId]);

    const getEmotionValues = useMemo(() => {
        const signalData = emotionCategories.find((signal: any) => signal.signal_index === `${props.signalId}`);
        const res: EmotionValues = {
            joy: 0,
            trust: 0,
            fear: 0,
            surprise: 0,
            sadness: 0,
            disgust: 0,
            anger: 0,
            anticipation: 0
        }
        if(signalData){
            signalData.categories.forEach((cat: { category: string; percentageMatch: number; keywords: string[]; isMatch: boolean; }) => {
                    // @ts-ignore
                    res[cat.category.toLowerCase()] = cat.percentageMatch/100;
            })
        }
        return res;
    }, [props.signalId])

    useEffect(() => {
        setsignalid(`F${props.signalId}`);
        let f = require('../signals/signal-data/signal-descriptions/F' + props.signalId + '.json');
        if(f){
            loadSensoryData(f.sensory)
            loadEmotionalData(f.emotional)
            loadAssociativeData(f.associative)
        }
        setWavePlot('/wave-plots/F' + props.signalId + '_loop.png');
    }, [props]);
    return (
        <Box sx = {{ width: '70%', padding: '5%', height: '100vh', overflowY: 'auto', p: 2, bgcolor: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
            <Typography variant = "h4">
                {signalid}
            </Typography>
            <img src = {wavePlot} alt = "wave plot" width={"100%"} />
            <SignalTags signalIndex={props.signalId.toString()} />
            <Box display="flex" width="100%" flexDirection={"row"} alignContent={"start"} justifyContent={"space-between"} flexWrap={"wrap"} gap={1}>
                <Box width={"auto"} display="flex" flexDirection={"column"} height="auto" margin="2%">
                    <Typography variant="h6">Keyword plot</Typography>
                    <IndividualKeywordPlot sensory_keywords={sensoryKeywords} emotional_keywords={emotionalKeywords} associative_keywords={associativeKeywords} />
                </Box>
                <Box width={"auto"} height="auto" padding="1%" display="flex" flexDirection={"column"}>
                    <Typography variant="h6">Emotion plot</Typography>
                    <PlutchikChart width={400} height={400} emotions={getEmotionValues} />
                </Box>
            </Box>
            <RawData sensoryData={sensoryData} emotionalData={emotionalData} associativeData={associativeData} styles={{marginY: 2}} />
        </Box>
    )
}
