### 28.3.35 A Tabela ROUTINE\_LIBRARIES da SÍNTESE DE INFORMAÇÃO

A tabela `ROUTINE_LIBRARIES` lista diferentes rotinas JavaScript e as bibliotecas suportadas pelo Componente do Motor Multilíngue (MLE) (ver Seção 7.5.7, “Componente do Motor Multilíngue (MLE”)”) que são importadas por essas rotinas JavaScript.

A tabela `ROUTINE_LIBRARIES` tem as colunas listadas aqui:

* `ROUTINE_CATALOG`

  Nome do catálogo da rotina. Atualmente, isso é sempre `def`.

* `ROUTINE_SCHEMA`

  Esquema ou banco de dados da rotina.

* `ROUTINE_NAME`

  Nome da rotina.

* `ROUTINE_TYPE`

  Tipo de rotina. Uma das opções `FUNCTION`, `PROCEDURE` ou `LIBRARY`.

* `LIBRARY_CATALOG`

  Nome do catálogo da biblioteca. Atualmente, isso é sempre `def`.

* `LIBRARY_SCHEMA`

  Banco de dados ou esquema da biblioteca.

* `LIBRARY_NAME`

  Nome da biblioteca.

* `LIBRARY_VERSION`

  Versão da biblioteca.

Exemplo:

```
mysql> TABLE information_schema.ROUTINE_LIBRARIES\G
*************************** 1. row ***************************
ROUTINE_CATALOG: def
 ROUTINE_SCHEMA: jslib
   ROUTINE_NAME: foo
   ROUTINE_TYPE: FUNCTION
LIBRARY_CATALOG: def
 LIBRARY_SCHEMA: jslib
   LIBRARY_NAME: lib1
LIBRARY_VERSION: NULL
*************************** 2. row ***************************
ROUTINE_CATALOG: def
 ROUTINE_SCHEMA: jslib
   ROUTINE_NAME: foo
   ROUTINE_TYPE: FUNCTION
LIBRARY_CATALOG: def
 LIBRARY_SCHEMA: jslib
   LIBRARY_NAME: lib2
LIBRARY_VERSION: NULL
2 rows in set (0.00 sec)
```

Todas as rotinas armazenadas que importam bibliotecas estão listadas na tabela `ROUTINE_LIBRARIES`, mesmo que a Biblioteca referenciada não exista.