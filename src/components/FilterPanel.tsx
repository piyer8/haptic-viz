import { Autocomplete, Checkbox, Slider, Stack, TextField } from '@mui/material'
import sensoryKeywords from '../signals/signal-data/keyword-mappings/sensory_keywords.json';
import emotionalKeywords from '../signals/signal-data/keyword-mappings/emotional_keywords.json';
import associativeKeywords from '../signals/signal-data/keyword-mappings/associative_keywords.json';
import {CheckBoxOutlineBlank, CheckBox} from '@mui/icons-material'
import React, { useState } from 'react'
import { SliderList } from './Filters/SliderList';

interface FilterWord {
    word: string,
    wordType: 'sensory' | 'emotional' | 'associative'
}

const icon = <CheckBoxOutlineBlank fontSize="small" />;
const checkedIcon = <CheckBox fontSize="small" />;
export default function CheckboxesTags(props: { label: string,options: string[], applyFilters: (word: FilterWord) => void, deleteFromFilter: (word: FilterWord) => void}) {
  const { label, applyFilters, deleteFromFilter } = props
  const wordType = label.toLowerCase() as 'sensory' | 'emotional' | 'associative'
  const [value, setvalue] = useState<string[]>([]);

  const handleChange = (event: React.ChangeEvent<{}>, newValue: string[]) => {
    console.log('ha', newValue);
    const addedWords = newValue.filter(word => !value.includes(word));
    const removedWords = value.filter(word => !newValue.includes(word));

    addedWords.forEach(word => applyFilters({ word, wordType }));
    removedWords.forEach(word => deleteFromFilter({ word, wordType }));

    setvalue(newValue);
};

  return (
      <Autocomplete
        multiple
        id={"checkboxes-tags-demo-"+props.label}
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

export const FilterPanel = (props: { applyFilters: (word: FilterWord) => void, deleteFromFilter: (word: FilterWord) => void, applySliderFilter: (option: string, value: number[], keywordType: 'sensory' | 'emotional' | 'associative') => void}) => {

    return (
        <Stack height={"100%"} padding={5} width={"18vw"} gap={2}>
            <CheckboxesTags label="Sensory" options = {Object.keys(sensoryKeywords)} applyFilters={props.applyFilters} deleteFromFilter={props.deleteFromFilter}/>
            <SliderList name='Emotional' options = {Object.keys(emotionalKeywords)} applySliderFilter = {(option: string, value: number[]) => props.applySliderFilter(option, value, 'emotional')}/>
            <SliderList name='Associative' options = {Object.keys(associativeKeywords)} applySliderFilter = {(option: string, value: number[]) => props.applySliderFilter(option, value, 'associative')}/>
        </Stack>
    )
}