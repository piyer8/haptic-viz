import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { Box, MenuItem, Select } from '@mui/material';
import keyword_embeddings from '../../signals/signal-data/word-cloud-plot/keyword_embeddings_2d.json';
import keyword_mappings from '../../signals/signal-data/word-cloud-plot/keyword_to_signals.json';

interface Keyword {
  word: string;
  embedding: number[];
  signal_ids: string[];
}

interface KeywordsProps {
    sensory_keywords: string[];
    emotional_keywords: string[];
    associative_keywords: string[];
}

export const IndividualKeywordPlot = (props: KeywordsProps) => {
  const [currentType, setcurrentType] = useState<'sensory' | 'emotional' | 'associative'>('sensory');
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [wordData, setwordData] = useState<Keyword[]>([]);

  useEffect(() => {
    const currentSelection = keyword_embeddings[currentType];
    let wordListFromProps = currentType === 'sensory' ? props.sensory_keywords : currentType === 'emotional' ? props.emotional_keywords : props.associative_keywords;
    // @ts-ignore
    const wordList: Keyword[] = Object.keys(currentSelection).filter((word) => wordListFromProps.includes(word)).map((word) => ({
        word: word,
        // @ts-ignore
        embedding: currentSelection[word],
        // @ts-ignore
        signal_ids: keyword_mappings[currentType][word]
    }))
    console.log(wordList);
    setwordData(wordList);
  }, [currentType, props]);

  useEffect(() => {
    const width = 500;
    const height = 500;
    const margin = { top: 20, right: 80, bottom: 20, left: 80 };

    const svg = d3
      .select(svgRef.current)
      .attr('width', width)
      .attr('height', height)
      .style('overflow', 'visible');

    svg.selectAll('*').remove(); // Clear previous render

    const xScale = d3
      .scaleLinear()
      .domain([-1.1, 1.1])
      .range([margin.left, width - margin.right]);

    const yScale = d3
      .scaleLinear()
      .domain([-1.1, 1.1])
      .range([height - margin.bottom, margin.top]);


    svg.selectAll('text')
    .data(wordData)
    .enter()
    .append('text')
    .attr('x', d => xScale(d.embedding[0]))
    .attr('y', d => yScale(d.embedding[1]))
    .text(d => d.word)
    .attr('font-size', d => `18px`)  // Adjust the scaling factors as needed
    .attr('fill', 'steelblue')
    .attr('opacity', 0.8)
    .style('cursor', 'pointer')
    .style('text-anchor', 'middle')
  }, [wordData]);

  return (
    <Box overflow={"scroll"} height={"100%"} width={"100%"} minWidth={"500px"} padding="1%" display="flex" flexDirection={"column"}>
        <Select
        value={currentType}
        onChange={(e) => setcurrentType(e.target.value as 'sensory' | 'emotional' | 'associative')}
        sx={{width: '200px'}}
        >
        <MenuItem value="sensory">Sensory</MenuItem>
        <MenuItem value="emotional">Emotional</MenuItem>
        <MenuItem value="associative">Associative</MenuItem>
        </Select>
    <Box overflow={"scroll"} height={"100%"} width={"fit-content"} minWidth={"500px"} border="1px solid black" borderRadius={2} marginY={"1%"}>
        <svg ref={svgRef}></svg>
    </Box>
    </Box>
  );
};