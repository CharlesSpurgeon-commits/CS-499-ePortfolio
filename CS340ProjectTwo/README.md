## CS 340 — Client/Server Development Portfolio Reflection

### How do you write programs that are maintainable, readable, and adaptable?

I write maintainable, readable, and adaptable programs by organizing code into logical components, using descriptive names, documenting important functions, and separating responsibilities. In Project One, I developed a Python CRUD module that provides methods to create, read, update, and delete records in MongoDB. In Project Two, I reused this module to connect the Grazioso Salvare dashboard to the animal shelter database.

Separating the database operations from the dashboard interface made the application easier to understand and maintain. Instead of writing MongoDB queries throughout the dashboard code, I could use the existing CRUD methods to retrieve the information needed by the interface. This approach also improves adaptability because changes to the database connection or CRUD operations can be handled in one module without requiring major changes to the dashboard. In the future, I could reuse this module in other applications that require MongoDB access, including reporting systems, administrative interfaces, and data analysis tools.

### How do you approach a problem as a computer scientist?

I approach problems by first understanding the requirements, identifying the available data, and breaking the work into smaller tasks that can be implemented and tested individually. For the Grazioso Salvare project, I needed to understand how the organization identifies animals suitable for different rescue activities. I then translated those requirements into database queries and interactive dashboard features.

This project differed from some of my earlier assignments because it required integrating several technologies into a complete application. Rather than focusing only on writing individual functions, I needed to consider database connectivity, data retrieval, filtering, visualization, and user interaction. I tested the MongoDB connection, verified that the application could retrieve animal records, and checked the dashboard's rescue filters, data table, chart, and map.

In future projects, I would continue gathering requirements before implementation, examining the structure and quality of the available data, developing reusable components, and testing each feature independently. I would also consider database indexes, input validation, access controls, and efficient query design to improve performance and security.

### What do computer scientists do, and why does it matter?

Computer scientists design, develop, evaluate, and improve computing solutions that help individuals and organizations solve problems. Their work involves more than writing code; it also includes analyzing requirements, selecting appropriate technologies, protecting information, and ensuring that applications provide useful and reliable results.

My work on the Grazioso Salvare dashboard demonstrates how software can turn a large collection of records into information that supports decision-making. The dashboard allows users to filter animal records by rescue category, examine matching animals in a table, compare breed information through a chart, and view geographic information on a map.

For an organization like Grazioso Salvare, these capabilities can reduce the time required to identify potential rescue candidates and make information easier to interpret. The project also reinforced the importance of secure database access, maintainable software architecture, and clear presentation of data. These are skills I intend to continue developing as I pursue a career in information security and computing.
