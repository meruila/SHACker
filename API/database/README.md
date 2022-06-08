# Database
This directory contains all database helper functions, models, and dump data. 
## Directories
- `curriculum`: contains JSON files of 2018 CAS curricula and subjects
- `dump`: dump data of curriculum and subjects for checking in MongoDB.   
	- To use: `mongorestore`
	- `mongodump` and `mongorestore` are part of the MongoDB Database Tools collection and may need to be separately downloaded alongside MongoDB.
	- It is not necessary to run `mongorestore` to use this data with the application, since an initialization script for the curriculum and subject data is used. This is found in the `helpers` directory.
- `helpers`: contains database helper functions for retrieving, adding, editing, and deleting data in the SHACker system
- `models`: definitions and structure of the student record, user, curriculum, subject, and log models
- `requirements`: initialization scripts for creating the `shac-database` in MongoDB for testing purposes only.
