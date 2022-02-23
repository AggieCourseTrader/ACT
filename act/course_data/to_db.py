import csv


class Course:
    def __init__(self, term, course, section, designator, course_id, days_met, start_date, end_date, start_time, end_time, room, instructor):
        self.term = term
        self.course = course
        self.section = section
        self.designator = designator
        self.course_id = course_id
        self.days_met = days_met
        self.start_date = start_date
        self.end_date = end_date
        self.start_time = start_time
        self.end_time = end_time
        self.room = room
        self.instructor = instructor


class Group:
    def __init__(self, course_id):
        self.course_id = course_id
        self.courses = []


def parse_data(file):
    with open(file) as f:
        pass


def main():
    file = "Spring 2022.csv"
    parse_data(file)


if __name__ == '__main__':
    main()
