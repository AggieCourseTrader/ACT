import React, { useEffect, useState } from 'react';
import { collection, query, where, getDocs } from "firebase/firestore";
import { ConstructionOutlined } from '@mui/icons-material';
import { Autocomplete, TextField, Box } from '@mui/material';
import Grid from '@mui/material/Grid';
import { getCourseByCrn, getCoursesByName } from './CrudFunctions';
import {createTheme, ThemeProvider} from '@mui/material/styles';

//4 Structure ---------------------//

//      --> Course search box
//				if selected then call selectionCallBack and allow for section selection
//      --> Section search box
//				if selected then call selectionCallBack
//4 -------------------------------//

//? Params: Input =>
// db (type: firestore db)


const mdTheme = createTheme();

function CourseSearchBox({ db, selectionCallBack }) {
	const [searchResults, setSearchResults] = useState([]);
	const [sectionResults, setSectionResults] = useState(['All sections']);
	const [queryCounter, setQueryCounter] = useState(0);
	const [searchText, setSearchText] = useState('');
	const [courseSelected, setCourseSelected] = useState(undefined);
	const [sectionSelected, setSectionSelected] = useState('');

	//* Updates search results whenever something is typed
	useEffect(async () => {
		let text = searchText;
		let courseText = text.replace(/\s*\d+\s*/g, '').replace(/\s*/g, '');
		let courseNumber = text.replace(/\D*/g, '');
		let arr = [];
		console.log(courseText);
		if(queryCounter > 20 || text.length < 2) {
			setSearchResults([]);
			return;
		}

		let q = false;
		// * If courseText is greaterthan >= 2
		// Search course first, then filter using number
		if(courseText.length >= 2) {
			q = query(collection(db, "majors"), where("keywords", 'array-contains', courseText.toUpperCase()));
			const querySnapshot = await getDocs(q);

			querySnapshot.forEach((doc) => {
				let major = doc.data().name;
				let courseMap = doc.data().course_map;
				// Match the numbers in a complicated way
				if(courseNumber.length >= 1) {
					doc.data().courses.forEach((c) => {
						c = c.toString();
						let match = true;
						for(let i = 0; i < courseNumber.length; i++) {
							if(i >= c.length) {
								match = false;
								break;
							}
							if(c[i] != courseNumber[i]) {
								match = false;
								break
							}
						}
						if(match) {
							let name = major + " "  + c;
							let crns = courseMap[parseInt(c)];
							arr.push({
								name : name,
								crns : crns
							});
						}
					});
				}
				// No numbers were given add everything
				else {
					doc.data().courses.forEach((c) => {
						let name = major + " "  + c;
						let crns = courseMap[parseInt(c)];
						arr.push({
							name : name,
							crns : crns
						});
					});
				}
				console.log(doc.id, " => ", doc.data());
			});
		}
		// * Else filter using number if courseNumber is greaterthan > 2 (limit 3)
		// Filter using coursename from keywords
		else if(courseNumber.length > 2) {
			q = query(collection(db, "majors"), where("courses", 'array-contains', courseNumber));
			const querySnapshot = await getDocs(q);
			querySnapshot.forEach((doc) => {
				let major = doc.data().name;
				let courseMap = doc.data().course_map;
				let c = courseNumber;
				// Match the major
				if(courseText.length >= 1) {
					if(doc.data().keywords.includes(courseText.toUpperCase())) {
						let name = major + " "  + c;
						let crns = courseMap[parseInt(c)];
						arr.push({
							name : name,
							crns : crns
						});
					}
				}
				// No major was specified
				else {
					let name = major + " "  + c;
					let crns = courseMap[parseInt(c)];
					arr.push({
						name : name,
						crns : crns
					});
				}
				console.log(doc.id, " => ", doc.data());
			});
		}
		setSearchResults(arr);
		setQueryCounter(queryCounter + 1);
	}, [searchText]);

	//* Runs whenever a course is selected from the dropdown
	useEffect(async () => {
		setSectionSelected('');
		setSectionResults([]);

		if(courseSelected == undefined) {
			return;
		}
		let arr = [];

		let q = await getCoursesByName(courseSelected.name);


		q.forEach((section) => {
			let lecDays = []
			let lecTimes = ''
			let labDays = []
			let labTimes = ''
			console.log(section.data());
			
			Object.entries(section.data().meeting_times).forEach((t) => {
				let day = t[0];
				let times = t[1];
				times.forEach((t) => {
					if (t.substring(t.length - 3) == "LAB") {
						labDays.push(day);
						labTimes = t.substring(0, t.length - 4);
					} else if (t.substring(t.length - 3) == "LEC") {
						lecDays.push(day);
						lecTimes = t.substring(0, t.length - 4);
					} 
					
				});
			});
			
			labDays.sort((x, y) => {
				let p = ['M', 'T', 'W', 'R', 'F', 'S']
				if(p.indexOf(x) < p.indexOf(y)) {
					return -1;
				}
				else if(p.indexOf(x) > p.indexOf(y)) {
					return 1;
				}
			});

			lecDays.sort((x, y) => {
				let p = ['M', 'T', 'W', 'R', 'F', 'S']
				if(p.indexOf(x) < p.indexOf(y)) {
					return -1;
				}
				else if(p.indexOf(x) > p.indexOf(y)) {
					return 1;
				}
			});


			let item = {
				'section' : section.data().section,
				'lec' : lecDays.join('') + " " + lecTimes + " LEC",
				'lab' : (labDays == []) ? '' : labDays.join('') + " " + labTimes + " LAB"
			};
			console.log(item);
			arr.push(item);
		});

		setSectionResults(arr);
		
	}, [courseSelected]);

	// let getCourseList = async (text) => {
		
	// };

	return (
		<>
		
		
		<Grid container spacing={2}>

			<Grid item xs>
				<Autocomplete
				onChange={(e, v) => {setCourseSelected(searchResults.find(x => x.name == v))}}
				// sx={{ width: 300 }}
				sx={{
					overflow: 'auto',
					flexGrow : 1
				}}
				id="course-search-box"
				noOptionsText={'Start typing ...'}
				options={searchResults.map((x) => x.name)}
				filterOptions={(x) => x}
				renderInput={(params) => <TextField {...params} onChange = {(e) => {setSearchText(e.target.value)}} label="Search a course" />}
			
				/>
			</Grid>

			<Grid item xs>
				<Autocomplete
				disabled={(courseSelected == undefined) ? true : false}
				autoHighlight
				onChange={(e, v) => {console.log(v)}}
				
				sx={{
					backgroundColor: (theme) =>
						theme.palette.mode === 'light'
							? theme.palette.grey[100]
							: theme.palette.grey[900],
					flexGrow: 1,
					width : 300,
					overflow: 'auto',
				}}
				
				id="course-search-box"
				noOptionsText={'No course selected'}
				options={sectionResults.map((x) => x.section)}
				// getOptionLabel={(option) => option.section || ""}
				// renderOption={(option) => (
				// 	<li>{option.section}</li>
				// )}
				renderInput={(params) => <TextField {...params} label="Select a section" />}
				/>
			</Grid>
		</Grid>
		


		</>		
	)
}


export default CourseSearchBox