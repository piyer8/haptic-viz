import React, { useEffect, useRef, useState } from 'react'
import { Signal } from '../../types/SignalTypes'
import smoothnessScores from '../../signals/signal-data/signal-scores/smoothness_scores.json';
import worryScores from '../../signals/signal-data/signal-scores/worry_scores.json'
import * as d3 from "d3";
import { Modal } from '@mui/material';
import { SignalPanel } from '../SignalPanel';

interface Point {
    signal_index: string;
    worry_score: number;
    smoothness_score: number;
}

export const ScatterPlot = (props: {signals: Signal[]}) => {
    const [signals, setSignals] = useState<Signal[]>([]);
    const [signalData, setSignalData] = useState<Point[]>([]);
    const svgRef = useRef<SVGSVGElement | null>(null);
    const [currentSignal, setcurrentSignal] = useState<number>();
    const [open, setopen] = useState<boolean>(false);
    const [hoveredPoint, sethoveredPoint] = useState<number>();

    useEffect(() => {
        setSignals(props.signals);
    }, [props]);

    useEffect(() => {
        let signalScores = signals.map((signal) => {
            let worryScore = worryScores.find((score) => score.signal_index === signal.signal_id);
            let smoothnessScore = smoothnessScores.find((score) => score.signal_id === 'F'+signal.signal_id);
            return {
                signal_index: signal.signal_id,
                worry_score: worryScore ? worryScore.worry_score : 0,
                smoothness_score: smoothnessScore ? smoothnessScore.smoothness_score : 0,
            }
        })
        setSignalData(signalScores);
    }, [signals]);

    const onClick = (signal_id: string) => {
        setcurrentSignal(Number.parseInt(signal_id));
        setopen(true);
    }

    const onHover =  (signal_id: string) => {
        sethoveredPoint(Number.parseInt(signal_id));
    }

    useEffect(() => {
        const width = 800;
        const height = 800;
        const margin = { top: 20, right: 80, bottom: 20, left: 80 };
        const svg = d3.select(svgRef.current)
                    .attr("width", width)
                    .attr("height", height)
                    .style('overflow', 'visible');
        const xScale = d3.scaleLinear().domain([-1, 1]).range([margin.left, width - margin.right]);
        const yScale = d3.scaleLinear().domain([-1, 1]).range([height - margin.bottom, margin.top]);
        const xAxis = d3.axisBottom(xScale);
        const yAxis = d3.axisLeft(yScale);
        svg.selectAll(".x-axis").remove();
        svg.selectAll(".y-axis").remove();
        svg.selectAll(".x-label").remove();
        svg.selectAll(".y-label").remove();

        svg.append("g")
            .attr("class", "x-axis")
            .attr("transform", `translate(0, ${height/2 - margin.bottom})`)
            .call(xAxis);

        svg.append("g")
            .attr("class", "y-axis")
            .attr("transform", `translate(${width/2}, 0)`)
            .call(yAxis);
        
        svg.append("text")
            .attr("x", margin.left-70)
            .attr("y", height/2 - 10)
            .attr("text-anchor", "start")
            .style("font-size", "12px")
            .text("Calmness");

        svg.append("text")
            .attr("x", width)
            .attr("y", height/2 - 10)
            .attr("text-anchor", "end")
            .style("font-size", "12px")
            .text("Anxiety");

        svg.append("text")
            .attr("x", width/2)
            .attr("y", height-5)
            .attr("text-anchor", "end")
            .style("font-size", "12px")
            .text("Roughness");

        svg.append("text")
            .attr("x", width/2)
            .attr("y", 10)
            .attr("text-anchor", "end")
            .style("font-size", "12px")
            .text("Smoothness");
        const points = svg.selectAll("circle").data(signalData);
        
        points.enter()
            .append("circle")
            //@ts-ignore
            .merge(points)
            .attr("cx", d => xScale(d.smoothness_score))
            .attr("cy", d => yScale(d.worry_score))
            .attr("r", 5)
            .attr("fill", "blue")
            .on("click", (event, d) => onClick(d.signal_index));
        
        points.on('mouseover', (d)=> onHover(d.signal_index));

        points.exit().remove();

    }, [signalData]);

    return (
        <>
            <svg ref={svgRef}></svg>
            {currentSignal && <Modal open={open} onClose={() => setopen(false)}>
                            <SignalPanel signalId={currentSignal}/>
                </Modal>}
        </>
    )
}