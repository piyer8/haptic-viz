import { Card, CardContent } from "@mui/material";
import * as d3 from "d3";
import { useEffect, useRef } from "react";

export default function D3Slider(props: {value: number, title: string}) {
  const svgRef = useRef(null);
  const width = 300; // Width of slider
  const height = 50; // Height of slider
  const margin = { left: 20, right: 20 };

  useEffect(() => {
    const svg = d3.select(svgRef.current).attr("width", width).attr("height", height);

    const xScale = d3.scaleLinear().domain([-1, 1]).range([margin.left, width - margin.right]);

    // Remove old elements before redrawing (for React re-renders)
    svg.selectAll("*").remove();

    svg.append("text")
      .attr("x", width / 2)
      .attr("y", 15)
      .attr("text-anchor", "middle")
      .attr("font-size", "14px")
      .attr("fill", "#333")
      .text(props.title);

      svg.append("text")
      .attr("x", margin.left)
      .attr("y", height / 2 + 40)
      .attr("text-anchor", "start")
      .attr("font-size", "12px")
      .attr("fill", "blue")
      .text("Calm");

    svg.append("text")
      .attr("x", width - margin.right)
      .attr("y", height / 2 + 40)
      .attr("text-anchor", "end")
      .attr("font-size", "12px")
      .attr("fill", "red")
      .text("Anxious");

    // Add the slider line
    svg.append("line")
      .attr("x1", margin.left)
      .attr("x2", width - margin.right)
      .attr("y1", height / 2)
      .attr("y2", height / 2)
      .attr("stroke", "#ccc")
      .attr("stroke-width", 5);

    // Add ticks (-3 to 3)
    const ticks = [-1, -0.75, -0.5, -0.25, 0, 0.25, 0.5, 0.75, 1];
    svg.selectAll("text")
      .data(ticks)
      .enter()
      .append("text")
      .attr("x", d => xScale(d))
      .attr("y", height / 2 + 20)
      .attr("text-anchor", "middle")
      .attr("font-size", "8px")
      .attr("fill", "#333")
      .text(d => d);

    // Add a static marker for the value
    svg.append("circle")
      .attr("cx", xScale(props.value)) // Position based on value
      .attr("cy", height / 2)
      .attr("r", 8)
      .attr("fill", props.value >= 0 ? "red" : "blue"); // Red for anxiety, blue for calm
  }, [props, margin.left, margin.right]);

  return (
    <svg ref={svgRef} />
  )
}