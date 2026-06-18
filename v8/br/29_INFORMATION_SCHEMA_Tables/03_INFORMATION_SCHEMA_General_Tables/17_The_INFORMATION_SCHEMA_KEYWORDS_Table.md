### 28.3.17 A tabela INFORMATION\_SCHEMA KEYWORDS

A tabela `KEYWORDS` lista as palavras consideradas palavras-chave pelo MySQL e, para cada uma delas, indica se ela é reservada. Palavras-chave reservadas podem exigir tratamento especial em alguns contextos, como a citação especial quando usadas como identificadores (veja a Seção 11.3, “Palavras-chave e Palavras Reservadas”). Esta tabela fornece às aplicações uma fonte de informações em tempo de execução sobre palavras-chave do MySQL.

Antes do MySQL 8.0.13, a seleção da tabela `KEYWORDS` sem a seleção de um banco de dados padrão produzia um erro. (Bug #90160, Bug #27729859)

A tabela `KEYWORDS` tem essas colunas:

- `WORD`

  A palavra-chave.

- `RESERVED`

  Um número inteiro que indica se a palavra-chave é reservada (1) ou não reservada (0).

Essas consultas listam todas as palavras-chave, todas as palavras-chave reservadas e todas as palavras-chave não reservadas, respectivamente:

```
SELECT * FROM INFORMATION_SCHEMA.KEYWORDS;
SELECT WORD FROM INFORMATION_SCHEMA.KEYWORDS WHERE RESERVED = 1;
SELECT WORD FROM INFORMATION_SCHEMA.KEYWORDS WHERE RESERVED = 0;
```

As duas últimas perguntas são equivalentes a:

```
SELECT WORD FROM INFORMATION_SCHEMA.KEYWORDS WHERE RESERVED;
SELECT WORD FROM INFORMATION_SCHEMA.KEYWORDS WHERE NOT RESERVED;
```

Se você construir o MySQL a partir do código-fonte, o processo de compilação gera um arquivo de cabeçalho `keyword_list.h` contendo uma matriz de palavras-chave e seu status reservado. Esse arquivo pode ser encontrado no diretório `sql` sob o diretório de compilação. Esse arquivo pode ser útil para aplicativos que exigem uma fonte estática para a lista de palavras-chave.
