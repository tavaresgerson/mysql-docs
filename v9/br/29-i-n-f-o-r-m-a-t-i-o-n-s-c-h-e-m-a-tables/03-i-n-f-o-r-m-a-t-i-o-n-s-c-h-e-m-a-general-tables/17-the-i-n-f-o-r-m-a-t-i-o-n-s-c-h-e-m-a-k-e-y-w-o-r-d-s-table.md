### 28.3.17 A Tabela `INFORMATION\_SCHEMA\_KEYWORDS`

A tabela `KEYWORDS` lista as palavras consideradas palavras-chave pelo MySQL e, para cada uma delas, indica se ela é reservada. Palavras-chave reservadas podem exigir tratamento especial em alguns contextos, como a citação especial quando usadas como identificadores (veja a Seção 11.3, “Palavras-chave e Palavras Reservadas”). Esta tabela fornece às aplicações uma fonte de tempo de execução de informações sobre palavras-chave do MySQL.

A tabela `KEYWORDS` tem as seguintes colunas:

* `WORD`

  A palavra-chave.

* `RESERVED`

  Um inteiro que indica se a palavra-chave é reservada (1) ou não reservada (0).

Estas consultas listam todas as palavras-chave, todas as palavras-chave reservadas e todas as palavras-chave não reservadas, respectivamente:

```
SELECT * FROM INFORMATION_SCHEMA.KEYWORDS;
SELECT WORD FROM INFORMATION_SCHEMA.KEYWORDS WHERE RESERVED = 1;
SELECT WORD FROM INFORMATION_SCHEMA.KEYWORDS WHERE RESERVED = 0;
```

As duas últimas consultas são equivalentes a:

```
SELECT WORD FROM INFORMATION_SCHEMA.KEYWORDS WHERE RESERVED;
SELECT WORD FROM INFORMATION_SCHEMA.KEYWORDS WHERE NOT RESERVED;
```

Se você construir o MySQL a partir do código-fonte, o processo de construção gera um arquivo de cabeçalho `keyword_list.h` contendo uma matriz de palavras-chave e seu status de reserva. Este arquivo pode ser encontrado no diretório `sql` sob o diretório de construção. Este arquivo pode ser útil para aplicações que requerem uma fonte estática para a lista de palavras-chave.