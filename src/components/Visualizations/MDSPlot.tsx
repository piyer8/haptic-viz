import React, { useEffect, useRef, useState } from 'react';
import { Signal } from '../../types/SignalTypes';
import * as d3 from 'd3';
import { Box, MenuItem, Modal, Select } from '@mui/material';
import { SignalPanel } from '../SignalPanel';
import signal_embeddings from './../../signals/signal-data/embeddings/signal_embeddings_mds.json';

interface MDSPoint {
  signal_index: string;
  sensory_mds: number[];
  emotional_mds: number[];
  metaphor_mds: number[];
}

export const MDSPlot = (props: { signals: Signal[] }) => {
  const [signals, setSignals] = useState<Signal[]>([]);
  const [signalData, setSignalData] = useState<MDSPoint[]>([]);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [currentSignal, setCurrentSignal] = useState<number>();
  const [open, setOpen] = useState<boolean>(false);
  const [currentType, setcurrentType] = useState<'sensory' | 'emotional' | 'associative' | 'all'>('sensory');

  useEffect(() => {
    setSignals(props.signals);
  }, [props]);

  useEffect(() => {
    // Filter embedding data to include only the currently available signals
    const filteredData = signal_embeddings.filter((embedding) =>
      signals.find((s) => s.signal_id === embedding.signal_index)
    );
    setSignalData(filteredData);
  }, [signals]);

  const onClick = (signal_id: string) => {
    setCurrentSignal(Number.parseInt(signal_id));
    setOpen(true);
  };

  useEffect(() => {
    const width = 800;
    const height = 800;
    const margin = { top: 20, right: 80, bottom: 20, left: 80 };

    const svg = d3
      .select(svgRef.current)
      .attr('width', width)
      .attr('height', height)
      .style('overflow', 'visible');

    svg.selectAll('*').remove(); // Clear previous render

    const xScale = d3
      .scaleLinear()
      .domain([-1.5, 1.5])
      .range([margin.left, width - margin.right]);

    const yScale = d3
      .scaleLinear()
      .domain([-1.5, 1.5])
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
   if(currentType === 'sensory') {
        svg.selectAll('circle')
        .data(signalData)
        .enter()
        .append('circle')
        .attr('cx', d => xScale(d.sensory_mds[0]))
        .attr('cy', d => yScale(d.sensory_mds[1]))
        .attr('r', 5)
        .attr('fill', 'steelblue')
        .attr('opacity', 0.8)
        .style('cursor', 'pointer')
        .on('click', (event, d) => onClick(d.signal_index));   
   } else if (currentType === 'emotional') {
    svg.selectAll('circle')
    .data(signalData)
    .enter()
    .append('circle')
    .attr('cx', d => xScale(d.emotional_mds[0]))
    .attr('cy', d => yScale(d.emotional_mds[1]))
    .attr('r', 5)
    .attr('fill', 'steelblue')
    .attr('opacity', 0.8)
    .style('cursor', 'pointer')
    .on('click', (event, d) => onClick(d.signal_index));
   } else if(currentType === 'associative') {
    svg.selectAll('circle')
    .data(signalData)
    .enter()
    .append('circle')
    .attr('cx', d => xScale(d.metaphor_mds[0]))
    .attr('cy', d => yScale(d.metaphor_mds[1]))
    .attr('r', 5)
    .attr('fill', 'steelblue')
    .attr('opacity', 0.8)
    .style('cursor', 'pointer')
    .on('click', (event, d) => onClick(d.signal_index));
   }
  }, [signalData, currentType]);

  return (
    <Box>
        <Select
        value={currentType}
        onChange={(e) => setcurrentType(e.target.value as 'sensory' | 'emotional' | 'associative' | 'all')}
        >
        <MenuItem value="sensory">Sensory</MenuItem>
        <MenuItem value="emotional">Emotional</MenuItem>
        <MenuItem value="associative">Associative</MenuItem>
        </Select>
      <svg ref={svgRef}></svg>
      {currentSignal && (
        <Modal open={open} onClose={() => setOpen(false)}>
          <SignalPanel signalId={currentSignal} />
        </Modal>
      )}
    </Box>
  );
};