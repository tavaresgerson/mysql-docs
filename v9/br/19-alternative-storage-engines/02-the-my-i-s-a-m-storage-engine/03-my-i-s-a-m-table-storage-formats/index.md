### 18.2.3 Formatos de Armazenamento de Tabelas `MyISAM`

18.2.3.1 Características Estáticas (Com Largura Fixa) das Tabelas

18.2.3.2 Características Dinâmicas das Tabelas

18.2.3.3 Características Compactadas das Tabelas

O `MyISAM` suporta três formatos de armazenamento diferentes. Dois deles, o formato fixo e o formato dinâmico, são escolhidos automaticamente dependendo do tipo de colunas que você está usando. O terceiro, o formato compactado, só pode ser criado com o utilitário **myisampack** (veja a Seção 6.6.6, “myisampack — Gerar Tabelas `MyISAM` Compactadas e Apenas de Leitura”).

Quando você usa `CREATE TABLE` ou `ALTER TABLE` para uma tabela que não tem colunas `BLOB` ou `TEXT`, você pode forçar o formato da tabela para `FIXED` ou `DYNAMIC` com a opção de tabela `ROW_FORMAT`.

Consulte a Seção 15.1.24, “Instrução CREATE TABLE”, para obter informações sobre `ROW_FORMAT`.

Você pode descompactuar (descompactar) tabelas `MyISAM` compactadas usando **myisamchk** `--unpack`; consulte a Seção 6.6.4, “myisamchk — Ferramenta de Manutenção de Tabelas `MyISAM’”, para obter mais informações.