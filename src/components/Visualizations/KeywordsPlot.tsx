import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { Box, Button, MenuItem, Select } from '@mui/material';
import keyword_embeddings from '../../signals/signal-data/word-cloud-plot/keyword_embeddings_2d.json';
import keyword_mappings from '../../signals/signal-data/word-cloud-plot/keyword_to_signals.json';
import signal_mappings from '../../signals/signal-data/word-cloud-plot/signal_to_keywords.json';
import { SignalDrawer } from '../SignalDrawer';

interface Keyword {
  word: string;
  embedding: number[];
  signal_ids: string[];
}

export const KeywordsPlot = (props: {signals: string[]}) => {
  const [currentType, setcurrentType] = useState<'sensory' | 'emotional' | 'associative'>('sensory');
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [wordData, setwordData] = useState<Keyword[]>([]);
  const [signalList, setsignalList] = useState<string[]>([]);
  const [openDrawer, setopenDrawer] = useState<boolean>(false);
  const [currentKeyword, setcurrentKeyword] = useState<string>('');
  const [size, setSize] = useState<number>(4000);

  const onClick = (keyword: Keyword) => {
    console.log(keyword);
    setsignalList(keyword.signal_ids);
    setopenDrawer(true);
    setcurrentKeyword(keyword.word);
  }

  const onCloseDrawer = () => {
    setopenDrawer(false);
  }

  // const throttleSetWords = () => {
  //   const called = false;

  //   return function (signalList: string[]) {
  //     if(!called){
  //       setTimeout(() => {

  //       }, 1000);
  //     }
  //   }
  // }

  useEffect(() => {
    const initSignals = () => {
      const currentSelection = keyword_embeddings[currentType];
      //@ts-ignore
      const wordListFromProps = signal_mappings.reduce((acc: Set<string>, signal: any)=> {
        if(signal.signal_id in props.signals){
          //@ts-ignore
          signal[currentType].forEach((word: string) => acc.add(word));
        }
        return acc;
      }, new Set<string>())
      // @ts-ignore
      const wordList: Keyword[] = Object.keys(currentSelection).filter((word) => wordListFromProps.has(word)).map((word) => ({
          word: word,
          // @ts-ignore
          embedding: currentSelection[word],
          // @ts-ignore
          signal_ids: keyword_mappings[currentType][word]
      }))
      setwordData(wordList);
    }
    initSignals();
  }, [props.signals, currentType]);

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
    const width = size;
    const height = size;
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
    .attr('font-size', d => `${14 + d.signal_ids.length * 1}px`)  // Adjust the scaling factors as needed
    .attr('fill', 'steelblue')
    .attr('opacity', 0.8)
    .style('cursor', 'pointer')
    .style('text-anchor', 'middle')
    .on('click',(e,d) => onClick(d))
    .on('mouseover', (e,d) => e.target.setAttribute('fill', 'red'))
    .on('mouseout', (e,d) => e.target.setAttribute('fill', 'steelblue'));
  }, [wordData, size]);

  return (
    <Box height={"90vh"} width={"100%"} display="flex" flexDirection={"row"} justifyContent={"space-between"} bgcolor={"white"} >
      <Box overflow={"scroll"} height={"100%"} minWidth={"150px"} width={"20%"} display="flex" flexDirection={"column"} alignItems={"center"} padding="1%" >
        <Select
        value={currentType}
        onChange={(e) => setcurrentType(e.target.value as 'sensory' | 'emotional' | 'associative')}
        sx={{width: 'fit-content'}}
        >
        <MenuItem value="sensory">Sensory</MenuItem>
        <MenuItem value="emotional">Emotional</MenuItem>
        <MenuItem value="associative">Associative</MenuItem>
        </Select>
        <Box display="flex" flexDirection={"row"}>
          <Button onClick={(()=> setSize(size + 200))}>+</Button>
          <Button onClick={(()=> setSize(size - 200))}>-</Button>
        </Box>
    </Box>
    <Box overflow={"scroll"} height={'100%'} width={"80%"} border={"1px solid black"}>
        <svg ref={svgRef}></svg>
    </Box>
    {signalList && <SignalDrawer open={openDrawer} signals={signalList} keyword={currentKeyword} onClose={onCloseDrawer} />}
    </Box>
  );
};