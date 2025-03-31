import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { Box, MenuItem, Modal, Select } from '@mui/material';
import keyword_embeddings from '../../signals/signal-data/word-cloud-plot/keyword_embeddings_2d.json';
import keyword_mappings from '../../signals/signal-data/word-cloud-plot/keyword_to_signals.json';
import ts from 'typescript';
import { SignalDrawer } from '../SignalDrawer';

interface Keyword {
  word: string;
  embedding: number[];
  signal_ids: string[];
}

export const KeywordsPlot = () => {
  const [currentType, setcurrentType] = useState<'sensory' | 'emotional' | 'associative'>('sensory');
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [wordData, setwordData] = useState<Keyword[]>([]);
  const [signalList, setsignalList] = useState<string[]>([]);
  const [openDrawer, setopenDrawer] = useState<boolean>(false);
  const [currentKeyword, setcurrentKeyword] = useState<string>('');

  const onClick = (keyword: Keyword) => {
    console.log(keyword);
    setsignalList(keyword.signal_ids);
    setopenDrawer(true);
    setcurrentKeyword(keyword.word);
  }

  const onCloseDrawer = () => {
    setopenDrawer(false);
  }

  useEffect(() => {
    const currentSelection = keyword_embeddings[currentType];
    // @ts-ignore
    const wordList: Keyword[] = Object.keys(currentSelection).map((word) => ({
        word: word,
        // @ts-ignore
        embedding: currentSelection[word],
        // @ts-ignore
        signal_ids: keyword_mappings[currentType][word]
    }))
    setwordData(wordList);
  }, [currentType]);

  useEffect(() => {
    const width = 4000;
    const height = 4000;
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

    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);

    svg.append('g')
      .attr('class', 'x-axis')
      .attr('transform', `translate(0, ${height / 2})`)
      .call(xAxis);

    svg.append('g')
      .attr('class', 'y-axis')
      .attr('transform', `translate(${width / 2}, 0)`)
      .call(yAxis);

    // Scatter plot points for sensory MDS (can be changed to emotional/metaphor)
    svg.selectAll('text')
    .data(wordData)
    .enter()
    .append('text')
    .attr('x', d => xScale(d.embedding[0]))
    .attr('y', d => yScale(d.embedding[1]))
    .text(d => d.word)
    .attr('font-size', d => `${10 + d.signal_ids.length * 2}px`)  // Adjust the scaling factors as needed
    .attr('fill', 'steelblue')
    .attr('opacity', 0.8)
    .style('cursor', 'pointer')
    .style('text-anchor', 'middle')
    .on('click',(e,d) => onClick(d));  // C
  }, [wordData]);

  return (
    <Box overflow={"scroll"} height={"100%"} width={"100%"} display="flex" flexDirection={"column"}>
        <Select
        value={currentType}
        onChange={(e) => setcurrentType(e.target.value as 'sensory' | 'emotional' | 'associative')}
        >
        <MenuItem value="sensory">Sensory</MenuItem>
        <MenuItem value="emotional">Emotional</MenuItem>
        <MenuItem value="associative">Associative</MenuItem>
        </Select>
    <Box overflow={"scroll"} height={"100%"} width={"100%"}>
        <svg ref={svgRef}></svg>
    </Box>
    {signalList && <SignalDrawer open={openDrawer} signals={signalList} keyword={currentKeyword} onClose={onCloseDrawer} />}
    </Box>
  );
};