### 15.2.3 Formas de armazenamento de tabelas MyISAM

15.2.3.1 Características da tabela estática (com comprimento fixo)

15.2.3.2 Características dinâmicas da tabela

15.2.3.3 Características da Tabela Compactada

`MyISAM` suporta três formatos de armazenamento diferentes. Dois deles, o formato fixo e o formato dinâmico, são escolhidos automaticamente dependendo do tipo de colunas que você está usando. O terceiro, o formato compactado, só pode ser criado com o utilitário **myisampack** (veja a Seção 4.6.5, “myisampack — Gerar tabelas MyISAM compactadas e somente leitura”).

Quando você usa `CREATE TABLE` ou `ALTER TABLE` para uma tabela que não tem colunas `BLOB` ou `TEXT`, você pode forçar o formato da tabela para `FIXED` ou `DYNAMIC` com a opção `ROW_FORMAT` da tabela.

Consulte a Seção 13.1.18, “Instrução CREATE TABLE”, para obter informações sobre `ROW_FORMAT`.

Você pode descomprimir (descompactar) tabelas compactadas do tipo `MyISAM` usando **myisamchk** `--unpack`; consulte a Seção 4.6.3, “myisamchk — Ferramenta de Manutenção de Tabelas MyISAM”, para obter mais informações.
