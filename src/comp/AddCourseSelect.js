import { Autocomplete} from '@mui/material';
import { TextField } from '@mui/material';

export default function AddCourseSelect() {
    return (
        <Autocomplete
            disablePortal
            options={addClassOptions}
            sx = {{width:300}}
            renderInput={(params) => <TextField {...params} label="Add Course"/>}
        />
    );
}

const addClassOptions = [
    { label: "401"},
    { label: "402"},
    { label: "403"},
    { label: "201"},
    { label: "202"},
    { label: "203"},
    { label: "507"},
    { label: "508"},
    { label: "509"},
    { label: "600"},
];