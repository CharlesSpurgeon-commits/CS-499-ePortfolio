#include <algorithm>
#include <cctype>
#include <fstream>
#include <iostream>
#include <limits>
#include <sstream>
#include <string>
#include <unordered_map>
#include <vector>

using namespace std;

struct Course {
    string courseNumber;
    string name;
    vector<string> prerequisites;
};

struct Node {
    Course course;
    Node* next;
    explicit Node(const Course& value) : course(value), next(nullptr) {}
};

class HashTable {
public:
    explicit HashTable(size_t size = 179)
        : buckets(size, nullptr), tableSize(size), itemCount(0) {}

    ~HashTable() { Clear(); }

    // Raw pointers make implicit copying unsafe, so copying is prohibited.
    HashTable(const HashTable&) = delete;
    HashTable& operator=(const HashTable&) = delete;

    void Clear() {
        for (Node*& bucket : buckets) {
            Node* current = bucket;
            while (current != nullptr) {
                Node* next = current->next;
                delete current;
                current = next;
            }
            bucket = nullptr;
        }
        itemCount = 0;
    }

    bool Insert(const Course& course) {
        if (Find(course.courseNumber) != nullptr) {
            return false;
        }
        size_t index = Hash(course.courseNumber);
        Node* newNode = new Node(course);
        newNode->next = buckets[index];
        buckets[index] = newNode;
        ++itemCount;
        return true;
    }

    Course* Find(const string& courseNumber) {
        size_t index = Hash(courseNumber);
        Node* current = buckets[index];
        while (current != nullptr) {
            if (current->course.courseNumber == courseNumber) {
                return &current->course;
            }
            current = current->next;
        }
        return nullptr;
    }

    const Course* Find(const string& courseNumber) const {
        size_t index = Hash(courseNumber);
        const Node* current = buckets[index];
        while (current != nullptr) {
            if (current->course.courseNumber == courseNumber) {
                return &current->course;
            }
            current = current->next;
        }
        return nullptr;
    }

