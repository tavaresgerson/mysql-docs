### 12.16.9 Functions That Test Spatial Relations Between Geometry Objects

12.16.9.1 Spatial Relation Functions That Use Object Shapes

12.16.9.2 Spatial Relation Functions That Use Minimum Bounding Rectangles

The functions described in this section take two geometries as arguments and return a qualitative or quantitative relation between them.

MySQL implements two sets of functions using function names defined by the OpenGIS specification. One set tests the relationship between two geometry values using precise object shapes, the other set uses object minimum bounding rectangles (MBRs).

There is also a MySQL-specific set of MBR-based functions available to test the relationship between two geometry values.
