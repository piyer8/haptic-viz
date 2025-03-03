import React, { useEffect, useState } from 'react';
import { Signal } from '../types/SignalTypes';
import { Button, Box, Typography, Paper, Stack, TextField, MenuItem, Select } from '@mui/material';
import allSignalsData from '../signals/signal-data/signal-descriptions/all_signals.json';
import EmotionalData from './EmotionalData';
import sensoryKeywords from '../signals/signal-data/keyword-mappings/sensory_keywords.json';
import emotionalKeywords from '../signals/signal-data/keyword-mappings/emotional_keywords.json';
import associativeKeywords from '../signals/signal-data/keyword-mappings/associative_keywords.json';
import { SignalPanel } from './SignalPanel';

export default function Dashboard() {
    const [allSignals, setAllSignals] = useState<any[]>([]);
    const [filteredSignals, setFilteredSignals] = useState<any[]>([]);
    const [currentSignal, setCurrentSignal] = useState<number | undefined>(undefined);
    const [sensoryFilter, setSensoryFilter] = useState<string>("");
    const [emotionalFilter, setEmotionalFilter] = useState<string>("");
    const [associativeFilter, setAssociativeFilter] = useState<string>("");

    useEffect(() => {
        setAllSignals(allSignalsData ? allSignalsData : []);
        setFilteredSignals(allSignalsData ? allSignalsData : []);
    }, []);

    useEffect(() => {
        console.log("Loaded all signals", allSignals);
    }, [allSignals]);

    const handleFilter = () => {
        let matchingSignals = new Set<number>(allSignals.map(signal => signal.signal_id));
        
        const applyKeywordFilter = (keyword: string, keywordMapping: any) => {
            if (keyword && keywordMapping[keyword]) {
                return new Set(keywordMapping[keyword].map((id: string) => id));
            }
            return null;
        };
        
        const sensoryMatches = applyKeywordFilter(sensoryFilter, sensoryKeywords);
        const emotionalMatches = applyKeywordFilter(emotionalFilter, emotionalKeywords);
        const associativeMatches = applyKeywordFilter(associativeFilter, associativeKeywords);
        
        if (sensoryMatches) matchingSignals = new Set([...matchingSignals].filter(id => sensoryMatches.has(id)));
        if (emotionalMatches) matchingSignals = new Set([...matchingSignals].filter(id => emotionalMatches.has(id)));
        if (associativeMatches) matchingSignals = new Set([...matchingSignals].filter(id => associativeMatches.has(id)));
        const filtered = allSignals.filter(signal => matchingSignals.has(signal.signal_id));
        setFilteredSignals(filtered);
    };

    return (
        <Box display="flex" height="100vh" flexDirection="column">
            <Stack direction="row" spacing={2} padding={2}>
                <Select
                    displayEmpty
                    value={sensoryFilter}
                    onChange={(e) => setSensoryFilter(e.target.value)}
                >
                    <MenuItem value="">Select Sensory Keyword</MenuItem>
                    {Object.keys(sensoryKeywords).map((keyword) => (
                        <MenuItem key={keyword} value={keyword}>{keyword}</MenuItem>
                    ))}
                </Select>
                <Select
                    displayEmpty
                    value={emotionalFilter}
                    onChange={(e) => setEmotionalFilter(e.target.value)}
                >
                    <MenuItem value="">Select Emotional Keyword</MenuItem>
                    {Object.keys(emotionalKeywords).map((keyword) => (
                        <MenuItem key={keyword} value={keyword}>{keyword}</MenuItem>
                    ))}
                </Select>
                <Select
                    displayEmpty
                    value={associativeFilter}
                    onChange={(e) => setAssociativeFilter(e.target.value)}
                >
                    <MenuItem value="">Select Associative Keyword</MenuItem>
                    {Object.keys(associativeKeywords).map((keyword) => (
                        <MenuItem key={keyword} value={keyword}>{keyword}</MenuItem>
                    ))}
                </Select>
                <Stack direction="row" spacing={2} padding={2}>
                    
                </Stack>
                <Button variant="contained" onClick={handleFilter}>Apply Filters</Button>
            </Stack>
            <Box display="flex" flexGrow={1}>
                <SignalList signals={filteredSignals} currentSignal={currentSignal} setCurrentSignal={(id) => setCurrentSignal(id)} />
                {currentSignal && <SignalPanel signalId={currentSignal} />}
            </Box>
        </Box>
    );
}

const SignalList = (props: {signals: Signal[], currentSignal: number | undefined, setCurrentSignal: React.Dispatch<React.SetStateAction<number | undefined>>}) => {
    const [signals, setsignals] = useState<Signal[]>(props.signals);
    const [currentSignal, setcurrentSignal] = useState<number | undefined>(props.currentSignal);
    useEffect(() => {
        setsignals(props.signals);
        setcurrentSignal(props.currentSignal);
    }, [props.signals, props.currentSignal]);
    return (
        <Paper sx={{ width: '50%', height: '100vh', overflowY: 'auto', p: 2, bgcolor: 'grey.100' }}>
            <Typography variant="h6" gutterBottom>
                Signals
            </Typography>
            {signals.map((signal) => (
                <Button 
                    key={signal.signal_id} 
                    variant={currentSignal === Number.parseInt(signal.signal_id) ? "contained" : "outlined"} 
                    fullWidth 
                    sx={{ my: 0, color: {   } }} 
                    onClick={() => props.setCurrentSignal(Number.parseInt(signal.signal_id))}
                >
                    F{signal.signal_id}
                </Button>
            ))}
        </Paper>
    );
};