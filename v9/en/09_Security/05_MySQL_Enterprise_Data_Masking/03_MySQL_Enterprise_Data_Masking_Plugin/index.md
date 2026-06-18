### 8.5.3 MySQL Enterprise Data Masking Plugin

[8.5.3.1 MySQL Enterprise Data Masking Plugin Installation](data-masking-plugin-installation.html)

[8.5.3.2 Using the MySQL Enterprise Data Masking Plugin](data-masking-plugin-usage.html)

[8.5.3.3 MySQL Enterprise Data Masking Plugin Function Reference](data-masking-plugin-function-reference.html)

[8.5.3.4 MySQL Enterprise Data Masking Plugin Function Descriptions](data-masking-plugin-functions.html)

MySQL Enterprise Data Masking is based on a plugin library that implements these
elements:

* A server-side plugin named `data_masking`.
* A set of loadable functions provides an SQL-level API for
  performing masking and de-identification operations. Some of
  these functions require the
  [`SUPER`](privileges-provided.html#priv_super) privilege.