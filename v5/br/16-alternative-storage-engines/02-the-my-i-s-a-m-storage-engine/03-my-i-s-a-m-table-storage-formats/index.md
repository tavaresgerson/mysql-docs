### 15.2.3 Formatos de Armazenamento de Tabela MyISAM

15.2.3.1 Características de Tabela Estática (Comprimento Fixo)

15.2.3.2 Características de Tabela Dinâmica

15.2.3.3 Características de Tabela Compactada

O `MyISAM` suporta três formatos de armazenamento diferentes. Dois deles, o formato `fixed` (fixo) e `dynamic` (dinâmico), são escolhidos automaticamente dependendo do tipo de colunas que você está usando. O terceiro, formato compactado, pode ser criado apenas com o utilitário **myisampack** (veja Seção 4.6.5, “myisampack — Generate Compressed, Read-Only MyISAM Tables”).

Quando você usa `CREATE TABLE` ou `ALTER TABLE` para uma tabela que não possui colunas `BLOB` ou `TEXT`, você pode forçar o formato da tabela para `FIXED` ou `DYNAMIC` usando a opção de tabela `ROW_FORMAT`.

Veja Seção 13.1.18, “CREATE TABLE Statement”, para obter informações sobre `ROW_FORMAT`.

Você pode descompactar (unpack) tabelas `MyISAM` compactadas usando **myisamchk** `--unpack`; veja Seção 4.6.3, “myisamchk — MyISAM Table-Maintenance Utility”, para mais informações.