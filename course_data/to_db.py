import csv
import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore





class Course:
    def __init__(self):
        self.dates = {}
        self.instructor = ""
        self.room = ""
        
    def add(self, term, course_string, crn, days_met, stDate, endDate, stTime, endTime, room, instructor):
        self.term = term
        
        self.course = course_string.split('/')[0]
        self.section = course_string.split('/')[1].split(' ')[0]
        designator = course_string.split('/')[1].split(' ')[1]
        
        self.crn = crn
        self.days_met = days_met
        self.start_date = stDate
        self.end_date = endDate
        self.start_time = stTime
        self.end_time = endTime
        
        
        if(designator == "LEC"):
            self.instructor = instructor
            self.room = room
        
        
        for i in self.days_met:
            temp = self.start_time + " - " + self.end_time + " " + designator
            if(i not in self.dates):
                self.dates[i] = [temp]
            else:
                self.dates[i].append(self.start_time + " - " + self.end_time + " " + designator)
        
    def getDict(self):
        return {
            "course" : self.course,
            "section" : self.section,
            "crn" : int(self.crn),
            "instructor" : self.instructor,
            "room" : self.room,
            "meeting_times" : self.dates
        }
        


class Group:
    def __init__(self, course_id):
        self.course_id = course_id
        self.courses = []

def parse_data(file, col_ref):
    with open(file) as f:
        csv_reader = csv.reader(f)
        courseData = {}
        first = True
        for row in csv_reader:
            if(first):
                first = False
                continue
            if(row[2] not in courseData):
                courseData[row[2]] = Course()
            courseData[row[2]].add(row[0], row[1], row[2], row[3], row[4], row[5], row[6], row[7], row[8], row[9])

        for crn, course in courseData.items():
            col_ref.add(course.getDict())
        

def main():
    file = "C:/Users/user/Documents/sem6/act-practice-1/ACT/act/course_data/Spring 2022.csv"
    cred = credentials.Certificate("C:/Users/user/Documents/sem6/act-practice-1/serviceAccountKey.json")
    firebase_admin.initialize_app(cred)
    
    db = firestore.client()
    

    col_ref = db.collection(u'courses')

    parse_data(file, col_ref)


if __name__ == '__main__':
    main()
