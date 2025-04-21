import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Autocomplete,
  Box,
  Checkbox,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import sensoryKeywords from "../signals/signal-data/keyword-mappings/sensory_keywords.json";
import emotionalKeywords from "../signals/signal-data/keyword-mappings/emotional_keywords.json";
import associativeKeywords from "../signals/signal-data/keyword-mappings/associative_keywords.json";
import { CheckBoxOutlineBlank, CheckBox } from "@mui/icons-material";
import React, { useEffect, useState } from "react";
import { OptionSlider, SliderList } from "./Filters/SliderList";
import { PhysicalFilter } from "./Dashboard";

interface FilterWord {
  word: string;
  wordType: "sensory" | "emotional" | "associative";
}

const icon = <CheckBoxOutlineBlank fontSize="small" />;
const checkedIcon = <CheckBox fontSize="small" />;
export default function CheckboxesTags(props: {
  label: string;
  options: string[];
  applyFilters: (word: FilterWord) => void;
  deleteFromFilter: (word: FilterWord) => void;
}) {
  const { label, applyFilters, deleteFromFilter } = props;
  const wordType = label.toLowerCase() as
    | "sensory"
    | "emotional"
    | "associative";
  const [value, setvalue] = useState<string[]>([]);

  const handleChange = (event: React.ChangeEvent<{}>, newValue: string[]) => {
    const addedWords = newValue.filter((word) => !value.includes(word));
    const removedWords = value.filter((word) => !newValue.includes(word));

    addedWords.forEach((word) => applyFilters({ word, wordType }));
    removedWords.forEach((word) => deleteFromFilter({ word, wordType }));

    setvalue(newValue);
  };

  return (
    <Autocomplete
      multiple
      id={"checkboxes-tags-demo-" + props.label}
      options={props.options}
      disableCloseOnSelect
      getOptionLabel={(option) => option}
      value={value}
      onChange={handleChange}
      renderOption={(props, option, { selected }) => {
        const { key, ...optionProps } = props;
        return (
          <li key={key} {...optionProps}>
            <Checkbox
              icon={icon}
              checkedIcon={checkedIcon}
              style={{ marginRight: 8 }}
              checked={selected}
              //onSelect={() => {applyFilters({word: option, wordType: label.toLowerCase() as 'sensory' | 'emotional' | 'associative'})}}
            />
            {option}
          </li>
        );
      }}
      style={{ width: "100%" }}
      renderInput={(params) => (
        <TextField {...params} label={props.label} placeholder="Filter" />
      )}
    />
  );
}

const PhysicalFilters = (props: {
  updatePhysicalFilters: (filters: PhysicalFilter) => void;
  value: PhysicalFilter;
}) => {
  const [tempo, setTempo] = useState<number[]>(props.value.tempo);
  const [pulseType, setpulseType] = useState<string[]>(props.value.pulseType);
  const PULSE_TYPES = ["short", "medium", "long", "varied", "continuous"];

  useEffect(() => {
    setTempo(props.value.tempo);
    setpulseType(props.value.pulseType);
  }, [props.value]);

  useEffect(() => {
    props.updatePhysicalFilters({ ...props.value, tempo, pulseType });
  }, [tempo, pulseType]);

  return (
    <Accordion>
      <AccordionSummary>
        <Typography>{"Signal Properties"}</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Box>
          <OptionSlider
            option="tempo"
            value={tempo}
            onChange={(e: any, newValue: number[]) =>
              setTempo(newValue as number[])
            }
          />
          <Typography variant="body2">Pulse type</Typography>
          {PULSE_TYPES.map((pulse) => (
            <li key={pulse}>
            <Checkbox
                icon={icon}
                checkedIcon={checkedIcon}
                checked={pulseType.includes(pulse)}
                onChange={(e: any) => {
                  if (e.target.checked) setpulseType([...pulseType, pulse]);
                  else setpulseType(pulseType.filter((p) => p !== pulse));
                }}
              />
            {pulse}
            </li>
          ))}
        </Box>
      </AccordionDetails>
    </Accordion>
  );
};

export const FilterPanel = (props: {
  applyFilters: (word: FilterWord) => void;
  deleteFromFilter: (word: FilterWord) => void;
  applySliderFilter: (
    option: string,
    value: number[],
    keywordType: "emotional" | "associative"
  ) => void;
  emotionalFilters: any;
  associativeFilters: any;
  updatePhysicalFilters: (filters: PhysicalFilter) => void;
  physicalFilter: PhysicalFilter;
}) => {
  return (
    <Stack
      height={"100%"}
      overflow={"scroll"}
      padding={5}
      width={"18vw"}
      gap={2}
    >
      <PhysicalFilters updatePhysicalFilters={props.updatePhysicalFilters} value={props.physicalFilter} />
      <CheckboxesTags
        label="Sensory"
        options={Object.keys(sensoryKeywords)}
        applyFilters={props.applyFilters}
        deleteFromFilter={props.deleteFromFilter}
      />
      <SliderList
        name="Emotional"
        filters={props.emotionalFilters}
        options={Object.keys(emotionalKeywords)}
        applySliderFilter={(option: string, value: number[]) =>
          props.applySliderFilter(option, value, "emotional")
        }
      />
      <SliderList
        name="Associative"
        filters={props.associativeFilters}
        options={Object.keys(associativeKeywords)}
        applySliderFilter={(option: string, value: number[]) =>
          props.applySliderFilter(option, value, "associative")
        }
      />
    </Stack>
  );
};