    vector<Course> GetAllCourses() const {
        vector<Course> result;
        result.reserve(itemCount);
        for (const Node* bucket : buckets) {
            const Node* current = bucket;
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
    size_t itemCount;

    size_t Hash(const string& key) const {
        unsigned long value = 0;
        for (unsigned char character : key) {
            value = value * 31 + character;
        }
        return value % tableSize;
    }
};

string trim(const string& value) {
    size_t start = value.find_first_not_of(" \t\r\n");
    if (start == string::npos) return "";
    size_t end = value.find_last_not_of(" \t\r\n");
    return value.substr(start, end - start + 1);
}

string normalizeCourseNumber(string value) {
    value = trim(value);
    transform(value.begin(), value.end(), value.begin(),
              [](unsigned char c) { return static_cast<char>(toupper(c)); });
    return value;
}

bool validCourseNumber(const string& value) {
    if (value.empty()) return false;
    return all_of(value.begin(), value.end(), [](unsigned char c) {
        return isalnum(c) || c == '-' || c == '_';
    });
}

bool visitCourse(const string& courseNumber, const HashTable& table,
                 unordered_map<string, int>& state, vector<string>& order,
                 vector<string>& path) {
    state[courseNumber] = 1;
    path.push_back(courseNumber);
    const Course* course = table.Find(courseNumber);

    for (const string& prerequisite : course->prerequisites) {
        if (state[prerequisite] == 1) {
            auto start = find(path.begin(), path.end(), prerequisite);
            cerr << "Cycle detected: ";
            for (auto current = start; current != path.end(); ++current) {
                cerr << *current << " -> ";
            }
            cerr << prerequisite << endl;
            return false;
        }
        if (state[prerequisite] == 0 &&
            !visitCourse(prerequisite, table, state, order, path)) {
            return false;
        }
    }

    path.pop_back();
    state[courseNumber] = 2;
    order.push_back(courseNumber);
    return true;
}

bool createFeasibleSchedule(const HashTable& table, vector<string>& order) {
    unordered_map<string, int> state;
    vector<string> path;
    vector<Course> courses = table.GetAllCourses();
    sort(courses.begin(), courses.end(), [](const Course& a, const Course& b) {
        return a.courseNumber < b.courseNumber;
    });
    for (const Course& course : courses) state[course.courseNumber] = 0;
    for (const Course& course : courses) {
        if (state[course.courseNumber] == 0 &&
            !visitCourse(course.courseNumber, table, state, order, path)) {
            order.clear();
            return false;
        }
    }
    return true;
}

bool loadCourses(const string& fileName, HashTable& table) {
    ifstream file(fileName);
    if (!file.is_open()) {
        cerr << "Error: Unable to open file: " << fileName << endl;
        return false;
    }

    HashTable candidate;
    string line;
    int lineNumber = 0;
    bool valid = true;

    while (getline(file, line)) {
        ++lineNumber;
        if (trim(line).empty()) continue;
        stringstream stream(line);
        string token;
        vector<string> tokens;
        while (getline(stream, token, ',')) tokens.push_back(trim(token));

        if (tokens.size() < 2) {
            cerr << "Line " << lineNumber << ": course number and name required." << endl;
            valid = false;
            continue;
        }

        Course course;
        course.courseNumber = normalizeCourseNumber(tokens[0]);
        course.name = trim(tokens[1]);
        if (!validCourseNumber(course.courseNumber) || course.name.empty()) {
            cerr << "Line " << lineNumber << ": invalid course number or name." << endl;
            valid = false;
            continue;
        }
        for (size_t i = 2; i < tokens.size(); ++i) {
            string prerequisite = normalizeCourseNumber(tokens[i]);
            if (!prerequisite.empty()) course.prerequisites.push_back(prerequisite);
        }
        if (!candidate.Insert(course)) {
            cerr << "Line " << lineNumber << ": duplicate course "
                 << course.courseNumber << "." << endl;
            valid = false;
        }
    }

    vector<Course> courses = candidate.GetAllCourses();
    if (courses.empty()) {
        cerr << "Error: no valid courses were found." << endl;
        return false;
    }
    for (const Course& course : courses) {
        for (const string& prerequisite : course.prerequisites) {
            if (prerequisite == course.courseNumber) {
                cerr << "Course " << course.courseNumber
                     << " cannot require itself." << endl;
                valid = false;
            } else if (candidate.Find(prerequisite) == nullptr) {
                cerr << "Missing prerequisite " << prerequisite << " for "
                     << course.courseNumber << "." << endl;
                valid = false;
            }
        }
    }

    vector<string> schedule;
    if (valid && !createFeasibleSchedule(candidate, schedule)) valid = false;
    if (!valid) {
        cerr << "Data was rejected; the previously loaded courses were preserved." << endl;
        return false;
    }

    table.Clear();
    for (const Course& course : courses) table.Insert(course);
    cout << "Loaded and validated " << courses.size() << " courses." << endl;
    return true;
}

void printCourseInfo(const HashTable& table, const string& input) {
    string courseNumber = normalizeCourseNumber(input);
    const Course* course = table.Find(courseNumber);
    if (course == nullptr) {
        cout << "Course " << courseNumber << " not found." << endl;
        return;
    }
    cout << course->courseNumber << ": " << course->name << endl;
    cout << "Prerequisites:";
    if (course->prerequisites.empty()) cout << " None" << endl;
    else {
        cout << endl;
        for (const string& number : course->prerequisites) {
            const Course* prerequisite = table.Find(number);
            cout << "  " << number << ": " << prerequisite->name << endl;
        }
    }
}

void printCourseList(const HashTable& table) {
    vector<Course> courses = table.GetAllCourses();
    sort(courses.begin(), courses.end(), [](const Course& a, const Course& b) {
        return a.courseNumber < b.courseNumber;
    });
    cout << "Course List:" << endl;
    for (const Course& course : courses)
        cout << course.courseNumber << ": " << course.name << endl;
}

void printSchedule(const HashTable& table) {
    vector<string> order;
    if (!createFeasibleSchedule(table, order)) {
        cout << "A feasible course order could not be created." << endl;
        return;
    }
    cout << "One feasible course order:" << endl;
    for (size_t i = 0; i < order.size(); ++i)
        cout << "  " << i + 1 << ". " << order[i] << ": "
             << table.Find(order[i])->name << endl;
}

int main() {
    HashTable table;
    bool dataLoaded = false;
    int choice = 0;
    cout << "Welcome to ABCU Computer Science Advising Tool" << endl;

    while (choice != 9) {
        cout << "\n1. Load Data Structure\n2. Print Course List\n"
             << "3. Print Course\n4. Print Feasible Course Order\n9. Exit\nChoice: ";
        if (!(cin >> choice)) {
            cin.clear();
            cin.ignore(numeric_limits<streamsize>::max(), '\n');
            cout << "Invalid input. Enter a menu number." << endl;
            continue;
        }
        cin.ignore(numeric_limits<streamsize>::max(), '\n');

        if (choice == 1) {
            string fileName;
            cout << "Course data file: ";
            getline(cin, fileName);
            if (trim(fileName).empty()) cout << "File name cannot be empty." << endl;
            else if (loadCourses(trim(fileName), table)) dataLoaded = true;
        } else if (choice == 9) {
            cout << "Goodbye!" << endl;
        } else if (!dataLoaded) {
            cout << "Load valid course data first." << endl;
        } else if (choice == 2) {
            printCourseList(table);
        } else if (choice == 3) {
            string courseNumber;
            cout << "Course number: ";
            getline(cin, courseNumber);
            printCourseInfo(table, courseNumber);
        } else if (choice == 4) {
            printSchedule(table);
        } else {
            cout << "Invalid menu choice." << endl;
        }
    }
    return 0;
}
