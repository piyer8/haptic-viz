import { Box, Chip } from '@mui/material';
import React, { useEffect, useState } from 'react'

interface FilterWord {
    word: string,
    wordType: 'sensory' | 'emotional' | 'associative'
}

export const ChipList = (props: {chipList: Set<FilterWord>, deleteWord: (word: FilterWord) => void}) => {
    const [wordList, setwordList] = useState<FilterWord[]>([...props.chipList]);

    useEffect(() => {
        setwordList([...props.chipList]);
    }, [props]);
    return(
        <Box display="flex" padding={2} width = {"100%"} flexDirection={"row"} flexWrap="wrap" gap={1}>
            {wordList.map((word) => <Chip key={word.word} label={word.word} variant="outlined"  onDelete={() => props.deleteWord(word)} />)}
        </Box>
    )
}