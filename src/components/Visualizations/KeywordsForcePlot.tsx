import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { Box, Button, MenuItem, Select } from '@mui/material';
import keyword_embeddings from '../../signals/signal-data/word-cloud-plot/clustered_output.json';
import keyword_mappings from '../../signals/signal-data/word-cloud-plot/keyword_to_signals.json';
import signal_mappings from '../../signals/signal-data/word-cloud-plot/signal_to_keywords.json';
import sensory_clusters from '../../signals/signal-data/keyword_clusters/links_sensory.json';
import emotional_clusters from '../../signals/signal-data/keyword_clusters/links_emotional.json';
import associative_clusters from '../../signals/signal-data/keyword_clusters/links_associative.json';
import { SignalDrawer } from '../SignalDrawer';

interface Keyword {
  word: string;
  embedding: number[];
  signal_ids: string[];
  cluster_id: number;
  isCentroid: boolean
}

export const KeywordsForcePlot = (props: {signals: string[]}) => {
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
        if(wordData.length === 0) return;
        const width = size;
        const height = size;
        const color = d3.scaleOrdinal(d3.schemeCategory10);

        const unFilteredLink = currentType === 'sensory' ? sensory_clusters : currentType === 'emotional' ? emotional_clusters : associative_clusters;
        const nodes = wordData.map((d) => ({
            id: d.word,
            x: d.embedding[0],
            y: d.embedding[1],
            signal_ids: d.signal_ids,
            group: d.cluster_id,
            isCentroid: d.isCentroid
        }))

        const nodeIds = new Set(nodes.map((node) => node.id));

        const links = unFilteredLink.filter(
        (link) => nodeIds.has(link.source) && nodeIds.has(link.target)
        );
        
        //@ts-ignore
        const simulation = d3.forceSimulation(nodes)
            //@ts-ignore
            .force("link", d3.forceLink(links).id(d => d.id))
            .force("charge", d3.forceManyBody())
            .force("center", d3.forceCenter(width / 2, height / 2))
            .on("tick", ticked);

        const svg = d3.select(svgRef.current)
                    .attr("width", width)
                    .attr("height", height)
                    .attr("viewBox", [0, 0, width, height])
                    .attr("style", "max-width: 100%; height: auto;");
                
        const link = svg.append("g")
        .attr("stroke", "#999")
        .attr("stroke-opacity", 0.6)
        .selectAll()
        .data(links)
        .join("line")
        .attr("stroke-width", d => Math.sqrt(d.value));

        const node = svg.append("g")
        .attr("stroke", "#fff")
        .attr("stroke-width", 1.5)
    .selectAll()
    .data(nodes)
    .join("circle")
        .attr("r", 5)
        .attr("fill", 'steelblue');
        
        node.append("title")
        .text(d => d.id);
        
            function ticked() {
                link
                // @ts-ignore
                    .attr("x1", d => d.source.x)
                    // @ts-ignore
                    .attr("y1", d => d.source.y)
                    // @ts-ignore
                    .attr("x2", d => d.target.x)
                    // @ts-ignore
                    .attr("y2", d => d.target.y);
            
                node
                // @ts-ignore
                    .attr("cx", d => d.x)
                    // @ts-ignore
                    .attr("cy", d => d.y);
            }
            
            function dragstarted(event: any) {
                if (!event.active) simulation.alphaTarget(0.3).restart();
                event.subject.fx = event.subject.x;
                event.subject.fy = event.subject.y;
            }
            
            // Update the subject (dragged node) position during drag.
            function dragged(event: any) {
                event.subject.fx = event.x;
                event.subject.fy = event.y;
            }
            
            // Restore the target alpha so the simulation cools after dragging ends.
            // Unfix the subject position now that it’s no longer being dragged.
            function dragended(event: any) {
                if (!event.active) simulation.alphaTarget(0);
                event.subject.fx = null;
                event.subject.fy = null;
            }
        
        // @ts-ignore
        node.call(d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended));
        simulation.on("tick", ticked);

        return () => {
            simulation.stop();
          };
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