#### 10.14.4.3 Diagnósticos durante a análise do Index.xml

O servidor MySQL gera diagnósticos quando encontra problemas ao analisar o arquivo `Index.xml`:

- Marcadores desconhecidos são escritos no log de erros. Por exemplo, a seguinte mensagem é gerada se uma definição de ordenação contiver um marcador `<aaa>`:

  ```sql
  [Warning] Buffered warning: Unknown LDML tag:
  'charsets/charset/collation/rules/aaa'
  ```

- Se a inicialização da codificação não for possível, o servidor relata um erro de “Codificação desconhecida” e também gera avisos explicando os problemas, como no exemplo anterior. Em outros casos, quando a descrição da codificação é geralmente correta, mas contém algumas tags desconhecidas, a codificação é inicializada e está disponível para uso. As partes desconhecidas são ignoradas, mas um aviso é gerado no log de erros.

- Problemas com as colatações geram avisos que os clientes podem exibir com `SHOW WARNINGS`. Suponha que uma regra de redefinição contenha uma expansão maior que o comprimento máximo suportado de 6 caracteres:

  ```sql
  <reset>abcdefghi</reset>
  <i>x</i>
  ```

  Uma tentativa de usar a ordenação produz avisos:

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
