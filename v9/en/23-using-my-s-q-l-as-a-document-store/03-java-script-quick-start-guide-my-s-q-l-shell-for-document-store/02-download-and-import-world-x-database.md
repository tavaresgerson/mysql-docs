### 22.3.2 Download and Import world\_x Database

As part of this quick-start guide, an example schema is provided which is referred to as the `world_x` schema. Many of the examples demonstrate Document Store functionality using this schema. Start your MySQL server so that you can load the `world_x` schema, then follow these steps:

1. Download world\_x-db.zip.

2. Extract the installation archive to a temporary location such as `/tmp/`. Unpacking the archive results in a single file named `world_x.sql`.

3. Import the `world_x.sql` file to your server. You can either:

   * Start MySQL Shell in SQL mode and import the file by issuing:

     ```
     mysqlsh -u root --sql --file /tmp/world_x-db/world_x.sql
     Enter password: ****
     ```

   * Set MySQL Shell to SQL mode while it is running and source the schema file by issuing:

     ```
     \sql
     Switching to SQL mode... Commands end with ;
     \source /tmp/world_x-db/world_x.sql
     ```

   Replace `/tmp/` with the path to the `world_x.sql` file on your system. Enter your password if prompted. A non-root account can be used as long as the account has privileges to create new schemas.

#### The world\_x Schema

The `world_x` example schema contains the following JSON collection and relational tables:

* Collection

  + `countryinfo`: Information about countries in the world.

* Tables

  + `country`: Minimal information about countries of the world.

  + `city`: Information about some of the cities in those countries.

  + `countrylanguage`: Languages spoken in each country.

#### Related Information

* MySQL Shell Sessions explains session types.
