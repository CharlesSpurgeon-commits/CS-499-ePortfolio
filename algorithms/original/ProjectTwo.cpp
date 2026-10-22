#include <iostream>
#include <fstream>
#include <sstream>
#include <string>
#include <vector>
#include <algorithm>

using namespace std;

/*
 * Course structure to hold course data.
 */
struct Course {
    string courseNumber;          // e.g., "CS101"
    string name;                  // course title
    vector<string> prerequisites; // list of course numbers for prereqs
};

/*
 * Node for the hash table linked list (separate chaining).
 */
struct Node {
    Course course;
    Node* next;

    Node() : next(nullptr) {}
    Node(const Course& c) : course(c), next(nullptr) {}
};

/*
 * Simple hash table implementation keyed by courseNumber.
 */
class HashTable {
public:
    // Constructor with default table size
    HashTable(size_t size = 179) {
        tableSize = size;
        buckets.resize(tableSize, nullptr);
    }

    // Destructor to free all nodes
    ~HashTable() {
        for (size_t i = 0; i < tableSize; ++i) {
            Node* current = buckets[i];
            while (current != nullptr) {
                Node* toDelete = current;
                current = current->next;
                delete toDelete;
            }
        }
    }

    // Insert a course into the hash table
    void Insert(const Course& course) {
        size_t index = Hash(course.courseNumber);
        Node* newNode = new Node(course);
        // Insert at the front of the linked list for this bucket
        newNode->next = buckets[index];
        buckets[index] = newNode;
    }

    // Find a course by courseNumber; returns pointer or nullptr
    Course* Find(const string& courseNumber) {
        size_t index = Hash(courseNumber);
        Node* current = buckets[index];
        while (current != nullptr) {
            if (current->course.courseNumber == courseNumber) {
                return &(current->course);
            }
            current = current->next;
        }
        return nullptr;
    }

    // Get a list of all courses stored in the table
    vector<Course> GetAllCourses() const {
        vector<Course> result;
        for (size_t i = 0; i < tableSize; ++i) {
            Node* current = buckets[i];
            while (current != nullptr) {
                result.push_back(current->course);
                current = current->next;
            }
        }
        return result;
    }

private:
    vector<Node*> buckets;
    size_t tableSize;

    // Simple hash function for strings
    size_t Hash(const string& key) const {
        // polynomial rolling hash
        unsigned long value = 0;
        for (char c : key) {
            value = value * 31 + static_cast<unsigned long>(c);
        }
        return value % tableSize;
    }
};

/*
 * Helper function: trim whitespace from both ends of a string.
 */
string trim(const string& s) {
    size_t start = s.find_first_not_of(" \t\r\n");
    if (start == string::npos) {
        return "";
    }
    size_t end = s.find_last_not_of(" \t\r\n");
    return s.substr(start, end - start + 1);
}

/*
 * Load courses from a CSV file into the hash table.
 * File format per line:
 *   courseNumber,courseName,prereq1,prereq2,...
 */
void loadCourses(const string& fileName, HashTable& table) {
    ifstream file(fileName);
    if (!file.is_open()) {
        cout << "Error: Unable to open file: " << fileName << endl;
        return;
    }

    string line;
    int lineNumber = 0;
    vector<Course> allCourses;

    // First pass: read and create Course objects
    while (getline(file, line)) {
        lineNumber++;

        if (line.empty()) {
            continue; // skip empty lines
        }

        stringstream ss(line);
        string token;
        vector<string> tokens;

        // Split by comma
        while (getline(ss, token, ',')) {
            tokens.push_back(trim(token));
        }

        // Each line must have at least courseNumber and name
        if (tokens.size() < 2) {
            cout << "Format error on line " << lineNumber
                 << ": expected at least course number and name." << endl;
            continue;
        }

        Course course;
        course.courseNumber = tokens[0];
        course.name = tokens[1];

        // Remaining tokens are prerequisites (if any)
        for (size_t i = 2; i < tokens.size(); ++i) {
            if (!tokens[i].empty()) {
                course.prerequisites.push_back(tokens[i]);
            }
        }

        allCourses.push_back(course);
    }

    // Insert all courses into the hash table
    for (const Course& c : allCourses) {
        table.Insert(c);
    }

    // Optional: validation that each prerequisite exists
    for (const Course& c : allCourses) {
        for (const string& prereqNumber : c.prerequisites) {
            Course* prereqCourse = table.Find(prereqNumber);
            if (prereqCourse == nullptr) {
                cout << "Warning: prerequisite " << prereqNumber
                     << " for course " << c.courseNumber
                     << " does not exist in the file." << endl;
            }
        }
    }

    cout << "Loaded " << allCourses.size()
         << " courses from file \"" << fileName << "\"." << endl;
}

