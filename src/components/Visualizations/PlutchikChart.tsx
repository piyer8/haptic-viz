import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

const emotionOrder = [
  "joy",
  "trust",
  "fear",
  "surprise",
  "sadness",
  "disgust",
  "anger",
  "anticipation"
];

interface EmotionValues{
    joy: number;
    trust: number;
    fear: number;
    surprise: number;
    sadness: number;
    disgust: number;
    anger: number;
    anticipation: number;
}

const emotionColors: Record<string, string> = {
  joy: "#FFD700", // yellow
  trust: "#6B8E23", // olive
  fear: "#228B22", // forest green
  surprise: "#87CEFA", // sky blue
  sadness: "#1E90FF", // dodger blue
  disgust: "#9370DB", // purple
  anger: "#FF4500", // orange red
  anticipation: "#FFA500" // orange
};

export const PlutchikChart = ({
  width = 400,
  height = 400,
  emotions,
  onClick,  
}: {
  width?: number;
  height?: number;
  emotions: EmotionValues;
  onClick?: (category: string) => void;
}) => {
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    console.log(emotions);
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); // Clear previous render

    const radius = Math.min(width, height) / 2 - 50;
    const center = { x: width / 2, y: height / 2 };

    const data = emotionOrder.map((emotion) => ({
      category: emotion,
      // @ts-ignore
      value: emotions[emotion] ?? 0
    }));

    const maxValue = Math.max(...Object.values(emotions));
    const max = maxValue > 0.5 ? (maxValue > 0.75 ? 1 : 0.75) : 0.5; 
    const scaleFactor = max === 1 ? 1 : max === 0.75 ? 1.5 : 2;
    const pie = d3.pie<any>().value(max); // Equal-sized slices
    const arc = d3.arc<any>()
      .innerRadius(0)
      .outerRadius((d) => radius * d.data.value * scaleFactor);

    const arcs = pie(data);

    const g = svg
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${center.x}, ${center.y})`);

    // Petals
    g.selectAll("path")
      .data(arcs)
      .enter()
      .append("path")
      .attr("d", arc)
      .attr("fill", (d) => emotionColors[d.data.category])
      .attr("fill-opacity", 0.6)
      .attr("stroke", "#fff")
      .on('mouseover', (e,d) => e.target.setAttribute('fill-opacity', 1))
      .on('mouseout', (e,d) => e.target.setAttribute('fill-opacity', 0.6))
      .on('click', (e,d) => onClick && onClick(d.data.category));

      g.selectAll("line.radial")
      .data(arcs)
      .enter()
      .append("line")
      .attr("class", "radial")
      .attr("x1", 0)
      .attr("y1", 0)
      .attr("x2", (d) => radius * Math.cos((d.startAngle + d.endAngle) / 2 - Math.PI / 2))
      .attr("y2", (d) => radius * Math.sin((d.startAngle + d.endAngle) / 2 - Math.PI / 2))
      .attr("stroke", "#bbb")
      .attr("stroke-width", 1)
      .attr("stroke-dasharray", "2,2");

    // Circles axis
    const numCircles = max === 0.5 ? 2 : max === 0.75 ? 3 : 4;
    console.log(max);
    const step = radius / numCircles;

    for (let i = 1; i <= numCircles; i++) {
      g.append("circle")
        .attr("r", i * step)
        .attr("fill", "none")
        .attr("stroke", "#ccc")
        .attr("stroke-dasharray", "2,2")
        .attr("stroke-width", 1);
    }

    // Labels
    const labelArc = d3.arc<any>()
      .innerRadius(radius + 20)
      .outerRadius(radius + 20);

    g.selectAll("text")
      .data(arcs)
      .enter()
      .append("text")
      .attr("transform", (d) => `translate(${labelArc.centroid(d)})`)
      .attr("rotate", (d) => ((d.startAngle + d.endAngle) / 2))
      .style("text-anchor", "middle")
      .style("font-size", "12px")
      .style("font-weight", "bold")
      .style("fill", (d) => emotionColors[d.data.category])
      .text((d) =>
        `${d.data.category}\n${d.data.value.toFixed(2)}`
      );
  }, [emotions, width, height]);

  return <svg ref={svgRef}></svg>;
};