### 8.5.3 MySQL Enterprise Data Masking Plugin

MySQL Enterprise Data Masking is based on a plugin library that implements these
elements:

* A server-side plugin named `data_masking`.
* A set of loadable functions provides an SQL-level API for
  performing masking and de-identification operations. Some of
  these functions require the
  [`SUPER`](privileges-provided.html#priv_super) privilege.