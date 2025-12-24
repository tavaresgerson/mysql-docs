### 2.8.10 Generating MySQL Doxygen Documentation Content

The MySQL source code contains internal documentation written using Doxygen. The generated Doxygen content is available at https://dev.mysql.com/doc/index-other.html. It is also possible to generate this content locally from a MySQL source distribution using the following procedure:

1. Install `doxygen` 1.9.2 or later. Distributions are available here at <http://www.doxygen.nl/>.

   After installing `doxygen`, verify the version number:

   ```
   $> doxygen --version
   1.9.2
   ```
2. Install PlantUML.

   When you install PlantUML on Windows (tested on Windows 10), you must run it at least once as administrator so it creates the registry keys. Open an administrator console and run this command:

   ```
   $> java -jar path-to-plantuml.jar
   ```

   The command should open a GUI window and return no errors on the console.
3. Set the `PLANTUML_JAR_PATH` environment to the location where you installed PlantUML. For example:

   ```
   $> export PLANTUML_JAR_PATH=path-to-plantuml.jar
   ```
4. Install the Graphviz `dot` command.

   After installing Graphviz, verify `dot` availability. For example:

   ```
   $> which dot
   /usr/bin/dot

   $> dot -V
   dot - graphviz version 2.40.1 (20161225.0304)
   ```
5. Change location to the top-level directory of your MySQL source distribution and do the following:

   First, execute `cmake`:

   ```
   $> cd mysql-source-directory
   $> mkdir build
   $> cd build
   $> cmake ..
   ```

   Next, generate the `doxygen` documentation:

   ```
   $> make doxygen
   ```

   Inspect the error log, which is available in the `doxyerror.log` file in the top-level directory. Assuming that the build executed successfully, view the generated output using a browser. For example:

   ```
   $> firefox doxygen/html/index.html
   ```
