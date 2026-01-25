## 7.6 Manutenção de Tabelas MyISAM e Recuperação de Falhas

7.6.1 Usando myisamchk para Recuperação de Falhas (Crash Recovery)

7.6.2 Como Verificar Tabelas MyISAM em Busca de Erros

7.6.3 Como Reparar Tabelas MyISAM

7.6.4 Otimização de Tabelas MyISAM

7.6.5 Configurando um Cronograma de Manutenção de Tabelas MyISAM

Esta seção discute como usar o **myisamchk** para verificar ou reparar tabelas `MyISAM` (tabelas que possuem arquivos `.MYD` e `.MYI` para armazenar data e Indexes). Para informações gerais sobre o **myisamchk**, consulte a Seção 4.6.3, “myisamchk — MyISAM Table-Maintenance Utility”. Outras informações sobre reparo de tabela podem ser encontradas na Seção 2.10.12, “Rebuilding or Repairing Tables or Indexes”.

Você pode usar o **myisamchk** para verificar, reparar ou otimizar tabelas de Database. As seções a seguir descrevem como executar essas operações e como configurar um cronograma de manutenção de tabela. Para obter informações sobre como usar o **myisamchk** para obter informações sobre suas tabelas, consulte a Seção 4.6.3.5, “Obtaining Table Information with myisamchk”.

Embora o reparo de tabela com o **myisamchk** seja bastante seguro, é sempre uma boa prática fazer um backup *antes* de realizar um reparo ou qualquer operação de manutenção que possa fazer muitas alterações em uma tabela.

Operações do **myisamchk** que afetam Indexes podem fazer com que os Indexes `FULLTEXT` do `MyISAM` sejam reconstruídos com parâmetros full-text que são incompatíveis com os valores usados pelo MySQL server. Para evitar esse problema, siga as diretrizes na Seção 4.6.3.1, “myisamchk General Options”.

A manutenção de tabelas `MyISAM` também pode ser feita usando as instruções SQL que executam operações semelhantes às que o **myisamchk** pode realizar:

* Para verificar tabelas `MyISAM`, use `CHECK TABLE`.

* Para reparar tabelas `MyISAM`, use `REPAIR TABLE`.

* Para otimizar tabelas `MyISAM`, use `OPTIMIZE TABLE`.

* Para analisar tabelas `MyISAM`, use `ANALYZE TABLE`.

Para informações adicionais sobre essas instruções, consulte a Seção 13.7.2, “Table Maintenance Statements”.

Essas instruções podem ser usadas diretamente ou por meio do programa cliente **mysqlcheck**. Uma vantagem dessas instruções sobre o **myisamchk** é que o server faz todo o trabalho. Com o **myisamchk**, você deve garantir que o server não utilize as tabelas simultaneamente, para que não haja interação indesejada entre o **myisamchk** e o server.