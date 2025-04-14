import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { Box, Button, MenuItem, Select } from '@mui/material';
import keyword_embeddings from '../../signals/signal-data/word-cloud-plot/clustered_output.json';
import keyword_mappings from '../../signals/signal-data/word-cloud-plot/keyword_to_signals.json';
import signal_mappings from '../../signals/signal-data/word-cloud-plot/signal_to_keywords.json';
import { SignalDrawer } from '../SignalDrawer';

interface Keyword {
  word: string;
  embedding: number[];
  signal_ids: string[];
  cluster_id: number;
  isCentroid: boolean
}

export const KeywordsPlot = (props: {signals: string[]}) => {
  const [currentType, setcurrentType] = useState<'sensory' | 'emotional' | 'associative'>('sensory');
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [wordData, setwordData] = useState<Keyword[]>([]);
  const [signalList, setsignalList] = useState<string[]>([]);
  const [openDrawer, setopenDrawer] = useState<boolean>(false);
  const [currentKeyword, setcurrentKeyword] = useState<string>('');
  const [size, setSize] = useState<number>(1500);

  const onClick = (keyword: Keyword) => {
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
      const wordList: Keyword[] = currentSelection.filter((word) => wordListFromProps.has(word.phrase)).map((word) => ({
          word: word.phrase,
          // @ts-ignore
          embedding: word.embedding_2d,
          // @ts-ignore
          signal_ids: keyword_mappings[currentType][word.phrase] || [],
          // @ts-ignore
          cluster_id: word.cluster,
          // @ts-ignore
          isCentroid: word.is_centroid
      }))
      setwordData(wordList);
    }
    initSignals();
  }, [props.signals, currentType]);

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
    let xdomain = [0, 0], ydomain = [0, 0];
    if(currentType === 'sensory'){
      xdomain = [-7.5, 7.5];
      ydomain = [-6, 11];
    } else if(currentType === 'emotional'){
      xdomain = [-3, 9.5];
      ydomain = [1, 11.5];
    } else {
      xdomain = [-1.5, 17.5];
      ydomain = [1, 16.5];
    }

    const xScale = d3
      .scaleLinear()
      .domain(xdomain)
      .range([margin.left, width - margin.right]);

    const yScale = d3
      .scaleLinear()
      .domain(ydomain)
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

    //const breakPoints = [2500, 1500, 500];

      const textData = size < 4000 ?
        wordData.filter(d => d.isCentroid === true  || d.signal_ids.length > 4) : wordData;
      
      const pointData =
        (size >= 1500 && size < 4000) ? wordData.filter(d => d.isCentroid === false) : [];
      
      svg.selectAll('text.word-label')
        .data(textData)
        .enter()
        .append('text')
        .attr('class', 'word-label')
        .attr('x', d => xScale(d.embedding[0]))
        .attr('y', d => yScale(d.embedding[1]))
        .text(d => d.word)
        .attr('font-size', d => `${10 +d.signal_ids.length}px`)
        .attr('fill', 'black')
        .attr('opacity', 1)
        .style('cursor', 'pointer')
        .style('text-anchor', 'middle')
        .on('click', (e, d) => onClick(d))
        .on('mouseover', (e, d) => e.target.setAttribute('fill', 'steelblue'))
        .on('mouseout', (e, d) => e.target.setAttribute('fill', 'black'));
      
      // === Render Points (only if size <= 1500 and not centroids) ===
      svg.selectAll('circle.word-dot')
        .data(pointData)
        .enter()
        .append('circle')
        .attr('class', 'word-dot')
        .attr('cx', d => xScale(d.embedding[0]))
        .attr('cy', d => yScale(d.embedding[1]))
        .attr('r', 5)
        .attr('fill', 'gray')
        .attr('opacity', 0.5)
        .style('cursor', 'pointer')
        .on('click', (e, d) => onClick(d))
        .on('mouseover', function (e, d) {
          const [x, y] = d3.pointer(e);
          d3.select(this)
            .transition()
            .attr('r', 6)
            .attr('fill', 'red');
      
          svg
            .append('text')
            .attr('id', 'tooltip')
            .attr('x', xScale(d.embedding[0]))
            .attr('y', yScale(d.embedding[1]) - 10)
            .attr('text-anchor', 'middle')
            .attr('font-size', '12px')
            .attr('fill', 'black')
            .text(d.word);
        })
        .on('mouseout', function (e, d) {
          d3.select(this)
            .transition()
            .attr('r', 4)
            .attr('fill', 'gray');
      
          svg.select('#tooltip').remove();
        });
  }, [wordData, size, currentType]);

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
          <Button variant='outlined' onClick={(()=> setSize(size + 200))}>+</Button>
          <Button variant='outlined' onClick={(()=> setSize(size - 200))}>-</Button>
        </Box>
    </Box>
    <Box overflow={"scroll"} height={'100%'} width={"80%"} border={"1px solid black"}>
        <svg ref={svgRef}></svg>
    </Box>
    {signalList && <SignalDrawer open={openDrawer} signals={signalList} keyword={currentKeyword} onClose={onCloseDrawer} />}
    </Box>
  );
};