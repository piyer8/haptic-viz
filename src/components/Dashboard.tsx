import React, { useEffect, useState } from 'react';
import { Box, Tab, Tabs, Typography } from '@mui/material';
import allSignalsData from '../signals/signal-data/signal-descriptions/all_signals.json';
import wcData from '../signals/signal-data/word-count/separate_word_counts.json';
import sensoryKeywords from '../signals/signal-data/keyword-mappings/sensory_keywords.json';
import emotionalKeywords from '../signals/signal-data/keyword-mappings/emotional_keywords.json';
import associativeKeywords from '../signals/signal-data/keyword-mappings/associative_keywords.json';
import { WordcloudPanel } from './Visualizations/WordCloudPanel';
import { SignalGallery } from './SignalGallery';
import { FilterPanel } from './FilterPanel';
import emotionCategories from '../signals/signal-data/signal-tags/emotional/tagged-signals.json';
import associativeCategories from '../signals/signal-data/signal-tags/associative/tagged-signals.json';
import { KeywordsPlot } from './Visualizations/KeywordsPlot';

interface FilterWord {
  word: string;
  wordType: 'sensory' | 'emotional' | 'associative';
}

type SliderFilter = {
  keywordType: 'emotional' | 'associative';
  category: string;
  range: number[];
};

export default function Dashboard() {
  const [allSignals, setAllSignals] = useState<any[]>([]);
  const [filteredSignals, setFilteredSignals] = useState<any[]>([]);
  const [filterList, setFilterList] = useState<Set<FilterWord>>(new Set<FilterWord>());
  const [emotionalFilters, setEmotionalFilters] = useState<any>(() => {
          const vals: any = {};
          Object.keys(emotionalKeywords).forEach((option) => {
            vals[option] = [0, 100];
          });
          return vals;
        });
   const [associativeFilters, setAssociativeFilters] = useState<any>(() => {
          const vals: any = {};
          Object.keys(associativeKeywords).forEach((option) => {
            vals[option] = [0, 100];
          });
          return vals;
   })
  const [sliderFilters, setSliderFilters] = useState<SliderFilter[]>([]);
  const [wordCloudData, setWordCloudData] = useState<any[]>([]);
  const [view, setView] = useState<number>(0);

  // Load initial signals.
  useEffect(() => {
    setAllSignals(allSignalsData ? allSignalsData : []);
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

  // Add a word filter.
  const addToFilter = (word: FilterWord) => {
    console.log("Adding", word);
    setFilterList(new Set([...filterList, word]));
  };

  // Remove a word filter.
  const deleteFromFilter = (word: FilterWord) => {
    console.log('Deleting', word);
    const updatedFilterList = new Set([...filterList]);
    updatedFilterList.forEach(item => {
      if (item.word === word.word && item.wordType === word.wordType) {
        updatedFilterList.delete(item);
      }
    });
    setFilterList(updatedFilterList);
  };

  const applySliderFilter = (
    category: string,
    range: number[],
    keywordType: 'emotional' | 'associative'
  ) => {
    if(keywordType === 'emotional') {
        const newEmotionalFilters = {...emotionalFilters, [category]: range};
        setEmotionalFilters(newEmotionalFilters);
    } else if(keywordType === 'associative') {
        const newAssociativeFilters = {...associativeFilters, [category]: range};
        setAssociativeFilters(newAssociativeFilters);
    }

    setSliderFilters(prev => {
      const others = prev.filter(
        f => f.category !== category || f.keywordType !== keywordType
      );
      return [...others, { keywordType, category, range }];
    });
  };

  // Combined filtering effect: first apply word filters, then reapply all slider filters.
  useEffect(() => {
    console.log('Updating filters', { filterList, sliderFilters });
    // Step 1: Apply keyword filters.
    let signalIdSet = new Set(allSignals.map(signal => signal.signal_id));
    filterList.forEach(keyword => {
      let keywordSignalList = new Set();
      const mapping = {
        sensory: sensoryKeywords,
        emotional: emotionalKeywords,
        associative: associativeKeywords
      }[keyword.wordType];
      if (mapping) {
        keywordSignalList = getSignalListFromKeyword(keyword.word, mapping);
      }
      signalIdSet = new Set([...signalIdSet].filter(id => keywordSignalList.has(id)));
    });

    let intermediateSignals = allSignals.filter(signal =>
      signalIdSet.has(signal.signal_id)
    );

    // Step 2: Apply all active slider filters.
    sliderFilters.forEach(slider => {
      const categoryList =
        slider.keywordType === 'emotional' ? emotionCategories : associativeCategories;
      intermediateSignals = intermediateSignals.filter(signal => {
        const catData = categoryList.find(cat => cat.signal_index === signal.signal_id);
        if (!catData) return false;
        const match = catData.categories.find(c => c.category === slider.category);
        const percent = match ? match.percentageMatch : 0;
        return slider.range[0] <= percent && percent <= slider.range[1];
      });
    });

    setFilteredSignals(intermediateSignals);
  }, [filterList, sliderFilters, allSignals]);

  // Recompute the word cloud data whenever filteredSignals updates.
  useEffect(() => {
    aggregateWordCounts(filteredSignals);
  }, [filteredSignals]);

  // Now checks both keyword and slider filters.
  const areThereNoFilters = () => filterList.size === 0 && sliderFilters.length === 0;

  const aggregateWordCounts = (signals: any[]) => {
    // If no filters are active, don't display the word cloud.
    if (areThereNoFilters()) {
      setWordCloudData([]);
      return;
    }
    const wordCountMap: { [key: string]: number } = {};
    const signalIds = new Set(signals.map(signal => signal.signal_id.toString()));

    wcData.forEach(entry => {
      if (signalIds.has(entry.signal_index)) {
        [...entry.sensory_word_count, ...entry.emotional_word_count, ...entry.associative_word_count].forEach(
          wordEntry => {
            wordCountMap[wordEntry.text] = (wordCountMap[wordEntry.text] || 0) + wordEntry.value;
          }
        );
      }
    });

    const wordCloudArray = Object.keys(wordCountMap).map(word => ({
      text: word,
      value: wordCountMap[word]
    }));
    setWordCloudData(wordCloudArray);
  };

  return (
    <Box display="flex" flexDirection="row" height="100vh" width="100%">
      <FilterPanel
        applySliderFilter={applySliderFilter}
        applyFilters={addToFilter}
        deleteFromFilter={word => deleteFromFilter(word)}
        emotionalFilters={emotionalFilters}
        associativeFilters={associativeFilters}
      />
      <Box display="flex" height="100vh" width="100%" flexDirection="column">
        <Tabs value={view} onChange={(e, newValue) => setView(newValue)}>
          <Tab label="Signal Gallery" value={0} />
          <Tab label="Scatter Plot" value={1} />
        </Tabs>
        <Box display="flex" width="100%" flexGrow={1} height="90vh">
          {view === 0 ? (
            <SignalGallery signals={filteredSignals} />
          ) : (
            <KeywordsPlot />
          )}
          <Box display="flex" flexDirection="column" height="100vh" width="20vw">
            <Typography variant="h5" sx={{ my: 3, mx: 2 }}>
              Word Cloud
            </Typography>
            {wordCloudData.length > 0 && view === 0 ? (
              <WordcloudPanel data={wordCloudData} width={200} height={300} />
            ) : (
              <Box height={300} width={200}></Box>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}