import React, { useState } from 'react';
import { collection, query, where, getDocs } from "firebase/firestore";
import { ConstructionOutlined } from '@mui/icons-material';



const formSubmitAction = (e) => {
	e.preventDefault();
}

function CourseSearchBox({ db }) {
	const [searchBoxText, setSearchBoxText] = useState('');
	const [searchResults, setSearchResults] = useState([]);
	const [queryCounter, setQueryCounter] = useState(0);

	let setTxt = async (text) => {
		setSearchBoxText(text);

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
							arr.push(major + " " + c);
						}
					});
				}
				// No numbers were given add everything
				else {
					doc.data().courses.forEach((c) => {
						arr.push(major + " " + c);
						console.log("Bro");
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
				
				// Match the major
				if(courseText.length >= 1) {
					if(doc.data().keywords.includes(courseText.toUpperCase())) {
						arr.push(major + " " + courseNumber);
					}
				}
				// No major was specified
				else {
					arr.push(major + " " + courseNumber);
				}
				console.log(doc.id, " => ", doc.data());
			});
		}
		setSearchResults(arr);
		setQueryCounter(queryCounter + 1);
	}


	const showResults = searchResults.map((d) => <li key={d}>{d}</li>);

	return (
		<>
		{queryCounter}
		<form onSubmit={(e) => {formSubmitAction(e)}}>
			<input type="text" onChange={(e) => {setTxt(e.target.value);}}></input>
			<button type="submit">Search</button>
		</form>
		{showResults}
		</>		
	)
}


export default CourseSearchBox