/*
 * Print a single course's information (number, name, prerequisites).
 */
void printCourseInfo(HashTable& table, const string& courseNumber) {
    Course* course = table.Find(courseNumber);
    if (course == nullptr) {
        cout << "Course " << courseNumber << " not found." << endl;
        return;
    }

    cout << course->courseNumber << ": " << course->name << endl;

    if (course->prerequisites.empty()) {
        cout << "Prerequisites: None" << endl;
        return;
    }

    cout << "Prerequisites:" << endl;
    for (const string& prereqNumber : course->prerequisites) {
        Course* prereqCourse = table.Find(prereqNumber);
        if (prereqCourse != nullptr) {
            cout << "  " << prereqCourse->courseNumber
                 << ": " << prereqCourse->name << endl;
        } else {
            cout << "  " << prereqNumber << " (course not found in data)" << endl;
        }
    }
}

/*
 * Print the entire course list in alphanumeric order by course number.
 */
void printCourseList(HashTable& table) {
    vector<Course> courses = table.GetAllCourses();

    if (courses.empty()) {
        cout << "No courses loaded. Please load data first." << endl;
        return;
    }

    // Sort by courseNumber
    sort(courses.begin(), courses.end(),
         [](const Course& a, const Course& b) {
             return a.courseNumber < b.courseNumber;
         });

    cout << "Course List:" << endl;
    for (const Course& c : courses) {
        cout << c.courseNumber << ": " << c.name << endl;
    }
}

/*
 * Main program menu for the advising assistance tool.
 */
int main() {
    HashTable table;          // hash table to store courses
    bool dataLoaded = false;  // track whether file has been loaded
    int choice = 0;

    cout << "Welcome to ABCU Computer Science Advising Tool" << endl;

    while (choice != 9) {
        cout << "\nMenu:" << endl;
        cout << "  1. Load Data Structure" << endl;
        cout << "  2. Print Course List" << endl;
        cout << "  3. Print Course" << endl;
        cout << "  9. Exit" << endl;
        cout << "Enter choice: ";

        if (!(cin >> choice)) {
            // handle non-numeric input
            cin.clear();
            cin.ignore(numeric_limits<streamsize>::max(), '\n');
            cout << "Invalid input. Please enter a number from the menu." << endl;
            continue;
        }

        // clear newline left in buffer for later string input
        cin.ignore(numeric_limits<streamsize>::max(), '\n');

        switch (choice) {
        case 1: {
            string fileName;
            cout << "Enter the file name containing the course data: ";
            getline(cin, fileName);

            if (fileName.empty()) {
                cout << "File name cannot be empty." << endl;
                break;
            }

            // Recreate the table to clear any previous data
            table = HashTable();
            loadCourses(fileName, table);
            dataLoaded = true;
            break;
        }
        case 2:
            if (!dataLoaded) {
                cout << "Please load the course data first (option 1)." << endl;
            } else {
                printCourseList(table);
            }
            break;

        case 3:
            if (!dataLoaded) {
                cout << "Please load the course data first (option 1)." << endl;
            } else {
                string courseNumber;
                cout << "Enter course number (e.g., CS101): ";
                getline(cin, courseNumber);
                courseNumber = trim(courseNumber);
                if (courseNumber.empty()) {
                    cout << "Course number cannot be empty." << endl;
                } else {
                    printCourseInfo(table, courseNumber);
                }
            }
            break;

        case 9:
            cout << "Thank you for using the advising tool. Goodbye!" << endl;
            break;

        default:
            cout << "Invalid choice. Please select a valid menu option." << endl;
            break;
        }
    }

    return 0;
}
