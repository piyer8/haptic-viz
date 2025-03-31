import React, { useEffect, useState } from 'react';
import { Box, Tab, Tabs, Typography } from '@mui/material';
import allSignalsData from '../signals/signal-data/signal-descriptions/all_signals.json';
import wcData from '../signals/signal-data/word-count/separate_word_counts.json';
import sensoryKeywords from '../signals/signal-data/keyword-mappings/sensory_keywords.json';
import emotionalKeywords from '../signals/signal-data/keyword-mappings/emotional_keywords.json';
import associativeKeywords from '../signals/signal-data/keyword-mappings/associative_keywords.json';
import {WordcloudPanel} from './Visualizations/WordCloudPanel';
import { SignalGallery } from './SignalGallery';
import { ScatterPlot } from './Visualizations/ScatterPlot';
import { FilterPanel } from './FilterPanel';
import { MDSPlot } from './Visualizations/MDSPlot';
import emotionCategories from '../signals/signal-data/signal-tags/emotional/tagged-signals.json';
import associativeCategories from '../signals/signal-data/signal-tags/associative/tagged-signals.json';
import { KeywordsPlot } from './Visualizations/KeywordsPlot';

interface FilterWord {
    word: string,
    wordType: 'sensory' | 'emotional' | 'associative'
}

export default function Dashboard() {
    const [allSignals, setAllSignals] = useState<any[]>([]);
    const [filteredSignals, setFilteredSignals] = useState<any[]>([]);
    const [filteredSignalsWithSliders, setFilteredSignalsWithSliders] = useState<any[]>([]);
    const [filterList, setfilterList] = useState<Set<FilterWord>>(new Set<FilterWord>());
    const [wordCloudData, setWordCloudData] = useState<any[]>([]);
    const [view, setview] = useState<number>(0);

    useEffect(() => {
        setAllSignals(allSignalsData ? allSignalsData : []);
        setFilteredSignals(allSignalsData ? allSignalsData : []);
        setFilteredSignalsWithSliders(allSignalsData ? allSignalsData : []);
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
        console.log("Adding", word);
        setfilterList(new Set([...filterList, word]));
    }

    const deleteFromFilter = (word: FilterWord) => {
        console.log('deleting', word);
        const wordInSet = filterList.entries().find(entry => entry[1].word === word.word && entry[1].wordType === word.wordType);
        const updatedFilterList = new Set([...filterList]);
        if(wordInSet && updatedFilterList.delete(wordInSet[1]))
            setfilterList(updatedFilterList);
    };

    const applySliderFilter = (option: string, value: number[], keywordType: 'sensory' | 'emotional' | 'associative') => {
        const categoryList = keywordType === 'emotional' ? emotionCategories : associativeCategories;
        const newFilteredList = new Set();
        filteredSignals.forEach(signal => {
            const categories = categoryList.find(cat => cat.signal_index === signal.signal_id);
            if (categories) {
                const category = categories.categories.find(cat => cat.category === option);
                let percent = category ? category.percentageMatch : 0;
                if (value[0] <= percent && percent <= value[1]) {
                    newFilteredList.add(signal);
                }
            
            }
        })
        setFilteredSignals(Array.from(newFilteredList));
    }

    useEffect(() => {
        console.log('updated filterlist', filterList);
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
        <Box display="flex" flexDirection={"row"} height="100vh" width={"100%"}>
        <FilterPanel applySliderFilter={applySliderFilter} applyFilters={addToFilter} deleteFromFilter={(word) => deleteFromFilter(word)} />
        <Box display="flex" height="100vh" width={"100%"} flexDirection="column">
            <Tabs value={view} onChange={(e, newValue) => setview(newValue)} >
                <Tab label="Signal Gallery" value={0} />
                <Tab label="Scatter Plot" value={1} />
            </Tabs>
            <Box display="flex" width={'100%'} flexGrow={1} height="90vh">
                {/* <SignalList signals={filteredSignals} currentSignal={currentSignal} setCurrentSignal={(id) => setCurrentSignal(id)} /> */}
                {view === 0 ?<SignalGallery signals={filteredSignals} /> :
                <KeywordsPlot />}
                <Box display="flex" flexDirection="column"height={'100vh'} width={'20vw'}>
                    <Typography variant="h5" sx={{my: 3, mx: 2}} >Word Cloud</Typography>
                    {wordCloudData.length > 0 ? <WordcloudPanel data={wordCloudData} width={200} height={300} /> : <Box height={300} width={200} ></Box>}
                </Box>
            </Box>
        </Box>
        </Box>
    );
}