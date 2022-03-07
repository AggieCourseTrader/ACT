import { Autocomplete} from '@mui/material';
import { TextField } from '@mui/material';

export default function DropClassSelect() {
    return (
        <Autocomplete
            disablePortal
            options={addClassOptions}
            sx = {{width:300}}
            renderInput={(params) => <TextField {...params} label="Drop Class"/>}
        />
    );
}

const addClassOptions = [
    { label: "CSCE 482"},
    { label: "ENGR 102"},
    { label: "MATH 251"},
    { label: "CHEM 107"},
    { label: "CSCE 121"},
    { label: "CSCE 411"},
    { label: "CSCE 221"},
    { label: "CSCE 222"},
    { label: "CSCE 441"},
    { label: "CSCE 420"},
];