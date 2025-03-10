import { useEffect, useState } from "react";
import d3Cloud from "d3-cloud";
import { Wordcloud } from "@visx/wordcloud";
import { Typography } from "@mui/material";
import { Text } from '@visx/text';
import { scaleLog } from '@visx/scale';

interface Datum {
  text: string;
  value: number;
}

type WordcloudProps = {
  width: number;
  height: number;
  data: Datum[];
};

export interface Word extends d3Cloud.Word {
  text: string;
  value: number;
}

export const WordcloudPanel = ({ width, height, data }: WordcloudProps) => {
  const fixedValueGenerator = () => 0.5;
  const colors = ['#143059', '#2F6B9A', '#82a6c2'];

  const words = data
  const fontScale = scaleLog({
    domain: [Math.min(...words.map((w) => w.value)), Math.max(...words.map((w) => w.value))],
    range: [10, 100],
  });
  const fontSizeSetter = (datum: Datum) => fontScale(datum.value);

  return (
    <Wordcloud
        words={data}
        width={width}
        height={height}
        fontSize={fontSizeSetter}
        font={'Impact'}
        padding={2}
        spiral={'archimedean'}
        rotate={0}
        random={fixedValueGenerator}
      >
        {(cloudWords) =>
          cloudWords.map((w, i) => (
            <Text
              key={w.text}
              fill={colors[i % colors.length]}
              textAnchor={'middle'}
              transform={`translate(${w.x}, ${w.y}) rotate(${w.rotate})`}
              fontSize={w.size}
              fontFamily={w.font}
            >
              {w.text}
            </Text>
          ))
        }
      </Wordcloud>
  )
};
