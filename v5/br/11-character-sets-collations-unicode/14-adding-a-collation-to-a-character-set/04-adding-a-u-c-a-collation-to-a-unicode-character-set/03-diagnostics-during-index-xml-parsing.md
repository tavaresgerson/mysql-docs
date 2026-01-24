#### 10.14.4.3 Diagnóstico Durante a Análise de Index.xml

O servidor MySQL gera diagnósticos quando encontra problemas durante a análise do arquivo `Index.xml`:

* Tags desconhecidas são escritas no *error log*. Por exemplo, a seguinte mensagem é gerada se uma definição de *collation* contiver uma *tag* `<aaa>`:

  ```sql
  [Warning] Buffered warning: Unknown LDML tag:
  'charsets/charset/collation/rules/aaa'
  ```

* Se a inicialização do *collation* não for possível, o servidor relata um erro de "Unknown collation" e também gera *warnings* explicando os problemas, como no exemplo anterior. Em outros casos, quando uma descrição de *collation* está geralmente correta, mas contém algumas *tags* desconhecidas, o *collation* é inicializado e fica disponível para uso. As partes desconhecidas são ignoradas, mas um *warning* é gerado no *error log*.

* Problemas com *collations* geram *warnings* que os *clients* podem exibir usando `SHOW WARNINGS`. Suponha que uma regra de *reset* contenha uma expansão maior do que o comprimento máximo suportado de 6 caracteres:

  ```sql
  <reset>abcdefghi</reset>
  <i>x</i>
  ```

  Uma tentativa de usar o *collation* produz *warnings*:

  ```sql
  mysql> SELECT _utf8'test' COLLATE utf8_test_ci;
  ERROR 1273 (HY000): Unknown collation: 'utf8_test_ci'
  mysql> SHOW WARNINGS;
  +---------+------+----------------------------------------+
  | Level   | Code | Message                                |
  +---------+------+----------------------------------------+
  | Error   | 1273 | Unknown collation: 'utf8_test_ci'      |
  | Warning | 1273 | Expansion is too long at 'abcdefghi=x' |
  +---------+------+----------------------------------------+
  ```