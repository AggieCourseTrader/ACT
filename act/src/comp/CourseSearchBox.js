import React, { useState } from 'react';
import { collection, query, where, getDocs } from "firebase/firestore";



const formSubmitAction = (e) => {
	e.preventDefault();
}

function CourseSearchBox({ db }) {
	const [searchBoxText, setSearchBoxText] = useState('');
	const [searchResults, setSearchResults] = useState([]);
	const [queryCounter, setQueryCounter] = useState(0);

	let setTxt = async (text) => {
		setSearchBoxText(text);
		
		if(text.length >= 2 && queryCounter < 20){
			console.log("Yes");
			const q = query(collection(db, "majors"), where("keywords", 'array-contains', text.toUpperCase()));

			const querySnapshot = await getDocs(q);
			
			let arr = []

			querySnapshot.forEach((doc) => {
				arr.push(doc.data().name);
				// doc.data() is never undefined for query doc snapshots
				console.log(doc.id, " => ", doc.data());
			});

			setSearchResults(arr);
			setQueryCounter(queryCounter + 1);
		}
		else {
			setSearchResults([]);
		}
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