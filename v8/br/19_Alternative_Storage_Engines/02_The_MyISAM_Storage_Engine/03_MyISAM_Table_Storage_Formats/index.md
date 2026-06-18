### 18.2.3 Formas de armazenamento de tabelas MyISAM

18.2.3.1 Características da tabela estática (com comprimento fixo)

18.2.3.2 Características dinâmicas da tabela

18.2.3.3 Características da Tabela Compactada

`MyISAM` suporta três formatos de armazenamento diferentes. Dois deles, o formato fixo e o formato dinâmico, são escolhidos automaticamente dependendo do tipo de colunas que você está usando. O terceiro, o formato compactado, só pode ser criado com o utilitário **myisampack** (veja a Seção 6.6.6, “myisampack — Gerar tabelas MyISAM compactadas e somente de leitura”).

Quando você usa `CREATE TABLE` ou `ALTER TABLE` para uma tabela que não tem colunas `BLOB` ou `TEXT`, você pode forçar o formato da tabela para `FIXED` ou `DYNAMIC` com a opção de tabela `ROW_FORMAT`.

Consulte a Seção 15.1.20, “Instrução CREATE TABLE”, para obter informações sobre `ROW_FORMAT`.

Você pode descomprimir (descompactar) tabelas compactadas `MyISAM` usando **myisamchk** `--unpack`; consulte a Seção 6.6.4, “myisamchk — Ferramenta de Manutenção de Tabelas MyISAM”, para obter mais informações.
