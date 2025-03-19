import React, { useEffect, useState } from 'react';
import { Button, Box,Stack, MenuItem, Select, Tab, Tabs } from '@mui/material';
import allSignalsData from '../signals/signal-data/signal-descriptions/all_signals.json';
import wcData from '../signals/signal-data/word-count/separate_word_counts.json';
import sensoryKeywords from '../signals/signal-data/keyword-mappings/sensory_keywords.json';
import emotionalKeywords from '../signals/signal-data/keyword-mappings/emotional_keywords.json';
import associativeKeywords from '../signals/signal-data/keyword-mappings/associative_keywords.json';
import {WordcloudPanel} from './Visualizations/WordCloudPanel';
import { SignalGallery } from './SignalGallery';
import { ChipList } from './ChipList';
import { ScatterPlot } from './Visualizations/ScatterPlot';

interface FilterWord {
    word: string,
    wordType: 'sensory' | 'emotional' | 'associative'
}

export default function Dashboard() {
    const [allSignals, setAllSignals] = useState<any[]>([]);
    const [filteredSignals, setFilteredSignals] = useState<any[]>([]);
    const [filterList, setfilterList] = useState<Set<FilterWord>>(new Set<FilterWord>());
    const [sensoryFilter, setSensoryFilter] = useState<string>("");
    const [emotionalFilter, setEmotionalFilter] = useState<string>("");
    const [associativeFilter, setAssociativeFilter] = useState<string>("");
    const [wordCloudData, setWordCloudData] = useState<any[]>([]);
    const [view, setview] = useState<number>(0);

    useEffect(() => {
        setAllSignals(allSignalsData ? allSignalsData : []);
        setFilteredSignals(allSignalsData ? allSignalsData : []);
    }, []);

    useEffect(() => {
        console.log("Loaded all signals", allSignals);
    }, [allSignals]);

    const getSignalListFromKeyword = (keyword: string, keywordMapping: any) => {
        if (keyword && keywordMapping[keyword]) {
            return new Set(keywordMapping[keyword].map((id: string) => id));
        }
        return new Set([]);
    };

    const addToFilter = (word: FilterWord) => {
        setfilterList(new Set([...filterList, word]));
    }

    const deleteFromFilter = (word: FilterWord) => {
        const updatedFilterList = new Set(filterList);
        updatedFilterList.delete(word);
        setfilterList(updatedFilterList);
    };

    useEffect(() => {
        let signalList = new Set(allSignals.map(signal => signal.signal_id));
    
        filterList.forEach((keyword) => {
            let keywordSignalList = new Set();
            if (keyword.wordType === 'sensory') {
                keywordSignalList = getSignalListFromKeyword(keyword.word, sensoryKeywords);
            } else if (keyword.wordType === 'emotional') {
                keywordSignalList = getSignalListFromKeyword(keyword.word, emotionalKeywords);
            } else if (keyword.wordType === 'associative') {
                keywordSignalList = getSignalListFromKeyword(keyword.word, associativeKeywords);
            }
            signalList = new Set([...signalList].filter(id => keywordSignalList.has(id)));
        });
    
        setFilteredSignals(allSignals.filter(signal => signalList.has(signal.signal_id)));
    }, [filterList, allSignals]); 

    useEffect(() => {
        aggregateWordCounts(filteredSignals);
    }, [filteredSignals]);

    // const handleFilter = (word: string) => {
    //     let matchingSignals = new Set<number>(allSignals.map(signal => signal.signal_id));
        
    //     const applyKeywordFilter = (keyword: string, keywordMapping: any) => {
    //         if (keyword && keywordMapping[keyword]) {
    //             return new Set(keywordMapping[keyword].map((id: string) => id));
    //         }
    //         return null;
    //     };
        
    //     // const sensoryMatches = applyKeywordFilter(sensoryFilter, sensoryKeywords);
    //     // const emotionalMatches = applyKeywordFilter(emotionalFilter, emotionalKeywords);
    //     // const associativeMatches = applyKeywordFilter(associativeFilter, associativeKeywords);
        
    //     // if (sensoryMatches) matchingSignals = new Set([...matchingSignals].filter(id => sensoryMatches.has(id)));
    //     // if (emotionalMatches) matchingSignals = new Set([...matchingSignals].filter(id => emotionalMatches.has(id)));
    //     // if (associativeMatches) matchingSignals = new Set([...matchingSignals].filter(id => associativeMatches.has(id)));
    //     if(filterList.length > 0) {
    //         let matches = applyKeywordFilter(word, )
    //     }
    //     const filtered = allSignals.filter(signal => matchingSignals.has(signal.signal_id));
    //     setFilteredSignals(filtered);
    // };

    const areThereNoFilters = () => filterList.size === 0;
    const aggregateWordCounts = (filteredSignals: any[]) => {
        if(areThereNoFilters()) {
            setWordCloudData([]);
            return;
        }
        const wordCountMap: { [key: string]: number } = {};
        const signalIds = new Set(filteredSignals.map(signal => signal.signal_id.toString()));
        
        wcData.forEach(entry => {
            if (signalIds.has(entry.signal_index)) {
                [...entry.sensory_word_count, ...entry.emotional_word_count, ...entry.associative_word_count].forEach(wordEntry => {
                    wordCountMap[wordEntry.text] = (wordCountMap[wordEntry.text] || 0) + wordEntry.value;
                });
            }
        });
        
        const wordCloudArray = Object.keys(wordCountMap).map(word => ({ text: word, value: wordCountMap[word] }));
        setWordCloudData(wordCloudArray);
    };

    return (
        <Box display="flex" height="100vh" width={"100%"} flexDirection="column">
            <Stack direction="row" spacing={2} padding={2} height="10vh">
                <Select
                    displayEmpty
                    value={sensoryFilter}
                    onChange={(e) => addToFilter({word: e.target.value, wordType: 'sensory'})}
                >
                    <MenuItem value="">Select Sensory Keyword</MenuItem>
                    {Object.keys(sensoryKeywords).map((keyword) => (
                        <MenuItem key={keyword} value={keyword}>{keyword}</MenuItem>
                    ))}
                </Select>
                <Select
                    displayEmpty
                    value={emotionalFilter}
                    onChange={(e) => addToFilter({word: e.target.value, wordType: 'emotional'})}
                >
                    <MenuItem value="">Select Emotional Keyword</MenuItem>
                    {Object.keys(emotionalKeywords).map((keyword) => (
                        <MenuItem key={keyword} value={keyword}>{keyword}</MenuItem>
                    ))}
                </Select>
                <Select
                    displayEmpty
                    value={associativeFilter}
                    onChange={(e) => addToFilter({word: e.target.value, wordType: 'associative'})}
                >
                    <MenuItem value="">Select Associative Keyword</MenuItem>
                    {Object.keys(associativeKeywords).map((keyword) => (
                        <MenuItem key={keyword} value={keyword}>{keyword}</MenuItem>
                    ))}
                </Select>
                {/* <Button variant="contained" onClick={handleFilter}>Apply Filters</Button> */}
            </Stack>
            <ChipList chipList={filterList} deleteWord={(word) => deleteFromFilter(word)} />
            <Tabs value={view} onChange={(e, newValue) => setview(newValue)} >
                <Tab label="Signal Gallery" value={0} />
                <Tab label="Scatter Plot" value={1} />
            </Tabs>
            <Box display="flex" width={'100%'} flexGrow={1} height="90vh">
                {/* <SignalList signals={filteredSignals} currentSignal={currentSignal} setCurrentSignal={(id) => setCurrentSignal(id)} /> */}
                {view === 0 ?<SignalGallery signals={filteredSignals} /> :
                <ScatterPlot signals={filteredSignals} />}
                <Box display="flex" flexDirection="column"height={'100vh'}>
                    {wordCloudData.length > 0 && <WordcloudPanel data={wordCloudData} width={300} height={300} />}
                </Box>
            </Box>
        </Box>
    );
}

// const SignalList = (props: {signals: Signal[], currentSignal: number | undefined, setCurrentSignal: React.Dispatch<React.SetStateAction<number | undefined>>}) => {
//     const [signals, setsignals] = useState<Signal[]>(props.signals);
//     const [currentSignal, setcurrentSignal] = useState<number | undefined>(props.currentSignal);
//     useEffect(() => {
//         setsignals(props.signals);
//         setcurrentSignal(props.currentSignal);
//     }, [props.signals, props.currentSignal]);
//     return (
//         <Paper sx={{ width: '50%', height: '100vh', overflowY: 'auto', p: 2, bgcolor: 'grey.100' }}>
//             <Typography variant="h6" gutterBottom>
//                 Signals
//             </Typography>
//             {signals.map((signal) => (
//                 <Button 
//                     key={signal.signal_id} 
//                     variant={currentSignal === Number.parseInt(signal.signal_id) ? "contained" : "outlined"} 
//                     fullWidth 
//                     sx={{ my: 0, color: {   } }} 
//                     onClick={() => props.setCurrentSignal(Number.parseInt(signal.signal_id))}
//                 >
//                     F{signal.signal_id}
//                 </Button>
//             ))}
//         </Paper>
//     );
// };