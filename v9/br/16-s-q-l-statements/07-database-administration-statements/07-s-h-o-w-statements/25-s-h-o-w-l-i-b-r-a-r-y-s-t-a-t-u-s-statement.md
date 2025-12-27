#### 15.7.7.25.25 Mostrar Status da Biblioteca

```
SHOW LIBRARY STATUS
    [LIKE 'pattern' | WHERE expr]
```

Esta declaração fornece informações sobre uma ou mais bibliotecas JavaScript. Assim como `SHOW FUNCTION STATUS` e `SHOW PROCEDURE STATUS`, ela suporta cláusulas `LIKE` e `WHERE` para filtrar o resultado. Consulte a Seção 15.7.7.31, “Declaração SHOW PROCEDURE STATUS”, para obter informações sobre como essas cláusulas funcionam.

`SHOW LIBRARY STATUS` contém as seguintes colunas:

* `Db`

  O nome do banco de dados que contém a biblioteca.

* `Name`

  O nome da biblioteca.

* `Type`

  O tipo da biblioteca. Isso é sempre `LIBRARY`.

* `Creator`

  A conta que criou a biblioteca.

* `Modified`

  O timestamp que mostra quando a biblioteca foi modificada pela última vez.

* `Created`

  O timestamp que mostra quando a biblioteca foi criada.

* `Comment`

  Texto de comentário, se houver.

Exemplo:

```
mysql> SHOW LIBRARY STATUS LIKE 'my_lib'\G
*************************** 1. row ***************************
                  Db: test
                Name: my_lib
                Type: LIBRARY
             Creator: jon@localhost
            Modified: 2025-03-21 08:42:17
             Created: 2025-01-13 17:24:08
             Comment: This is my_lib. There are many others like it, but
                      this one is mine.
1 row in set (0.00 sec)
```

Consulte a Seção 27.3.8, “Usar Bibliotecas JavaScript”, para obter mais informações.