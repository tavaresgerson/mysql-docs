#### 12.14.4.3 Diagnósticos durante a análise do Index.xml

O servidor MySQL gera diagnósticos quando encontra problemas durante a análise do arquivo `Index.xml`:

* Marcas desconhecidas são escritas no log de erro. Por exemplo, a seguinte mensagem é gerada se uma definição de cotação contiver uma marca `<aaa>`:

  ```
  [Warning] Buffered warning: Unknown LDML tag:
  'charsets/charset/collation/rules/aaa'
  ```

* Se a inicialização da cotação não for possível, o servidor gera um erro de "Cotação desconhecida" e também gera avisos explicando os problemas, como no exemplo anterior. Em outros casos, quando uma descrição de cotação é geralmente correta, mas contém algumas marcas desconhecidas, a cotação é inicializada e está disponível para uso. As partes desconhecidas são ignoradas, mas um aviso é gerado no log de erro.

* Problemas com as cotações geram avisos que os clientes podem exibir com `SHOW WARNINGS`. Suponha que uma regra de redefinição contenha uma expansão mais longa que o comprimento máximo suportado de 6 caracteres:

  ```
  <reset>abcdefghi</reset>
  <i>x</i>
  ```

  Uma tentativa de usar a cotação gera avisos:

  ```
  mysql> SELECT _utf8mb4'test' COLLATE utf8mb4_test_ci;
  ERROR 1273 (HY000): Unknown collation: 'utf8mb4_test_ci'
  mysql> SHOW WARNINGS;
  +---------+------+----------------------------------------+
  | Level   | Code | Message                                |
  +---------+------+----------------------------------------+
  | Error   | 1273 | Unknown collation: 'utf8mb4_test_ci'   |
  | Warning | 1273 | Expansion is too long at 'abcdefghi=x' |
  +---------+------+----------------------------------------+
  ```